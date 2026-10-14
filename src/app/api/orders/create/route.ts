import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderReference, normalizeWhatsAppNumber } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const OrderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().positive(),
  customizationNote: z.string().max(200).optional(),
});

const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  serviceType: z.enum(["TAKEOUT", "DELIVERY"]).default("TAKEOUT"),
  requestedDate: z.string().min(1, "Pickup date is required"),
  requestedTime: z.string().min(1, "Pickup time slot is required"),
  deliveryAddress: z.string().optional(),
  notes: z.string().max(500).optional(),
  promoCode: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, "Basket cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // Rate limiting: max 10 order creation requests per minute per IP
    const rateCheck = checkRateLimit(`order_create_${clientIp}`, {
      intervalMs: 60 * 1000,
      maxRequests: 10,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many order submissions. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      serviceType,
      requestedDate,
      requestedTime,
      deliveryAddress,
      notes,
      promoCode,
      items,
    } = parsed.data;

    // Fetch settings to check ordering toggles
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (settings?.isMaintenanceMode) {
      return NextResponse.json(
        { error: "Ordering is temporarily paused due to kitchen maintenance." },
        { status: 403 }
      );
    }

    if (settings && !settings.isOnlineOrderingEnabled) {
      return NextResponse.json(
        { error: "Online order placement is currently disabled." },
        { status: 403 }
      );
    }

    if (serviceType === "DELIVERY" && !settings?.isDeliveryEnabled) {
      return NextResponse.json(
        { error: "Delivery is currently disabled. Please select Takeout pickup." },
        { status: 400 }
      );
    }

    // SERVER-SIDE TRANSACTION: Recalculate all item prices from database atomically
    const orderResult = await prisma.$transaction(async (tx) => {
      let calculatedSubtotal = 0;
      const verifiedItems: {
        productId: string;
        variantId: string | null;
        productName: string;
        variantName: string | null;
        unitPrice: number;
        quantity: number;
        subtotal: number;
        customizationNote?: string;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product || product.availability === "UNAVAILABLE") {
          throw new Error(`Item ${item.productId} is unavailable.`);
        }

        let variantPriceAdjustment = 0;
        let variantName: string | null = null;

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (variant) {
            variantPriceAdjustment = variant.priceAdjustment;
            variantName = variant.name;
          }
        }

        const trueUnitPrice = product.basePrice + variantPriceAdjustment;
        const lineSubtotal = trueUnitPrice * item.quantity;
        calculatedSubtotal += lineSubtotal;

        // Concurrency-Safe Stock Check and Conditional Decrement (OWASP & ACID Concurrency)
        if (product.isStockTracked) {
          const updateResult = await tx.product.updateMany({
            where: {
              id: product.id,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (updateResult.count === 0) {
            throw new Error(
              `Insufficient stock for "${product.name}". The item was just claimed by another order.`
            );
          }
        }

        verifiedItems.push({
          productId: product.id,
          variantId: item.variantId || null,
          productName: product.name,
          variantName,
          unitPrice: trueUnitPrice,
          quantity: item.quantity,
          subtotal: lineSubtotal,
          customizationNote: item.customizationNote,
        });
      }

      // Check minimum order value
      if (settings?.minOrderValue && calculatedSubtotal < settings.minOrderValue) {
        throw new Error(
          `Minimum order value is PKR ${settings.minOrderValue}.`
        );
      }

      // Calculate discount on server with concurrency-safe usage increment
      let calculatedDiscount = 0;
      if (promoCode) {
        const promo = await tx.promotion.findUnique({
          where: { code: promoCode.trim().toUpperCase() },
        });

        if (
          promo &&
          promo.isActive &&
          (!promo.expiresAt || promo.expiresAt >= new Date()) &&
          calculatedSubtotal >= promo.minOrderValue
        ) {
          // Concurrency-safe atomic promotion usage reservation
          let usageAllowed = true;
          if (promo.maxUses !== null) {
            const promoUpdate = await tx.promotion.updateMany({
              where: {
                id: promo.id,
                currentUses: { lt: promo.maxUses },
              },
              data: {
                currentUses: { increment: 1 },
              },
            });
            usageAllowed = promoUpdate.count > 0;
          } else {
            await tx.promotion.update({
              where: { id: promo.id },
              data: { currentUses: { increment: 1 } },
            });
          }

          if (usageAllowed) {
            if (promo.discountType === "PERCENTAGE") {
              calculatedDiscount = Math.round(
                (calculatedSubtotal * promo.discountValue) / 100
              );
            } else {
              calculatedDiscount = promo.discountValue;
            }
            calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
          }
        }
      }

      const deliveryFee = serviceType === "DELIVERY" ? (settings?.deliveryFee || 250) : 0;
      const finalTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + deliveryFee);

      // Generate Reference with collision-safe creation
      let orderRef = generateOrderReference();
      let created = false;
      let newOrder = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          newOrder = await tx.order.create({
            data: {
              orderReference: orderRef,
              customerName,
              customerPhone,
              customerEmail: customerEmail || null,
              serviceType,
              requestedDate,
              requestedTime,
              deliveryAddress: serviceType === "DELIVERY" ? deliveryAddress : null,
              notes: notes || null,
              status: "PENDING",
              subtotal: calculatedSubtotal,
              discount: calculatedDiscount,
              deliveryFee,
              total: finalTotal,
              isWhatsAppInitiated: true,
              items: {
                create: verifiedItems.map((vi) => ({
                  productId: vi.productId,
                  variantId: vi.variantId,
                  productName: vi.productName,
                  variantName: vi.variantName,
                  unitPrice: vi.unitPrice,
                  quantity: vi.quantity,
                  subtotal: vi.subtotal,
                  customizationNote: vi.customizationNote || null,
                })),
              },
            },
            include: { items: true },
          });
          created = true;
          break;
        } catch (createErr: unknown) {
          const err = createErr as Error;
          if (err.message && err.message.includes("Unique constraint")) {
            orderRef = generateOrderReference(); // regenerate and retry
          } else {
            throw createErr;
          }
        }
      }

      if (!created || !newOrder) {
        throw new Error("Failed to assign a unique order reference. Please retry.");
      }

      return newOrder;
    });

    // Construct official WhatsApp URL message
    const itemLines = orderResult.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.productName}${it.variantName ? ` (${it.variantName})` : ""}${
            it.customizationNote ? ` [Note: ${it.customizationNote}]` : ""
          } — PKR ${it.subtotal}`
      )
      .join("\n");

    const message = [
      `*NEW HOME BAKERY ORDER — #${orderResult.orderReference}*`,
      `---------------------------------`,
      `*Customer:* ${orderResult.customerName}`,
      `*Phone:* ${orderResult.customerPhone}`,
      `*Service:* ${orderResult.serviceType === "TAKEOUT" ? "Takeout Pickup (Gulberg Town)" : "Delivery"}`,
      `*Scheduled For:* ${orderResult.requestedDate} (${orderResult.requestedTime})`,
      orderResult.deliveryAddress ? `*Delivery Address:* ${orderResult.deliveryAddress}` : null,
      orderResult.notes ? `*Special Notes:* ${orderResult.notes}` : null,
      `---------------------------------`,
      `*ITEMS ORDERED:*`,
      itemLines,
      `---------------------------------`,
      `*Subtotal:* PKR ${orderResult.subtotal}`,
      orderResult.discount > 0 ? `*Discount:* -PKR ${orderResult.discount}` : null,
      orderResult.deliveryFee > 0 ? `*Delivery Fee:* PKR ${orderResult.deliveryFee}` : null,
      `*TOTAL:* PKR ${orderResult.total}`,
      `---------------------------------`,
      `_This order has been registered in the Home Bakery system. Please reply to confirm availability and accept._`,
    ]
      .filter(Boolean)
      .join("\n");

    const whatsAppUrl = `https://wa.me/${normalizeWhatsAppNumber(BUSINESS_INFO.whatsappNumber)}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      orderReference: orderResult.orderReference,
      total: orderResult.total,
      whatsAppUrl,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}

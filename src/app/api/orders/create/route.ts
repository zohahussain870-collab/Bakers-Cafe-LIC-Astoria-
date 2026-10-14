import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderReference, normalizeWhatsAppNumber } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
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

    // SERVER-SIDE TRANSACTION: Recalculate all item prices from database
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

        // Check stock if tracked
        if (product.isStockTracked) {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}.`);
          }
          // Decrement stock
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          });
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

      // Calculate discount on server
      let calculatedDiscount = 0;
      if (promoCode) {
        const promo = await tx.promotion.findUnique({
          where: { code: promoCode.trim().toUpperCase() },
        });

        if (
          promo &&
          promo.isActive &&
          (!promo.expiresAt || promo.expiresAt >= new Date()) &&
          calculatedSubtotal >= promo.minOrderValue &&
          (!promo.maxUses || promo.currentUses < promo.maxUses)
        ) {
          if (promo.discountType === "PERCENTAGE") {
            calculatedDiscount = Math.round(
              (calculatedSubtotal * promo.discountValue) / 100
            );
          } else {
            calculatedDiscount = promo.discountValue;
          }
          calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);

          // Increment promo usage
          await tx.promotion.update({
            where: { id: promo.id },
            data: { currentUses: { increment: 1 } },
          });
        }
      }

      const deliveryFee = serviceType === "DELIVERY" ? (settings?.deliveryFee || 250) : 0;
      const finalTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + deliveryFee);

      // Unique Reference Code
      const orderRef = generateOrderReference();

      // Create Order
      const newOrder = await tx.order.create({
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
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}

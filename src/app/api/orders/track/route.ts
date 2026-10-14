import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeWhatsAppNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { orderReference, phone } = await req.json();

    if (!orderReference || !phone) {
      return NextResponse.json(
        { error: "Both Order Reference and Phone Number are required." },
        { status: 400 }
      );
    }

    const cleanRef = orderReference.trim().toUpperCase();
    const cleanPhone = normalizeWhatsAppNumber(phone);

    const order = await prisma.order.findUnique({
      where: { orderReference: cleanRef },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No order found matching this reference code." },
        { status: 404 }
      );
    }

    // Security check: Phone number must match to prevent IDOR / public harvesting
    const orderPhoneClean = normalizeWhatsAppNumber(order.customerPhone);
    if (!orderPhoneClean.includes(cleanPhone) && !cleanPhone.includes(orderPhoneClean)) {
      return NextResponse.json(
        { error: "The phone number does not match this order reference." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      orderReference: order.orderReference,
      customerName: order.customerName,
      status: order.status,
      serviceType: order.serviceType,
      requestedDate: order.requestedDate,
      requestedTime: order.requestedTime,
      createdAt: order.createdAt,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      items: order.items.map((it) => ({
        id: it.id,
        productName: it.productName,
        variantName: it.variantName,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        subtotal: it.subtotal,
        customizationNote: it.customizationNote,
      })),
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while looking up your order." },
      { status: 500 }
    );
  }
}

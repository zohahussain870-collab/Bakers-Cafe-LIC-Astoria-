import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeWhatsAppNumber } from "@/lib/utils";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`order_track_${clientIp}`, {
      intervalMs: 60 * 1000,
      maxRequests: 15,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many tracking attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const { orderReference, phone } = await req.json();

    if (!orderReference || !phone || typeof orderReference !== "string" || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Both Order Reference and Phone Number are required." },
        { status: 400 }
      );
    }

    const cleanRef = orderReference.trim().toUpperCase();
    const cleanPhone = normalizeWhatsAppNumber(phone);

    // Enforce minimum valid Pakistani phone length (11 digits: 923XXXXXXXXX)
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid, complete Pakistani telephone number." },
        { status: 400 }
      );
    }

    let order = null;
    try {
      order = await prisma.order.findUnique({
        where: { orderReference: cleanRef },
        include: {
          items: true,
        },
      });
    } catch (dbErr) {
      console.warn("[Track API] Database unavailable:", dbErr);
    }

    // Uniform response to eliminate reference enumeration:
    // If order doesn't exist, OR phone doesn't strictly match, return identical 404
    if (!order) {
      return NextResponse.json(
        { error: "No order found matching the provided reference and telephone number." },
        { status: 404 }
      );
    }

    const orderPhoneClean = normalizeWhatsAppNumber(order.customerPhone);
    if (orderPhoneClean !== cleanPhone) {
      return NextResponse.json(
        { error: "No order found matching the provided reference and telephone number." },
        { status: 404 }
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
  } catch (error: unknown) {
    console.error("Order tracking error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while looking up your order." },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

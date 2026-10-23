import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, internalNotes } = await req.json();

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "COMPLETED",
      "CANCELLED",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "ORDER_STATUS_CHANGED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({
          orderReference: existingOrder.orderReference,
          previousStatus: existingOrder.status,
          newStatus: status || existingOrder.status,
        }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

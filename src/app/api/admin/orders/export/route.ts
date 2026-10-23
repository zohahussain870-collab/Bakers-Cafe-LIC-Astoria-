import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const headers = [
    "Order Reference",
    "Customer Name",
    "Phone",
    "Email",
    "Service Type",
    "Scheduled Date",
    "Scheduled Time",
    "Items",
    "Subtotal (PKR)",
    "Discount (PKR)",
    "Total (PKR)",
    "Status",
    "Created At",
  ];

  const rows = orders.map((o) => {
    const itemsSummary = o.items
      .map((i) => `${i.quantity}x ${i.productName}${i.variantName ? ` (${i.variantName})` : ""}`)
      .join("; ");

    return [
      `"${o.orderReference}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail || ""}"`,
      `"${o.serviceType}"`,
      `"${o.requestedDate || ""}"`,
      `"${o.requestedTime || ""}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal,
      o.discount,
      o.total,
      `"${o.status}"`,
      `"${o.createdAt.toISOString()}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="home-bakery-orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

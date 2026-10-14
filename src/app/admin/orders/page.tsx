import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const serializedOrders = orders.map((o) => ({
    id: o.id,
    orderReference: o.orderReference,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    serviceType: o.serviceType,
    requestedDate: o.requestedDate,
    requestedTime: o.requestedTime,
    status: o.status,
    subtotal: o.subtotal,
    discount: o.discount,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      productName: it.productName,
      variantName: it.variantName,
      quantity: it.quantity,
      subtotal: it.subtotal,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
          Order Management
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
          Process customer orders, update kitchen preparation stages, and export order history.
        </p>
      </div>

      <OrdersTable initialOrders={serializedOrders} />
    </div>
  );
}

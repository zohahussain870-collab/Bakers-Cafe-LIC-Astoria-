import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { OrderDetailEditor } from "@/components/admin/OrderDetailEditor";

export const dynamic = "force-dynamic";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const serialized = {
    id: order.id,
    orderReference: order.orderReference,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    serviceType: order.serviceType,
    requestedDate: order.requestedDate,
    requestedTime: order.requestedTime,
    deliveryAddress: order.deliveryAddress,
    notes: order.notes,
    status: order.status,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    total: order.total,
    internalNotes: order.internalNotes,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((it) => ({
      id: it.id,
      productName: it.productName,
      variantName: it.variantName,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      subtotal: it.subtotal,
      customizationNote: it.customizationNote,
    })),
  };

  return <OrderDetailEditor order={serialized} />;
}

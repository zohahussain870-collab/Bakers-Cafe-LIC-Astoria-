import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InventoryManager } from "@/components/admin/InventoryManager";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      category: { select: { name: true } },
    },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryName: p.category.name,
    stock: p.stock,
    isStockTracked: p.isStockTracked,
    availability: p.availability,
  }));

  return <InventoryManager initialProducts={serialized} />;
}

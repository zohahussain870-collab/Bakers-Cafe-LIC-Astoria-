import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PromotionsManager } from "@/components/admin/PromotionsManager";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const promos = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <PromotionsManager initialPromos={promos} />;
}

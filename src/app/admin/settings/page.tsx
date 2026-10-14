import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  let settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.businessSettings.create({
      data: { id: "default" },
    });
  }

  const serialized = {
    businessName: settings.businessName,
    address: settings.address,
    phone: settings.phone,
    whatsappNumber: settings.whatsappNumber,
    mapsUrl: settings.mapsUrl,
    isOnlineOrderingEnabled: settings.isOnlineOrderingEnabled,
    isWhatsAppOrderingEnabled: settings.isWhatsAppOrderingEnabled,
    isTakeoutEnabled: settings.isTakeoutEnabled,
    isDeliveryEnabled: settings.isDeliveryEnabled,
    deliveryFee: settings.deliveryFee,
    minOrderValue: settings.minOrderValue,
    defaultPrepTime: settings.defaultPrepTime,
    isMaintenanceMode: settings.isMaintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  };

  return <SettingsManager initialSettings={serialized} />;
}

import React from "react";
import { prisma } from "@/lib/prisma";
import { MaintenanceShield } from "@/components/common/MaintenanceShield";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kitchen Maintenance | Home Bakery Karachi",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  return <MaintenanceShield message={settings?.maintenanceMessage} />;
}

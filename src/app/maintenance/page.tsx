import React from "react";
import { prisma } from "@/lib/prisma";
import { MaintenanceShield } from "@/components/common/MaintenanceShield";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kitchen Maintenance | Bakers Cafe LIC",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  let settings = null;
  try {
    settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
  } catch (err) {
    console.warn("Maintenance page settings lookup skipped:", err);
  }

  return <MaintenanceShield message={settings?.maintenanceMessage} />;
}

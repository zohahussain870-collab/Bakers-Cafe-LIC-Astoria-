import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { MaintenanceShield } from "@/components/common/MaintenanceShield";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  let admin = null;

  try {
    settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
    admin = await getCurrentAdmin();
  } catch (error) {
    console.error("Storefront layout data fetch error:", error);
  }

  // If maintenance mode is active and user is not an authenticated admin
  if (settings?.isMaintenanceMode && !admin) {
    return <MaintenanceShield message={settings.maintenanceMessage} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {settings?.isMaintenanceMode && admin && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 sticky top-0">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>MAINTENANCE MODE IS CURRENTLY ACTIVE:</strong> Public visitors see the maintenance page. You are viewing in administrator bypass mode.
            </span>
            <Link
              href="/admin/settings"
              className="ml-auto underline hover:text-black/80 font-bold"
            >
              Adjust in Settings
            </Link>
          </div>
        </div>
      )}

      <div>
        <Header />
        <main className="flex-1">{children}</main>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}

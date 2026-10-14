import React from "react";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If unauthenticated, redirect to login
  // Note: /admin/login handles its own layout or will bypass if admin is null
  return (
    <div className="min-h-screen bg-[#F4ECE1]/60 flex">
      {admin && <AdminSidebar />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {admin && <AdminTopbar admin={admin} />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

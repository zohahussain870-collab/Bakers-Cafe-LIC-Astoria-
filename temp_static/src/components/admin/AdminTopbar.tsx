"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

interface AdminTopbarProps {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function AdminTopbar({ admin }: AdminTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, hide topbar
  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      console.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E6DCce] px-4 sm:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-[#8E7C72]">Admin Console</span>
        <span className="text-[#D5C7B7]">/</span>
        <span className="font-semibold text-[#211510] capitalize">
          {pathname === "/admin"
            ? "Dashboard Overview"
            : pathname.replace("/admin/", "").replace(/-/g, " ")}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 text-right">
          <div className="hidden sm:block">
            <span className="font-semibold text-xs sm:text-sm text-[#211510] block leading-tight">
              {admin.name}
            </span>
            <span className="text-[10px] text-[#B87D4B] font-bold uppercase tracking-wider">
              {admin.role}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F7EDE2] text-[#B87D4B] flex items-center justify-center font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign Out"
          className="p-2 rounded-lg text-[#8E7C72] hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

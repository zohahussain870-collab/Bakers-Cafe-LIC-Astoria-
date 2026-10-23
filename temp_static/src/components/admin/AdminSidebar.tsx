"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  FolderTree,
  Boxes,
  Users,
  Tag,
  Settings,
  ShieldCheck,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { BakeryLogo } from "@/components/common/BakeryLogo";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // If on the login page, don't show the sidebar
  if (pathname === "/admin/login") return null;

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Products", icon: Cake },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/inventory", label: "Inventory", icon: Boxes },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/promotions", label: "Promotions", icon: Tag },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle admin navigation menu"
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-[#211510] text-white rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#211510] text-[#FAF7F2] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <BakeryLogo variant="mark" size={38} inverted={true} />
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-tight">
                Bakers Cafe LIC
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#A69588]">
                Admin Console
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#B87D4B] text-white font-semibold shadow-xs"
                      : "text-[#D5C7B7] hover:bg-[#302019] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Link to Storefront */}
        <div className="p-6 border-t border-[#3A2922] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#302019] hover:bg-[#3D2920] text-xs text-[#D5C7B7] hover:text-white transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B87D4B]" />
          </Link>
        </div>
      </aside>
    </>
  );
}

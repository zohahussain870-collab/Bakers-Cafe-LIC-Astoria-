"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BUSINESS_INFO } from "@/lib/constants";
import { BakeryLogo } from "@/components/common/BakeryLogo";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  MessageCircle,
  Search,
  MapPin,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart, isHydrated } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Artisan Menu" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Location & Contact" },
    { href: "/order/track", label: "Track Order" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#211510] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#3A2922]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7FB378] animate-pulse"></span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#DDB88C] shrink-0" />
              <span>Home-based artisan bakery in Gulberg Town, Karachi</span>
            </span>
            <span className="hidden md:inline text-[#D5C7B7]">•</span>
            <span className="hidden md:inline text-[#FAF7F2]/90">Freshly baked to order (Takeout Default)</span>
          </div>
          <div className="flex items-center gap-4 text-[#FAF7F2]">
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Home Bakery! I would like to inquire about placing an order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contact Home Bakery on WhatsApp at ${BUSINESS_INFO.phone}`}
              className="flex items-center gap-1.5 hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#7FB378]" />
              <span>WhatsApp: {BUSINESS_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-[#D5C7B7]">•</span>
            <span className="hidden sm:inline text-amber-200 font-medium">★ 5.0 Google Rating</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="sticky top-0 z-40 glass-nav shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] rounded-xl"
            >
              <BakeryLogo variant="full" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                const isLocation = link.href === "/contact";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.href === "/menu" ? "Explore the artisan bakery menu" : undefined}
                    className={`text-sm font-medium transition-colors relative py-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] rounded-xs inline-flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#8F5323] font-semibold"
                        : "text-[#6B5B52] hover:text-[#211510]"
                    }`}
                  >
                    {isLocation && <MapPin className="w-3.5 h-3.5 text-[#8F5323] shrink-0" />}
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8F5323] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search, WhatsApp, Cart & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/menu"
                aria-label="Explore the artisan bakery menu"
                className="p-2 text-[#6B5B52] hover:text-[#211510] hover:bg-[#F4ECE1] rounded-full transition-colors hidden sm:flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
                title="Search treats"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Direct WhatsApp Action */}
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hi Home Bakery, I'd like to check today's availability and menu.")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order freshly baked treats directly via WhatsApp"
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2EA] text-[#3B5934] border border-[#3B5934]/30 text-xs font-semibold hover:bg-[#3B5934] hover:text-white transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3B5934]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
                className="relative p-2.5 text-[#211510] hover:bg-[#F4ECE1] rounded-full transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                <ShoppingBag className="w-6 h-6 text-[#211510]" />
                {isHydrated && itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#8F5323] text-white text-[11px] font-bold flex items-center justify-center animate-scale shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="md:hidden p-2 text-[#211510] hover:bg-[#F4ECE1] rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden bg-[#FAF7F2] border-b border-[#E6DCce] px-4 pt-3 pb-6 space-y-3 shadow-lg"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isLocation = link.href === "/contact";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.href === "/menu" ? "Explore the artisan bakery menu" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] ${
                      pathname === link.href
                        ? "bg-[#F4ECE1] text-[#8F5323] font-semibold"
                        : "text-[#211510] hover:bg-[#F4ECE1]"
                    }`}
                  >
                    {isLocation && <MapPin className="w-4 h-4 text-[#8F5323] shrink-0" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E6DCce] space-y-2">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with our bakery team on WhatsApp"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#3B5934] text-white text-sm font-semibold shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3B5934]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+92 330 2964562)</span>
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-[#6B5B52] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8F5323]" />
                <span>Gulberg Town, Block 17, Karachi</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

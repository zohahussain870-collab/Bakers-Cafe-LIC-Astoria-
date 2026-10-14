"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  MessageCircle,
  Search,
  Clock,
  MapPin,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <span className="w-2 h-2 rounded-full bg-[#5F7A59] animate-pulse"></span>
            <span>Home-based artisan bakery in Gulberg Town, Karachi</span>
            <span className="hidden md:inline text-[#8E7C72]">•</span>
            <span className="hidden md:inline text-[#FAF7F2]/80">Freshly baked to order (Takeout Default)</span>
          </div>
          <div className="flex items-center gap-4 text-[#FAF7F2]/90">
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Home Bakery! I would like to inquire about placing an order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#B87D4B] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#5F7A59]" />
              <span>WhatsApp: {BUSINESS_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-[#8E7C72]">•</span>
            <span className="hidden sm:inline text-amber-200/90 font-medium">★ 5.0 Google Rating</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="sticky top-0 z-40 glass-nav shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-[#211510] text-[#FAF7F2] flex items-center justify-center font-serif text-xl font-bold tracking-wider shadow-sm group-hover:bg-[#B87D4B] transition-colors">
                HB
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#211510] group-hover:text-[#B87D4B] transition-colors leading-none">
                  Home Bakery
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8E7C72] font-medium mt-1">
                  Karachi • Artisan Patisserie
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? "text-[#B87D4B] font-semibold"
                        : "text-[#6B5B52] hover:text-[#211510]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B87D4B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search, WhatsApp, Cart & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/menu"
                aria-label="Search menu"
                className="p-2 text-[#6B5B52] hover:text-[#211510] hover:bg-[#F4ECE1] rounded-full transition-colors hidden sm:flex items-center justify-center"
                title="Search treats"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Direct WhatsApp Action */}
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hi Home Bakery, I'd like to check today's availability and menu.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2EA] text-[#5F7A59] border border-[#5F7A59]/30 text-xs font-semibold hover:bg-[#5F7A59] hover:text-white transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>

              {/* Cart Button */}
              <button
                onClick={openCart}
                aria-label="Open shopping cart"
                className="relative p-2.5 text-[#211510] hover:bg-[#F4ECE1] rounded-full transition-colors flex items-center justify-center"
              >
                <ShoppingBag className="w-6 h-6 text-[#211510]" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#B87D4B] text-white text-[11px] font-bold flex items-center justify-center animate-scale shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 text-[#211510] hover:bg-[#F4ECE1] rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#E6DCce] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#F4ECE1] text-[#B87D4B] font-semibold"
                      : "text-[#211510] hover:bg-[#F4ECE1]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E6DCce] space-y-2">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#5F7A59] text-white text-sm font-semibold shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+92 330 2964562)</span>
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-[#6B5B52] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#B87D4B]" />
                <span>Gulberg Town, Block 17, Karachi</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

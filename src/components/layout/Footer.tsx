import React from "react";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/constants";
import { BakeryLogo } from "@/components/common/BakeryLogo";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Star,
  Lock,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#211510] text-[#FAF7F2] border-t border-[#3A2922] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3A2922]">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <BakeryLogo variant="full" inverted={true} />
            <p className="text-sm text-[#D5C7B7] leading-relaxed">
              Handcrafted artisan patisserie rooted in Karachi. Baked with pure butter, rich Belgian chocolate, and meticulous attention to flavor and freshness.
            </p>
            {/* Provided Google Rating Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#302019] border border-[#483329]">
              <div className="flex text-amber-400" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-white">5.0 / 5.0</span>
              <span className="text-[11px] text-[#D5C7B7]">({BUSINESS_INFO.suppliedRating.sourceNote})</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-semibold text-white tracking-wide">
              Quick Navigation
            </h2>
            <ul className="space-y-2.5 text-sm text-[#D5C7B7]">
              <li>
                <Link href="/menu" className="hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
                  Artisan Menu & Treats
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
                  Our Baking Philosophy
                </Link>
              </li>
              <li>
                <Link href="/order/track" className="hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#DDB88C] shrink-0" />
                  <span>Pickup Location & Directions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Location Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-semibold text-white tracking-wide">
              Bakery Information
            </h2>
            <div className="space-y-3 text-xs text-[#D5C7B7]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DDB88C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Kitchen Address:</p>
                  <p className="mt-0.5">{BUSINESS_INFO.address}</p>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#DDB88C] hover:underline mt-1 font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#7FB378] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Availability:</p>
                  <p className="mt-0.5">{BUSINESS_INFO.listedAvailability}</p>
                  <p className="text-[11px] text-[#D5C7B7] mt-0.5">
                    * Freshly made to order. Advance preparation time required.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#DDB88C] shrink-0" />
                <span>Service: <strong className="text-white">Takeout / Self-Pickup</strong></span>
              </div>
            </div>
          </div>

          {/* Contact & Orders */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-semibold text-white tracking-wide">
              Direct Orders
            </h2>
            <p className="text-xs text-[#D5C7B7] leading-relaxed">
              Place your order directly through our website or chat with our kitchen on WhatsApp.
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Home Bakery! I want to inquire about custom orders.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#3B5934] hover:bg-[#30482B] text-white text-xs font-semibold transition-colors shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#7FB378]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_INFO.phone}</span>
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phoneClean}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#302019] hover:bg-[#3D2920] border border-[#483329] text-white text-xs font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DDB88C]"
              >
                <Phone className="w-3.5 h-3.5 text-[#DDB88C]" />
                <span>Call Kitchen: {BUSINESS_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D5C7B7]">
          <p>© {new Date().getFullYear()} Home Bakery (Karachi, Pakistan). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
              Terms of Service
            </Link>
            <Link href="/refund-and-cancellation" className="hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs">
              Refund & Cancellation
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-[#D5C7B7] hover:text-[#DDB88C] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#DDB88C] rounded-xs"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

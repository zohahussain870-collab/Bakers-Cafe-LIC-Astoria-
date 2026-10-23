import React from "react";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  MapPin,
  MessageCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function LocationSection() {
  return (
    <section className="py-20 bg-[#FAF7F2] overflow-hidden section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Information Column */}
          <ScrollReveal
            direction="left"
            duration={750}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
              Cafe & Pickup
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510]">
              Visit Our Astoria Cafe
            </h2>
            <p className="text-sm sm:text-base text-[#6B5B52] leading-relaxed">
              We operate from our cafe in Astoria, NY 11106. Enjoy dine-in service or collect your order safely packaged for takeout and pickup to ensure maximum freshness.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#E6DCce] flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#211510]">
                    Official Address
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
                    {BUSINESS_INFO.address}
                  </p>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F5323] hover:text-[#784218] mt-2 underline focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323] rounded-xs"
                  >
                    <span>Open in Google Maps for Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6DCce] flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#EBF2EA] text-[#3B5934] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#211510]">
                    Listed Availability
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
                    {BUSINESS_INFO.listedAvailability}
                  </p>
                  <p className="text-[11px] text-[#68584F] mt-1 italic font-medium">
                    * Advance preparation times apply. Kitchen bakes to order.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6DCce] flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#211510]">
                    Service Type
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
                    Dine-in, Takeout & Pickup
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Bakers Cafe LIC on WhatsApp for location and pickup inquiries"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#3B5934] hover:bg-[#30482B] text-white font-medium text-sm transition-colors shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3B5934]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_INFO.phone}</span>
              </a>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-[#F4ECE1] text-[#211510] border border-[#E6DCce] font-medium text-sm transition-colors shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                <MapPin className="w-4 h-4 text-[#8F5323]" />
                <span>Get Directions</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Interactive Map Presentation Card */}
          <ScrollReveal
            direction="right"
            duration={750}
            delay={100}
            className="lg:col-span-6"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xl space-y-6">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#F4ECE1] border border-[#E6DCce] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#8F5323] text-white flex items-center justify-center shadow-md mb-3">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#211510]">
                  Astoria, Queens, NY
                </h3>
                <p className="text-xs text-[#6B5B52] max-w-sm mt-1">
                  34-06 9th St, Astoria, NY 11106, USA
                </p>
                <a
                  href={BUSINESS_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#211510] hover:bg-[#8F5323] text-white text-xs font-semibold transition-colors shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
                >
                  <span>Open Interactive Google Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DCce] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#211510] block">Pre-Order Pickup Hours:</span>
                  <span className="text-[#6B5B52]">Coordinated upon order scheduling</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#211510] block">New York Timezone:</span>
                  <span className="text-[#6B5B52]">EST (UTC-5)</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

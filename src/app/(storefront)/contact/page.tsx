import React from "react";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  Star,
  Navigation,
} from "lucide-react";

export const metadata = {
  title: "Contact & Takeout Pickup Location | Home Bakery Karachi",
  description:
    "Official location, contact phone, WhatsApp link, and directions for Home Bakery in House R-1932, Block 17, Gulberg Town, Karachi.",
};

export default function ContactPage() {
  return (
    <div className="py-16 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Reach Out to Our Kitchen
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211510]">
            Location & Contact
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            We operate as a home-based artisan bakery in Gulberg Town, Karachi. Takeout orders are coordinated in advance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DCce] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#211510] border-b border-[#F0E9DF] pb-4">
              Direct Business Information
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#68584F]">
                    Physical Address
                  </h3>
                  <p className="font-serif font-bold text-base text-[#211510] mt-0.5">
                    {BUSINESS_INFO.address}
                  </p>
                  <p className="text-xs text-[#6B5B52] mt-0.5">
                    Service: <strong>Takeout / Self-Pickup</strong> (No walk-in storefront)
                  </p>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F5323] hover:text-[#784218] underline mt-2"
                  >
                    <span>Open in Google Maps for Navigation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF2EA] text-[#3B5934] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#68584F]">
                    WhatsApp & Phone
                  </h3>
                  <p className="font-serif font-bold text-base text-[#211510] mt-0.5">
                    {BUSINESS_INFO.phone}
                  </p>
                  <p className="text-xs text-[#6B5B52] mt-0.5">
                    Official kitchen contact line for custom bakes & order acceptance.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <a
                      href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Home Bakery! I'd like to place an inquiry.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3B5934] text-white text-xs font-semibold hover:bg-[#2F472A] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${BUSINESS_INFO.phoneClean}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E6DCce] text-[#211510] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8F5323]" />
                      <span>Call Kitchen</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#68584F]">
                    Listed Availability
                  </h3>
                  <p className="font-serif font-bold text-base text-[#211510] mt-0.5">
                    {BUSINESS_INFO.listedAvailability}
                  </p>
                  <p className="text-xs text-[#6B5B52] mt-0.5 leading-relaxed">
                    Orders can be placed online 24 hours. Because each item is baked fresh from scratch, advance notice (minimum 4-6 hours for standard treats, 24 hours for artisan cakes) is required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Presentation */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#211510] border-b border-[#F0E9DF] pb-4">
              Gulberg Town Map
            </h2>

            <div className="aspect-square rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#8F5323] text-white flex items-center justify-center shadow-md">
                <Navigation className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#211510]">
                House R-1932, Block 17
              </h3>
              <p className="text-xs text-[#6B5B52]">
                Gulberg Town, Karachi, 75950, Pakistan
              </p>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#211510] hover:bg-[#8F5323] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Navigate via Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              <div className="text-xs">
                <strong className="text-[#211510] block">Google Rating: 5.0 / 5.0</strong>
                <span className="text-[#8E7C72]">Based on supplied Google listing (1 review)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BUSINESS_INFO } from "@/lib/constants";

export const metadata = {
  title: "Terms of Service | Home Bakery Karachi",
  description: "Terms and conditions for ordering artisanal baked goods from Home Bakery in Karachi.",
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DCce] shadow-xs space-y-6 text-[#211510]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Service Agreement
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
            Terms of Service
          </h1>
          <p className="text-xs text-[#68584F] mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-[#211510]">
            1. Nature of Business
          </h2>
          <p>
            <strong>{BUSINESS_INFO.name}</strong> is an artisan home-based bakery located in Gulberg Town, Karachi, Pakistan. We prepare baked goods fresh upon request and do not maintain an open commercial walk-in storefront with ready counter stock.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            2. Availability & Preparation Times
          </h2>
          <p>
            Our availability is listed as &ldquo;{BUSINESS_INFO.listedAvailability}&rdquo;. This reflects our capability to accept orders around the clock. However, every bake requires honest preparation time:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard treats (brownies, cookies, cupcakes): Minimum 4 to 6 hours notice.</li>
            <li>Artisan & celebration cakes: Minimum 24 hours advance scheduling.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            3. Order Placement & Acceptance
          </h2>
          <p>
            Submitting an order online or forwarding an order summary via WhatsApp generates an official pending order in our system. An order is deemed accepted once our kitchen confirms ingredient availability and pickup timing.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            4. Takeout & Collection
          </h2>
          <p>
            All orders default to self-pickup/takeout from our official kitchen address: <strong>{BUSINESS_INFO.address}</strong>. Customers are responsible for collecting their bakes within their scheduled time window to ensure maximum freshness and temperature stability.
          </p>
        </div>
      </div>
    </div>
  );
}

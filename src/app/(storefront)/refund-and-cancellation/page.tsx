import React from "react";
import { BUSINESS_INFO } from "@/lib/constants";

export const metadata = {
  title: "Refund & Cancellation Policy | Bakers Cafe LIC",
  description: "Cancellation notice requirements and refund policies for custom bakery orders.",
};

export default function RefundPage() {
  return (
    <div className="py-16 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DCce] shadow-xs space-y-6 text-[#211510]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Customer Assurance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-[#68584F] mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
          <h2 className="font-serif text-lg font-bold text-[#211510]">
            1. Perishable Food Nature
          </h2>
          <p>
            Because all baked goods produced by <strong>{BUSINESS_INFO.name}</strong> are perishable food items handcrafted to custom specifications without chemical preservatives, standard retail return policies cannot apply.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            2. Cancellation Windows
          </h2>
          <p>
            If you need to cancel or postpone your order:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Standard bakes (Brownies, Cookies, Cupcakes):</strong> Cancellations must be communicated at least <strong>4 hours</strong> prior to your scheduled pickup window.
            </li>
            <li>
              <strong>Custom & Celebration Cakes:</strong> Because ingredients and sponge preparation occur 24 hours prior, cancellations must be communicated at least <strong>18 hours</strong> before scheduled pickup.
            </li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            3. Quality & Resolution Guarantee
          </h2>
          <p>
            We take immense pride in our artisan bakes. If there is an error on our part (such as a wrong custom inscription or incorrect flavor), please notify us immediately upon collection or within 2 hours of pickup with photos. We will gladly bake a fresh replacement or issue an agreed resolution.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            4. Contact Kitchen
          </h2>
          <p>
            To discuss an order modification, call or message our kitchen at <strong>{BUSINESS_INFO.phone}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

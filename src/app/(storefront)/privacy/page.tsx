import React from "react";
import { BUSINESS_INFO } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy | Home Bakery Karachi",
  description: "Privacy policy and customer data handling practices for Home Bakery in Karachi, Pakistan.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DCce] shadow-xs space-y-6 text-[#211510]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Legal Information
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#68584F] mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
          <p>
            At <strong>{BUSINESS_INFO.name}</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), located at {BUSINESS_INFO.address}, we respect the privacy of our customers and website visitors. This Privacy Policy outlines what information we collect and how it is used strictly for fulfilling your bakery orders.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            1. Information We Collect
          </h2>
          <p>
            When you place an order on our platform, we collect only the minimal personal information necessary to prepare and fulfill your request:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your full name</li>
            <li>Your phone or WhatsApp number (for order coordination and pickup verification)</li>
            <li>Your email address (optional, for electronic receipt generation)</li>
            <li>Your preferred pickup date, time, and custom cake inscription messages</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            2. How We Use Your Information
          </h2>
          <p>
            We use customer information exclusively to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process, prepare, and package your fresh bakery orders.</li>
            <li>Communicate order status updates and takeout readiness via WhatsApp or telephone.</li>
            <li>Enable you to track your order progress securely using your reference code.</li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, monetize, or disclose your personal contact information to third-party advertisers or data brokers under any circumstances.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            3. Payment Information
          </h2>
          <p>
            We do not store or process debit/credit card numbers on our servers. All transactions are settled via offline takeout collection (Cash on Pickup) or direct bank transfer/Raast to our business account.
          </p>

          <h2 className="font-serif text-lg font-bold text-[#211510] pt-2">
            4. Data Retention and Contact
          </h2>
          <p>
            If you wish to have your contact details or order history corrected or removed from our kitchen database, please contact our kitchen directly at <strong>{BUSINESS_INFO.phone}</strong> or via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

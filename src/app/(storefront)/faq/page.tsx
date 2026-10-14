import React from "react";
import { FAQSection } from "@/components/home/FAQSection";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/constants";

export const metadata = {
  title: "Frequently Asked Questions | Home Bakery Karachi",
  description:
    "Common questions regarding orders, pickup instructions in Gulberg Town, preparation times, ingredients, and custom cake options.",
};

export default function FAQPage() {
  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <FAQSection />

        <div className="bg-white rounded-3xl p-8 border border-[#E6DCce] text-center space-y-4 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#211510]">
            Still have a question about your order?
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5B52] max-w-md mx-auto">
            Our kitchen team in Gulberg Town is always happy to discuss custom flavors, dietary requirements, and celebration timings.
          </p>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5F7A59] text-white text-xs font-semibold hover:bg-[#4B6346] transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp (+92 330 2964562)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

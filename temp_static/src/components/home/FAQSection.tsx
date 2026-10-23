"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How much advance notice is required for an order?",
      a: "Because all items are handcrafted fresh to order, we recommend at least 4 to 6 hours notice for brownies, cupcakes, and cookies. For multi-tiered or custom celebration cakes, a 24-hour advance booking is recommended to ensure proper chilling and decoration.",
    },
    {
      q: "Where do I collect my order?",
      a: "Orders are prepared for pickup at our cafe kitchen located at 34-06 9th St, Astoria, NY 11106. Once your order status reaches 'Ready for Pickup', you will receive our exact arrival instructions.",
    },
    {
      q: "Can I place an order directly on WhatsApp?",
      a: "Yes! You can complete your checkout directly on our website, and click 'Send to WhatsApp' to forward your exact itemized summary and order reference to our WhatsApp number (+1 718-489-9077).",
    },
    {
      q: "Do you offer eggless cakes or dietary options?",
      a: "Yes. Many of our signature cakes, including our Belgian Dark Chocolate Fudge Cake, feature an explicit 'Eggless Option' that you can select during variant choice. If you have specific nut or dietary requirements, please mention them in your order notes.",
    },
    {
      q: "Can I add a custom inscription or birthday message?",
      a: "Absolutely. During checkout or on any cake detail page, you can type your custom cake inscription (e.g., 'Happy Birthday!') at no extra charge.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept cash and major cards at the cafe, with bank transfer available on request. Payment details are confirmed with your order.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E6DCce] overflow-hidden section-defer">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <ScrollReveal
          direction="up"
          duration={650}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
            Good to Know Before Ordering
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B52] mt-2">
            Everything you need to know about our halal cafe kitchen, pickup procedures, and ingredients.
          </p>
        </ScrollReveal>

        {/* FAQ Accordions with Staggered Scroll Reveal */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal
                key={index}
                direction="up"
                delay={index * 60}
                duration={550}
              >
                <div className="rounded-2xl border border-[#E6DCce] bg-[#FAF7F2] overflow-hidden transition-colors">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                      className="w-full py-4 px-6 flex items-center justify-between text-left font-serif font-semibold text-base sm:text-lg text-[#211510] hover:text-[#8F5323] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#68584F] shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#8F5323]" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className="px-6 pb-5 text-sm text-[#6B5B52] leading-relaxed border-t border-[#E6DCce]/60 pt-3"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

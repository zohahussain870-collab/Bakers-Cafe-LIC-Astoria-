"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE_EDITORIAL } from "@/lib/animation";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const faqs = [
    {
      q: "How much advance notice is required for an order?",
      a: "Because all items are handcrafted fresh to order, we recommend at least 4 to 6 hours notice for brownies, cupcakes, and cookies. For multi-tiered or custom celebration cakes, a 24-hour advance booking is recommended to ensure proper chilling and decoration.",
    },
    {
      q: "Where do I collect my takeout order?",
      a: "Orders are prepared for pickup at our home kitchen located at House R-1932, Block 17, Gulberg Town, Karachi, 75950. Once your order status reaches 'Ready for Pickup', you will receive our exact arrival instructions.",
    },
    {
      q: "Can I place an order directly on WhatsApp?",
      a: "Yes! You can complete your checkout directly on our website, and click 'Send to WhatsApp' to forward your exact itemized summary and order reference to our WhatsApp number (+92 330 2964562).",
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
      a: "We currently accept cash on takeout pickup, as well as direct bank transfer or Raast payment prior to collection. Details are provided upon order confirmation.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: EASE_EDITORIAL,
      },
    },
  };

  return (
    <section className="py-20 bg-white border-b border-[#E6DCce] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: EASE_EDITORIAL }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
            Good to Know Before Ordering
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B52] mt-2">
            Everything you need to know about our home-based kitchen, pickup procedures, and ingredients.
          </p>
        </motion.div>

        {/* FAQ Accordions with Staggered Scroll Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-2xl border border-[#E6DCce] bg-[#FAF7F2] overflow-hidden transition-colors"
              >
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

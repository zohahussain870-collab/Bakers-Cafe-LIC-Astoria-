"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChocolateFlowCake } from "./ChocolateFlowCake";
import { BUSINESS_INFO } from "@/lib/constants";
import { EASE_EDITORIAL } from "@/lib/animation";
import { useIntro } from "@/context/IntroContext";
import {
  ArrowRight,
  MessageCircle,
  Star,
  MapPin,
  Clock,
} from "lucide-react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { phase } = useIntro();

  // If already READY on initial render (returning visitor, bot, reduced-motion), skip hidden phase entirely
  const isRevealed = phase === "REVEAL" || phase === "READY";
  const initialMode = phase === "READY" || shouldReduceMotion ? "visible" : "hidden";
  const animateMode = isRevealed ? "visible" : "hidden";

  const leftContainerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.10,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const leftItemVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? 0 : -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const rightCakeVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.75,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const accentCardVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.60,
        delay: shouldReduceMotion ? 0 : 0.35,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const topBadgeVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      scale: shouldReduceMotion ? 1 : 0.92,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.50,
        delay: shouldReduceMotion ? 0 : 0.45,
        ease: EASE_EDITORIAL,
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 hero-reveal-container">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F7EDE2] rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#EBF2EA] rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column: Synchronized sequence */}
          <motion.div
            variants={leftContainerVariants}
            initial={initialMode}
            animate={animateMode}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* 1. Location and bakery information badges */}
            <motion.div
              variants={leftItemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EDE2] text-[#8F5323] border border-[#8F5323]/25">
                <MapPin className="w-3.5 h-3.5" />
                <span>Gulberg Town • Karachi</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF2EA] text-[#3B5934] border border-[#3B5934]/25">
                <Clock className="w-3.5 h-3.5" />
                <span>Freshly Baked to Order</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E6DCce] text-[#211510] shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>5.0 Google Rating</span>
                <span className="text-[10px] text-[#68584F] font-medium">(1 review)</span>
              </span>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.h1
              variants={leftItemVariants}
              className="font-serif text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#211510] tracking-tight leading-[1.12]"
            >
              Little Moments, <br />
              <span className="text-[#8F5323] italic font-normal">Baked Beautifully.</span>
            </motion.h1>

            {/* 3. Descriptive Paragraph */}
            <motion.p
              variants={leftItemVariants}
              className="text-base sm:text-lg text-[#6B5B52] max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Handcrafted sweetness for celebrations, thoughtful gifts, and everyday cravings. Made in small batches in our Karachi home kitchen using Belgian chocolate, pure butter, and honest artisan craft.
            </motion.p>

            {/* 4. Service Notice / Takeout Location */}
            <motion.div
              variants={leftItemVariants}
              className="p-3.5 rounded-xl bg-white/80 border border-[#E6DCce] text-xs text-[#6B5B52] flex items-center justify-center lg:justify-start gap-2 shadow-2xs"
            >
              <MapPin className="w-4 h-4 text-[#8F5323] shrink-0" />
              <span>
                <strong>Takeout Pickup:</strong> House R-1932, Block 17, Gulberg Town, Karachi. (Advance notice required)
              </span>
            </motion.div>

            {/* 5. CTAs */}
            <motion.div
              variants={leftItemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/menu"
                aria-label="Explore the artisan bakery menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#8F5323] hover:bg-[#784218] text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg text-sm sm:text-base group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                <span>Explore Our Treats</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Home Bakery! I'd like to place an artisan bake order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#211510] border border-[#E6DCce] font-medium rounded-full transition-colors text-sm sm:text-base shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                <MessageCircle className="w-4 h-4 text-[#3B5934]" />
                <span>WhatsApp Ordering</span>
              </a>
            </motion.div>

            {/* 6. Micro Details / Quality Statements */}
            <motion.div
              variants={leftItemVariants}
              className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#68584F] font-medium"
            >
              <div>✓ 100% Real Dairy Butter</div>
              <div>✓ No Artificial Preservatives</div>
              <div>✓ Eggless Options Available</div>
            </motion.div>
          </motion.div>

          {/* Right Column: Cake image entering in sync */}
          <div className="lg:col-span-5 relative">
            <motion.div
              variants={rightCakeVariants}
              initial={initialMode}
              animate={animateMode}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Primary Large Image with Realistic Chocolate Flow Effect preserved untouched */}
              <ChocolateFlowCake />

              {/* Floating Dessert Accent Card */}
              <motion.div
                variants={accentCardVariants}
                initial={initialMode}
                animate={animateMode}
                className="absolute -bottom-6 -left-2 sm:-left-8 bg-white rounded-2xl p-2.5 sm:p-3.5 border border-[#E6DCce] shadow-xl flex items-center gap-2.5 sm:gap-3.5 max-w-[240px] sm:max-w-xs"
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-[#F4ECE1]">
                  <Image
                    src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80"
                    alt="Salted caramel brownies"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div role="img" aria-label="5 out of 5 stars" className="flex text-amber-500 text-xs">★★★★★</div>
                  <p className="font-serif text-xs font-bold text-[#211510] mt-0.5">
                    Salted Caramel Brownies
                  </p>
                  <p className="text-[11px] text-[#3B5934] font-semibold mt-0.5">
                    Fresh out of the oven
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge on Top Right */}
              <motion.div
                variants={topBadgeVariants}
                initial={initialMode}
                animate={animateMode}
                className="absolute -top-3 -right-2 sm:-top-4 sm:-right-6 bg-[#211510] text-[#FAF7F2] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-[#3A2922] shadow-lg flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open for Takeout Orders</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

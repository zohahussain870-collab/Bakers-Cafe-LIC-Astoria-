"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_EDITORIAL, EASE_CURTAIN } from "@/lib/animation";
import { useIntro } from "@/context/IntroContext";

export function CinematicWelcomeIntro() {
  const { phase, skipIntro, isMobile } = useIntro();

  // If already in READY phase, unmount completely from DOM
  if (phase === "READY") {
    return null;
  }

  const isExiting = phase === "REVEAL";
  const letters = ["h", "e", "l", "l", "o"];

  // Calibrated stagger timings ensuring full completion before REVEAL phase
  const letterBaseDelay = isMobile ? 0.12 : 0.20;
  const letterStagger = isMobile ? 0.05 : 0.07;
  const headingDelay = isMobile ? 0.52 : 0.75;
  const headingDuration = isMobile ? 0.50 : 0.65;
  const curtainDuration = isMobile ? 0.50 : 0.60;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro-curtain"
        initial={{ y: "0%" }}
        animate={{ y: isExiting ? "-100%" : "0%" }}
        transition={{
          duration: curtainDuration,
          ease: EASE_CURTAIN,
        }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] select-none shadow-2xl pointer-events-auto"
        style={{ willChange: "transform" }}
        aria-live="polite"
      >
        {/* Warm ambient depth glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] h-[min(700px,90vw)] bg-radial from-[#F5EDE2] via-[#FAF7F2]/80 to-transparent rounded-full pointer-events-none -z-10" />

        {/* Minimal, centered, elegant composition */}
        <div className="flex flex-col items-center text-center px-6 max-w-3xl">
          {/* Animated greeting: "hello" */}
          <div className="flex items-center justify-center gap-0.5 mb-4 sm:mb-6 overflow-hidden">
            {letters.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: letterBaseDelay + index * letterStagger,
                  duration: isMobile ? 0.40 : 0.50,
                  ease: EASE_EDITORIAL,
                }}
                className="font-sans lowercase text-base sm:text-lg md:text-xl font-medium tracking-[0.22em] text-[#8F5323] inline-block"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Main welcome heading: "Welcome to Home Bakery" */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: headingDelay,
              duration: headingDuration,
              ease: EASE_EDITORIAL,
            }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#211510] tracking-tight leading-tight"
          >
            Welcome to Home Bakery
          </motion.h1>
        </div>

        {/* Discreet Skip Button */}
        <motion.button
          type="button"
          onClick={skipIntro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0.8 : 1.2, duration: 0.3 }}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-xs font-medium text-[#68584F] hover:text-[#211510] px-3.5 py-1.5 rounded-full border border-[#E6DCce] bg-white/80 backdrop-blur-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] cursor-pointer"
        >
          Skip Intro →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

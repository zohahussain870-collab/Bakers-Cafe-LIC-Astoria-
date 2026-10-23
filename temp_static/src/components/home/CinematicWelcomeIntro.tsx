"use client";

import React, { useState, useEffect } from "react";
import { useIntro } from "@/context/IntroContext";

export function CinematicWelcomeIntro() {
  const { phase, skipIntro, isMobile } = useIntro();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Trigger entrance transition on next animation frame after mount
    const frame = requestAnimationFrame(() => setIsActive(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // If already in READY phase, unmount completely from DOM
  if (phase === "READY") {
    return null;
  }

  const isExiting = phase === "REVEAL";
  const letters = ["h", "e", "l", "l", "o"];

  // Calibrated stagger timings ensuring full completion before REVEAL phase
  const letterBaseDelay = isMobile ? 120 : 200;
  const letterStagger = isMobile ? 50 : 70;
  const headingDelay = isMobile ? 520 : 750;
  const headingDuration = isMobile ? 500 : 650;
  const curtainDuration = isMobile ? 500 : 600;

  return (
    <div
      key="cinematic-intro-curtain"
      style={{
        transform: isExiting ? "translateY(-100%)" : "translateY(0%)",
        transition: `transform ${curtainDuration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        willChange: "transform",
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] select-none shadow-2xl pointer-events-auto"
      aria-live="polite"
    >
      {/* Warm ambient depth glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] h-[min(700px,90vw)] bg-radial from-[#F5EDE2] via-[#FAF7F2]/80 to-transparent rounded-full pointer-events-none -z-10" />

      {/* Minimal, centered, elegant composition */}
      <div className="flex flex-col items-center text-center px-6 max-w-3xl">
        {/* Animated greeting: "hello" */}
        <div className="flex items-center justify-center gap-0.5 mb-4 sm:mb-6 overflow-hidden">
          {letters.map((char, index) => {
            const delay = letterBaseDelay + index * letterStagger;
            const duration = isMobile ? 400 : 500;
            return (
              <span
                key={`${char}-${index}`}
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translate3d(0, 0, 0)" : "translate3d(0, 16px, 0)",
                  transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                }}
                className="font-sans lowercase text-base sm:text-lg md:text-xl font-medium tracking-[0.22em] text-[#8F5323] inline-block"
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Main welcome heading: "Welcome to Bakers Cafe LIC" */}
        <h1
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
            transition: `opacity ${headingDuration}ms cubic-bezier(0.22, 1, 0.36, 1) ${headingDelay}ms, transform ${headingDuration}ms cubic-bezier(0.22, 1, 0.36, 1) ${headingDelay}ms`,
          }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#211510] tracking-tight leading-tight"
        >
          Welcome to Bakers Cafe LIC
        </h1>
      </div>

      {/* Discreet Skip Button */}
      <button
        type="button"
        onClick={skipIntro}
        style={{
          opacity: isActive ? 0.75 : 0,
          transition: `opacity 300ms ease ${isMobile ? 800 : 1200}ms`,
        }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-xs font-medium text-[#68584F] hover:text-[#211510] px-3.5 py-1.5 rounded-full border border-[#E6DCce] bg-white/80 backdrop-blur-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] cursor-pointer"
      >
        Skip Intro →
      </button>
    </div>
  );
}

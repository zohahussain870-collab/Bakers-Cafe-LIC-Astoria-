"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface DripDef {
  id: string;
  // SVG path definition for the extended drip (drip neck + bulbous droplet)
  d: string;
  // X, Y coordinate for the specular highlight gleam on the droplet bulb
  gleam: { cx: number; cy: number; r: number };
  // Transition speed and delay for viscous natural variation
  duration: number; // in seconds
  delay: number; // in seconds
}

// 7 handcrafted organic ganache drips aligned with the cake's natural top rim and contours
// In a 500 x 625 viewBox (matching the aspect-4/5 container)
const DRIPS: DripDef[] = [
  {
    id: "drip-1", // Far left shoulder drip
    d: "M 95,145 Q 102,190 100,230 Q 98,255 106,260 Q 114,265 116,252 Q 118,220 114,180 Q 112,150 115,140 Z",
    gleam: { cx: 104, cy: 254, r: 2.5 },
    duration: 1.3,
    delay: 0.05,
  },
  {
    id: "drip-2", // Mid-left deep drip
    d: "M 152,130 Q 158,180 156,230 Q 154,285 148,315 Q 144,332 156,336 Q 168,338 170,320 Q 173,280 172,230 Q 170,170 174,132 Z",
    gleam: { cx: 154, cy: 326, r: 3.5 },
    duration: 1.6,
    delay: 0.12,
  },
  {
    id: "drip-3", // Left-center delicate drip
    d: "M 205,120 Q 212,165 210,210 Q 208,245 204,265 Q 201,278 210,280 Q 218,282 220,268 Q 223,240 222,195 Q 220,150 224,122 Z",
    gleam: { cx: 208, cy: 273, r: 2.2 },
    duration: 1.2,
    delay: 0.02,
  },
  {
    id: "drip-4", // Signature center heavy ganache cascade
    d: "M 262,118 Q 270,175 268,235 Q 265,305 258,350 Q 252,374 266,380 Q 280,384 284,360 Q 288,310 286,245 Q 284,175 288,120 Z",
    gleam: { cx: 265, cy: 368, r: 4.2 },
    duration: 1.8,
    delay: 0.18,
  },
  {
    id: "drip-5", // Center-right rich flow
    d: "M 324,125 Q 332,175 330,225 Q 328,275 324,305 Q 320,320 330,324 Q 340,326 342,310 Q 345,270 344,220 Q 342,165 346,128 Z",
    gleam: { cx: 328, cy: 314, r: 3.0 },
    duration: 1.45,
    delay: 0.08,
  },
  {
    id: "drip-6", // Mid-right graceful drip
    d: "M 380,140 Q 388,185 386,230 Q 384,260 379,275 Q 376,285 384,288 Q 392,290 395,278 Q 398,255 397,215 Q 396,170 399,142 Z",
    gleam: { cx: 383, cy: 282, r: 2.5 },
    duration: 1.35,
    delay: 0.15,
  },
  {
    id: "drip-7", // Far-right subtle rim slide
    d: "M 425,160 Q 432,195 430,225 Q 428,245 425,255 Q 422,263 429,265 Q 436,266 438,256 Q 441,235 440,205 Q 439,175 442,162 Z",
    gleam: { cx: 427, cy: 259, r: 2.0 },
    duration: 1.15,
    delay: 0.22,
  },
];

export function HeroCakeVisual() {
  const [isFlowing, setIsFlowing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect user's accessibility reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      role="region"
      aria-label="Interactive Belgian Dark Chocolate Fudge Cake showcase with realistic chocolate ganache flow"
      tabIndex={0}
      onMouseEnter={() => setIsFlowing(true)}
      onMouseLeave={() => setIsFlowing(false)}
      onFocus={() => setIsFlowing(true)}
      onBlur={() => setIsFlowing(false)}
      onClick={() => setIsFlowing((prev) => !prev)}
      className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F4ECE1] select-none group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B87D4B]/70"
    >
      {/* 1. Underlying Cake Photograph with subtle idle breathing float */}
      <div
        className={`relative w-full h-full transform-gpu transition-transform duration-700 ease-out ${
          prefersReducedMotion
            ? ""
            : isFlowing
            ? "scale-[1.035]"
            : "animate-hero-cake-idle"
        }`}
      >
        <Image
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
          alt="Artisan Belgian chocolate cake layered with rich ganache"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover"
        />
      </div>

      {/* 2. Idle Specular Light Sheen (ambient luxury glow moving across glaze) */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-60 animate-glaze-shimmer"
          style={{
            background:
              "linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.22) 48%, rgba(255,240,210,0.35) 52%, transparent 75%)",
            backgroundSize: "250% 250%",
          }}
        />
      )}

      {/* 3. Interactive Chocolate Ganache Flow Layer (Realistic SVG Overlay) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 500 625"
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Rich Belgian Dark Chocolate Ganache Gradient */}
          <linearGradient id="ganacheGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C0E08" />
            <stop offset="35%" stopColor="#2E160D" />
            <stop offset="70%" stopColor="#3E1E12" />
            <stop offset="100%" stopColor="#24120A" />
          </linearGradient>

          {/* 3D Curvature Specular Highlight Gradient for Left Edge */}
          <linearGradient id="specularHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.58)" />
            <stop offset="25%" stopColor="rgba(255, 235, 205, 0.32)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Liquid Gloss Sheen Wave across flowing ganache */}
          <linearGradient id="flowGlossSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="55%" stopColor="rgba(255,245,225,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Deep Viscous Shadow giving authentic 3D physical elevation off the cake */}
          <filter id="ganacheDepthShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="4.5"
              floodColor="#0E0502"
              floodOpacity="0.65"
            />
          </filter>

          {/* Soft Wet Droplet Blur for specular reflection */}
          <filter id="wetGleamBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* --- Top Crown Ganache Rim (The origin reservoir of warm ganache) --- */}
        <g
          filter="url(#ganacheDepthShadow)"
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: isFlowing ? 1 : 0.4 }}
        >
          {/* Continuous molten rim across the upper contour of the cake */}
          <path
            d="M 60,150 Q 100,165 140,140 Q 185,155 220,132 Q 265,148 310,135 Q 355,156 390,142 Q 425,168 455,165 L 460,90 Q 300,70 60,95 Z"
            fill="url(#ganacheGradient)"
          />
          {/* Crown upper rim specular reflection line */}
          <path
            d="M 65,142 Q 105,157 145,134 Q 190,148 225,126 Q 270,140 315,128 Q 360,148 395,135 Q 430,160 450,158"
            fill="none"
            stroke="url(#specularHighlight)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-opacity duration-500"
            style={{ opacity: isFlowing ? 0.9 : 0.35 }}
          />
        </g>

        {/* --- Dynamic Viscous Drips cascading downwards on hover --- */}
        <g filter="url(#ganacheDepthShadow)">
          {DRIPS.map((drip) => (
            <g
              key={drip.id}
              className="transform-gpu transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transformOrigin: "center 130px",
                transform: isFlowing ? "scaleY(1)" : "scaleY(0.12)",
                opacity: isFlowing ? 1 : 0,
                transitionDuration: `${prefersReducedMotion ? 0.1 : drip.duration}s`,
                transitionDelay: `${isFlowing && !prefersReducedMotion ? drip.delay : 0}s`,
              }}
            >
              {/* Drip Solid Body */}
              <path d={drip.d} fill="url(#ganacheGradient)" />

              {/* 3D Specular Highlight along Left Contour of Drip */}
              <path
                d={drip.d}
                fill="none"
                stroke="url(#specularHighlight)"
                strokeWidth="2.0"
                strokeLinecap="round"
                className="mix-blend-screen opacity-75"
              />

              {/* Liquid Wet Specular Droplet Gleam at bulbous tip */}
              <ellipse
                cx={drip.gleam.cx}
                cy={drip.gleam.cy}
                rx={drip.gleam.r}
                ry={drip.gleam.r * 0.75}
                fill="#FFFFFF"
                filter="url(#wetGleamBlur)"
                className="opacity-80 transition-transform duration-300"
                style={{
                  transformOrigin: `${drip.gleam.cx}px ${drip.gleam.cy}px`,
                  transform: isFlowing ? "scale(1)" : "scale(0.3)",
                }}
              />
              <ellipse
                cx={drip.gleam.cx - 0.8}
                cy={drip.gleam.cy - 0.6}
                rx={drip.gleam.r * 0.45}
                ry={drip.gleam.r * 0.35}
                fill="#FFF4E0"
                className="opacity-95"
              />
            </g>
          ))}
        </g>

        {/* Sweeping Gloss Wave on Active Flow */}
        {isFlowing && !prefersReducedMotion && (
          <rect
            x="0"
            y="0"
            width="500"
            height="625"
            fill="url(#flowGlossSheen)"
            className="animate-ganache-wave pointer-events-none mix-blend-overlay"
          />
        )}
      </svg>

      {/* 4. Interactive Discovery Badge (Top Left) */}
      <div
        className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all duration-300 shadow-md ${
          isFlowing
            ? "bg-[#211510]/80 border-[#B87D4B] text-[#F7EDE2] scale-105"
            : "bg-[#211510]/60 border-white/20 text-white/90 hover:bg-[#211510]/80"
        }`}
      >
        <Sparkles
          className={`w-3.5 h-3.5 transition-colors duration-300 ${
            isFlowing ? "text-amber-300 animate-spin" : "text-[#B87D4B]"
          }`}
          style={{ animationDuration: "3s" }}
        />
        <span className="text-[11px]">
          {isFlowing ? "Fresh Ganache Pouring..." : "Hover for Warm Ganache"}
        </span>
      </div>

      {/* 5. Bottom Dark Vignette Gradient for Caption Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-20 pointer-events-none" />

      {/* 6. Original Product Caption Card (Preserved 100% at bottom-6 left-6 right-6) */}
      <div className="absolute bottom-6 left-6 right-6 text-white z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#DDB88C]">
            Signature Cake
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5F7A59] animate-pulse" />
          <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
            54% Callebaut
          </span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5 tracking-tight">
          Belgian Dark Chocolate Fudge
        </h3>
        <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-sm">
          Layers of dark cocoa sponge with velvet Callebaut ganache, hand-glazed fresh to order.
        </p>
      </div>
    </div>
  );
}

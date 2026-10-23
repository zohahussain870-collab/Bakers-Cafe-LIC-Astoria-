import React from "react";

interface BakeryLogoProps {
  variant?: "full" | "mark";
  size?: number;
  inverted?: boolean;
  className?: string;
}

/**
 * Authentic artisan bakery emblem with handcrafted cake, wheat sheaves,
 * and vintage patisserie roundel.
 */
export function BakeryLogo({
  variant = "full",
  size = 44,
  inverted = false,
  className = "",
}: BakeryLogoProps) {
  const primaryColor = inverted ? "#FAF7F2" : "#211510";
  const accentColor = inverted ? "#E6BA85" : "#8F5323";
  const circleBg = inverted ? "#211510" : "#211510";
  const circleBorder = inverted ? "#E6BA85" : "#8F5323";

  const markSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105 duration-200"
      aria-hidden="true"
    >
      {/* Outer Circle Container */}
      <circle
        cx="24"
        cy="24"
        r="23"
        fill={circleBg}
        stroke={circleBorder}
        strokeWidth="1.5"
      />

      {/* Decorative Dotted Inner Ring */}
      <circle
        cx="24"
        cy="24"
        r="20.5"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeDasharray="1.5 2"
        opacity="0.75"
      />

      {/* Left Artisan Wheat Sprig */}
      <path
        d="M10.5 27C11.5 21 14 16.5 18 13.5"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 23.5C12.8 22.8 14.2 23.4 14.8 24.8"
        stroke={accentColor}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M13 19C14.5 18.2 16 18.8 16.5 20.2"
        stroke={accentColor}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M15 15C16.5 14.5 17.8 15.2 18.2 16.5"
        stroke={accentColor}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Right Artisan Wheat Sprig */}
      <path
        d="M37.5 27C36.5 21 34 16.5 30 13.5"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M36.5 23.5C35.2 22.8 33.8 23.4 33.2 24.8"
        stroke={accentColor}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M35 19C33.5 18.2 32 18.8 31.5 20.2"
        stroke={accentColor}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M33 15C31.5 14.5 30.2 15.2 29.8 16.5"
        stroke={accentColor}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Artisan Pedestal Stand */}
      <path
        d="M18.5 35.5H29.5"
        stroke={accentColor}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M22 35.5L20.5 38H27.5L26 35.5"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M19 38H29"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Lower Cake Layer */}
      <rect
        x="18"
        y="27.5"
        width="12"
        height="7.5"
        rx="1.5"
        fill="#3A241A"
        stroke={accentColor}
        strokeWidth="1.2"
      />
      {/* Decorative Ganache Drip */}
      <path
        d="M18 29.5Q20 31.5 22 29.5Q24 31.5 26 29.5Q28 31.5 30 29.5"
        stroke={accentColor}
        strokeWidth="0.9"
        fill="none"
      />

      {/* Top Cake Layer */}
      <rect
        x="20.5"
        y="21"
        width="7"
        height="6.5"
        rx="1.2"
        fill="#3A241A"
        stroke={accentColor}
        strokeWidth="1.2"
      />
      <path
        d="M20.5 23Q22 24.5 24 23Q26 24.5 27.5 23"
        stroke={accentColor}
        strokeWidth="0.8"
        fill="none"
      />

      {/* Cake Top Rosette / Cherry Topper */}
      <circle cx="24" cy="18" r="1.6" fill={accentColor} />
      <path
        d="M24.2 16.6C24.8 14.5 26.5 14 27.5 14.5"
        stroke={accentColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "mark") {
    return <div className={`inline-flex items-center ${className}`}>{markSvg}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {markSvg}
      <div className="flex flex-col">
        <span
          className="font-serif text-2xl font-bold tracking-tight leading-none transition-colors"
          style={{ color: primaryColor }}
        >
          Bakers Cafe LIC
        </span>
        <span
          className="text-[10px] tracking-widest uppercase font-semibold mt-1"
          style={{ color: inverted ? "#D6C7BC" : "#68584F" }}
        >
          Astoria • Halal Cafe & Bakery
        </span>
      </div>
    </div>
  );
}

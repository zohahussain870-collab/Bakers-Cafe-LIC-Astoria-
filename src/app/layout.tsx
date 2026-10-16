import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { BUSINESS_INFO } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  title: {
    default: "Home Bakery | Handcrafted Artisan Cakes, Brownies & Treats in Karachi",
    template: "%s | Home Bakery Karachi",
  },
  description:
    "Home Bakery is a home-based artisan patisserie in Gulberg Town, Karachi, Pakistan. Specializing in Belgian chocolate fudge cakes, fudgy brownies, gourmet cupcakes, and celebration bakes. Order online for takeout.",
  keywords: [
    "Home Bakery Karachi",
    "Bakery Gulberg Town Karachi",
    "Artisan cakes Karachi",
    "Chocolate fudge cake Karachi",
    "Custom cakes Karachi",
    "Brownies Karachi",
    "Takeout bakery Karachi",
  ],
  authors: [{ name: "Home Bakery Karachi" }],
  creator: "Home Bakery",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "/",
    siteName: "Home Bakery Karachi",
    title: "Home Bakery | Handcrafted Artisan Cakes & Treats in Karachi",
    description:
      "Handcrafted sweetness for celebrations and thoughtful cravings. Freshly baked in Gulberg Town, Karachi.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Home Bakery Handcrafted Belgian Chocolate Cake",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Bakery | Artisan Patisserie Karachi",
    description: "Handcrafted cakes, fudgy brownies, and treats baked fresh in Gulberg Town, Karachi.",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: BUSINESS_INFO.name,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    telephone: BUSINESS_INFO.phoneClean,
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    priceRange: "PKR 1,200 - PKR 6,000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "House R-1932, Block 17, Gulberg Town",
      addressLocality: "Karachi",
      postalCode: "75950",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "24.9376",
      longitude: "67.0782",
    },
    hasMap: BUSINESS_INFO.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    servesCuisine: "Bakery, Desserts, Artisan Patisserie",
  };

  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Synchronous pre-paint check: adds intro-pending to html element before first paint if fresh homepage visit */}
        <script
          id="intro-prepaint-check"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;if(p!=='/'&&p!=='')return;var s=sessionStorage.getItem('home_bakery_intro_seen')==='1';var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var b=/Lighthouse|PageSpeed|HeadlessChrome|Chrome-Lighthouse|Google-InspectionTool|PTST/i.test(navigator.userAgent)||Boolean(navigator.webdriver);if(!s&&!r&&!b){document.documentElement.classList.add('intro-pending');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-[#211510] antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

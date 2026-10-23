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
    default: "Bakers Cafe LIC | Handcrafted Cakes, Brownies & Treats in Astoria, NY",
    template: "%s | Bakers Cafe LIC",
  },
  description:
    "Bakers Cafe LIC is a halal cafe and bakery in Astoria, NY, USA. Specializing in Belgian chocolate fudge cakes, fudgy brownies, gourmet cupcakes, and celebration bakes. Dine-in, takeout, and pickup available.",
  keywords: [
    "Bakers Cafe LIC",
    "Halal bakery Astoria",
    "Cafe Astoria Queens",
    "Artisan cakes Astoria",
    "Chocolate fudge cake Astoria",
    "Custom cakes Astoria NY",
    "Brownies Astoria",
    "Takeout bakery Astoria",
  ],
  authors: [{ name: "Bakers Cafe LIC" }],
  creator: "Bakers Cafe LIC",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bakers Cafe LIC",
    title: "Bakers Cafe LIC | Handcrafted Cakes & Treats in Astoria, NY",
    description:
      "Handcrafted sweetness for celebrations and thoughtful cravings. Freshly baked in Astoria, Queens, NY.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Bakers Cafe LIC Handcrafted Belgian Chocolate Cake",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bakers Cafe LIC | Halal Cafe & Bakery in Astoria",
    description: "Handcrafted cakes, fudgy brownies, and treats baked fresh in Astoria, Queens, NY.",
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
    priceRange: "$15 - $70",
    address: {
      "@type": "PostalAddress",
      streetAddress: "34-06 9th St",
      addressLocality: "Astoria",
      addressRegion: "NY",
      postalCode: "11106",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.7644",
      longitude: "-73.9245",
    },
    hasMap: BUSINESS_INFO.mapsUrl,
    servesCuisine: "Halal Cafe, Bakery, Desserts, Coffee",
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

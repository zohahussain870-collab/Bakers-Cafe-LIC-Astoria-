import React from "react";
import { CinematicWelcomeIntro } from "@/components/home/CinematicWelcomeIntro";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OrderingSteps } from "@/components/home/OrderingSteps";
import { BakeryStory } from "@/components/home/BakeryStory";
import { FAQSection } from "@/components/home/FAQSection";
import { LocationSection } from "@/components/home/LocationSection";
import { Tag } from "lucide-react";
import Link from "next/link";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_FEATURED_PRODUCTS,
  FALLBACK_PROMO,
} from "@/lib/fallback-data";

export default function HomePage() {
  const categories = FALLBACK_CATEGORIES;
  const featuredProducts = FALLBACK_FEATURED_PRODUCTS;
  const promo = FALLBACK_PROMO;

  return (
    <div className="space-y-0 relative">
      {/* Cinematic Welcome Intro Overlay */}
      <CinematicWelcomeIntro />

      {/* Promotional Banner */}
      {promo && (
        <div className="bg-[#7C4318] text-white py-2.5 px-4 text-xs font-medium text-center shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Tag className="w-3.5 h-3.5 shrink-0" />
            <span>
              Special Celebration Offer: Use code{" "}
              <strong className="underline tracking-wider font-bold">{promo.code}</strong> for{" "}
              {promo.discountType === "PERCENTAGE" ? `${promo.discountValue}% off` : `PKR ${promo.discountValue} off`}{" "}
              your order!
            </span>
            <Link
              href="/menu"
              aria-label="Explore the artisan bakery menu"
              className="underline font-bold ml-1 hover:text-amber-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-200 rounded-sm"
            >
              Order Now →
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero />

      {/* Category Showcase */}
      <CategoryShowcase categories={categories} />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Step-by-Step Ordering Guide */}
      <OrderingSteps />

      {/* Artisan Baking Philosophy & Story */}
      <BakeryStory />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Location, Pickup & Google Maps */}
      <LocationSection />
    </div>
  );
}

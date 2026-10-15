import React from "react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OrderingSteps } from "@/components/home/OrderingSteps";
import { BakeryStory } from "@/components/home/BakeryStory";
import { FAQSection } from "@/components/home/FAQSection";
import { LocationSection } from "@/components/home/LocationSection";
import { Tag } from "lucide-react";
import Link from "next/link";
import { ProductDTO, CategoryDTO } from "@/types";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_FEATURED_PRODUCTS,
  FALLBACK_PROMO,
} from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: CategoryDTO[] = [];
  let featuredProducts: ProductDTO[] = [];
  let promo = null;

  try {
    const rawCategories = await prisma.category.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    if (rawCategories && rawCategories.length > 0) {
      categories = rawCategories as unknown as CategoryDTO[];
    }

    const rawFeatured = await prisma.product.findMany({
      where: {
        isFeatured: true,
        availability: { not: "UNAVAILABLE" },
      },
      take: 8,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isAvailable: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    if (rawFeatured && rawFeatured.length > 0) {
      featuredProducts = rawFeatured as unknown as ProductDTO[];
    }

    promo = await prisma.promotion.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Home page database connection bypass, using fallback data:", error);
  }

  // Gracefully fallback for Vercel deployment without database configured
  if (categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }
  if (featuredProducts.length === 0) {
    featuredProducts = FALLBACK_FEATURED_PRODUCTS;
  }
  if (!promo) {
    promo = FALLBACK_PROMO;
  }

  return (
    <div className="space-y-0">
      {/* Promotional Banner */}
      {promo && (
        <div className="bg-[#B87D4B] text-white py-2.5 px-4 text-xs font-medium text-center shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            <span>
              Special Celebration Offer: Use code{" "}
              <strong className="underline tracking-wider font-bold">{promo.code}</strong> for{" "}
              {promo.discountType === "PERCENTAGE" ? `${promo.discountValue}% off` : `PKR ${promo.discountValue} off`}{" "}
              your order!
            </span>
            <Link href="/menu" className="underline font-bold ml-1 hover:text-[#FAF7F2]">
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

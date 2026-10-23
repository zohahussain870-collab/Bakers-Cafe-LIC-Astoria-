import React from "react";
import { MenuCatalog } from "@/components/products/MenuCatalog";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisan Menu & Treats | Handcrafted in Astoria, NY",
  description:
    "Explore our full collection of Belgian chocolate fudge cakes, fudgy brownies, NYC cookies, gourmet cupcakes, and celebration dessert boxes in Astoria, NY.",
};

export default function MenuPage() {
  const categories = FALLBACK_CATEGORIES;
  const products = FALLBACK_PRODUCTS;

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Fresh from Astoria, Queens, NY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211510]">
            Our Artisan Menu
          </h1>
          <p className="text-sm sm:text-base text-[#6B5B52]">
            Crafted to order with 100% pure butter and Belgian chocolate. Select your bakes for pickup or dine-in.
          </p>
        </div>

        {/* Catalog */}
        <MenuCatalog
          categories={categories}
          initialProducts={products}
        />
      </div>
    </div>
  );
}

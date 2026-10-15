import React from "react";
import Link from "next/link";
import { ProductDTO } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedProducts({ products }: { products: ProductDTO[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EDE2] text-[#8F5323] border border-[#8F5323]/25 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Favorites</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510]">
            Fresh Out of Our Oven
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B52] mt-2">
            Each creation is baked with uncompromised dedication to quality, pure butter, and Belgian chocolate.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#211510] hover:bg-[#8F5323] text-white font-medium text-sm transition-all duration-300 shadow-md group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

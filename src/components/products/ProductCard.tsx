"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductDTO } from "@/types";
import { formatPKR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Clock, Plus, Check, Eye } from "lucide-react";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      unitPrice: product.basePrice,
      quantity: 1,
      image: primaryImage,
      variantName: product.variants?.[0]?.name || null,
      variantId: product.variants?.[0]?.id || null,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between h-full bg-white transition-all duration-300">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F4ECE1]">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#8F5323] text-white shadow-xs">
              Artisan Favorite
            </span>
          )}
          {product.availability === "MADE_TO_ORDER" && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#211510]/80 backdrop-blur-xs text-[#FAF7F2] shadow-xs">
              Made to Order
            </span>
          )}
        </div>

        {/* Prep Time Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-xs text-[#211510] shadow-xs">
            <Clock className="w-3 h-3 text-[#8F5323]" />
            <span>{product.prepTime}</span>
          </span>
        </div>

        {/* Quick View Overlay Button */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus-visible:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
          aria-label={`View details for ${product.name}`}
        >
          <span className="px-4 py-2 rounded-full bg-white/95 text-[#211510] font-medium text-xs shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </Link>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68584F]">
              {product.category.name}
            </span>
          )}
          <h3 className="font-serif text-lg font-bold text-[#211510] mt-1 group-hover:text-[#8F5323] transition-colors line-clamp-1">
            <Link
              href={`/product/${product.slug}`}
              className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323] rounded-xs"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-xs text-[#6B5B52] mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3 border-t border-[#F0E9DF] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#68584F] block leading-none font-medium">Starting from</span>
            <span className="font-serif text-lg font-bold text-[#211510]">
              {formatPKR(product.basePrice)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.availability === "UNAVAILABLE"}
            aria-label={`Add ${product.name} to basket`}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] ${
              isAdded
                ? "bg-[#3B5934] text-white"
                : "bg-[#F7EDE2] text-[#8F5323] hover:bg-[#8F5323] hover:text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Basket</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

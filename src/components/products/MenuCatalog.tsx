"use client";

import React, { useState, useMemo } from "react";
import { ProductDTO, CategoryDTO } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, X, Cake, Sparkles } from "lucide-react";

interface MenuCatalogProps {
  initialProducts: ProductDTO[];
  categories: CategoryDTO[];
  initialCategory?: string;
}

export function MenuCatalog({
  initialProducts,
  categories,
  initialCategory,
}: MenuCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all" && product.category?.slug !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.shortDescription.toLowerCase().includes(q);
          const matchCat = product.category?.name.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.basePrice - b.basePrice;
        if (sortBy === "price-desc") return b.basePrice - a.basePrice;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        // Default: featured first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Bar Controls */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs space-y-5">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#8E7C72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cakes, brownies, cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-full border border-[#E6DCce] bg-[#FAF7F2] text-sm text-[#211510] placeholder-[#8E7C72] focus:bg-white transition-all focus:border-[#B87D4B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E7C72] hover:text-[#211510]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2 text-xs">
            <span className="text-[#8E7C72] font-medium shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={sortBy}
              aria-label="Sort products by"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 rounded-full border border-[#E6DCce] bg-[#FAF7F2] text-xs font-semibold text-[#211510] focus:border-[#B87D4B] transition-colors"
            >
              <option value="featured">Artisan Favorites</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === "all"
                ? "bg-[#211510] text-white shadow-xs"
                : "bg-[#FAF7F2] text-[#6B5B52] hover:bg-[#F4ECE1] border border-[#E6DCce]"
            }`}
          >
            All Treats ({initialProducts.length})
          </button>
          {categories.map((cat) => {
            const count = initialProducts.filter(
              (p) => p.category?.slug === cat.slug
            ).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#B87D4B] text-white shadow-xs"
                    : "bg-[#FAF7F2] text-[#6B5B52] hover:bg-[#F4ECE1] border border-[#E6DCce]"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-[#8E7C72] px-2">
        <span>
          Showing <strong className="text-[#211510]">{filteredProducts.length}</strong>{" "}
          artisan creation{filteredProducts.length === 1 ? "" : "s"}
        </span>
        {(selectedCategory !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-[#B87D4B] hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-[#E6DCce] text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#8E7C72] flex items-center justify-center mx-auto">
            <Cake className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#211510]">
            No bakes match your search
          </h3>
          <p className="text-xs text-[#6B5B52]">
            Try a different search keyword or switch categories to discover our delicious treats.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 rounded-full bg-[#B87D4B] text-white text-xs font-semibold hover:bg-[#9E6535] transition-colors"
          >
            Show All Treats
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductDTO } from "@/types";
import { formatUSD } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  Clock,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ShieldAlert,
  Heart,
  ChevronRight,
  Check,
  MapPin,
} from "lucide-react";

export function ProductDetailView({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Compute final unit price based on selected variant
  const unitPrice = product.basePrice + (selectedVariant?.priceAdjustment || 0);
  const totalPrice = unitPrice * quantity;

  const currentImage =
    product.images?.[activeImageIndex]?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant?.id || null,
      variantName: selectedVariant?.name || null,
      unitPrice,
      quantity,
      image: currentImage,
      customizationNote: customNote.trim() || undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
    `Hello Bakers Cafe LIC! I am inquiring about the ${product.name} (${selectedVariant?.name || "Standard size"}). Is this available for my desired date?`
  )}`;

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#68584F]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#211510] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323] rounded-xs">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/menu" className="hover:text-[#211510] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323] rounded-xs">
          Menu
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/menu?category=${product.category.slug}`}
              className="hover:text-[#211510] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323] rounded-xs"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#211510] font-semibold truncate max-w-xs" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Images Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-[#F4ECE1] border border-[#E6DCce] shadow-md">
            <Image
              src={currentImage}
              alt={product.images?.[activeImageIndex]?.alt || product.name}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#8F5323] text-white shadow-xs">
                Signature Bake
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2" role="region" aria-label="Product thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View image ${idx + 1} of ${product.name}`}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] ${
                    activeImageIndex === idx
                      ? "border-[#8F5323] ring-2 ring-[#8F5323]/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Ordering Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base text-[#6B5B52] mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Prep time Badge */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6DCce] shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#68584F] block font-medium">Current Selection</span>
              <span className="font-serif text-3xl font-extrabold text-[#211510]">
                {formatUSD(unitPrice)}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2EA] text-[#3B5934] border border-[#3B5934]/20 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>Prep Time: {product.prepTime}</span>
            </div>
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#211510]">
                Choose Size or Variant
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const vPrice = product.basePrice + v.priceAdjustment;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      aria-pressed={isSelected}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] ${
                        isSelected
                          ? "border-[#8F5323] bg-[#F7EDE2] shadow-2xs ring-1 ring-[#8F5323]"
                          : "border-[#E6DCce] bg-white hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#211510] block">
                          {v.name}
                        </span>
                        <span className="text-xs text-[#68584F] font-medium">
                          {formatUSD(vPrice)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#8F5323] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Cake Inscription / Piping Note */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label
                htmlFor="customNote"
                className="font-bold uppercase tracking-wider text-[#211510]"
              >
                Custom Inscription / Piping Note (Optional)
              </label>
              <span className="text-[#68584F] font-medium">Free of charge</span>
            </div>
            <input
              id="customNote"
              type="text"
              placeholder="e.g. 'Happy 25th Birthday Ayesha!' or 'No nuts please'"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              maxLength={80}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-white text-xs sm:text-sm text-[#211510] placeholder-[#68584F] focus:border-[#8F5323] focus:ring-1 focus:ring-[#8F5323] transition-colors"
            />
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-[#E6DCce] rounded-full bg-white p-1 w-full sm:w-36 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B5B52] hover:bg-[#F4ECE1] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm text-[#211510]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B5B52] hover:bg-[#F4ECE1] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Basket Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.availability === "UNAVAILABLE"}
                aria-label={`Add ${quantity} ${product.name} to basket for ${formatUSD(totalPrice)}`}
                className={`flex-1 w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full font-medium text-sm sm:text-base transition-all shadow-md hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] ${
                  isAdded
                    ? "bg-[#3B5934] text-white"
                    : "bg-[#8F5323] hover:bg-[#784218] text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Basket • {formatUSD(totalPrice)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Inquiry */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-[#F4ECE1] border border-[#E6DCce] text-[#211510] text-xs font-semibold transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3B5934]"
            >
              <MessageCircle className="w-4 h-4 text-[#3B5934]" />
              <span>Inquire on WhatsApp about this Treat</span>
            </a>
          </div>

          {/* Kitchen Location Notice */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex items-center gap-3 text-xs text-[#6B5B52]">
            <MapPin className="w-4 h-4 text-[#8F5323] shrink-0" />
            <span>
              <strong>Pickup & Dine-in:</strong> 34-06 9th St, Astoria, NY. Handcrafted fresh to order.
            </span>
          </div>

          {/* Ingredients & Allergens Accordion */}
          <div className="border-t border-[#E6DCce] pt-4 space-y-3">
            {product.allergens && (
              <div className="flex items-start gap-2 text-xs text-[#6B5B52]">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#211510]">Allergen Notice:</strong>{" "}
                  {product.allergens}
                </div>
              </div>
            )}

            {product.ingredients && (
              <div className="flex items-start gap-2 text-xs text-[#6B5B52]">
                <Heart className="w-4 h-4 text-[#8F5323] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#211510]">Pure Ingredients:</strong>{" "}
                  {product.ingredients}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

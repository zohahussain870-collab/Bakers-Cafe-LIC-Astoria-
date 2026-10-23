"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatUSD } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Check,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
    promoCode,
    discount,
    applyPromo,
    removePromo,
    isHydrated,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!inputCode.trim()) return;

    setIsVerifying(true);
    try {
      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode.trim(), subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || "Invalid coupon code");
      } else {
        applyPromo(data.code, data.discountAmount);
        setPromoSuccess(`Applied: ${data.description}`);
        setInputCode("");
      }
    } catch {
      setPromoError("Failed to validate promo code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
              Your Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
              Treat Basket {isHydrated ? `(${itemCount})` : ""}
            </h1>
          </div>
          <Link
            href="/menu"
            className="text-xs font-semibold text-[#8F5323] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {!isHydrated ? (
          <div className="bg-white rounded-3xl p-16 border border-[#E6DCce] text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-10 h-10 border-2 border-[#8F5323] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#6B5B52]">Loading your treat basket...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-[#E6DCce] text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] text-[#68584F] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#211510]">
              Your basket is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B52]">
              Explore our fresh Belgian chocolate cakes, brownies, and cookies baked to order in Astoria, Queens, NY.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#8F5323] text-white font-medium text-xs sm:text-sm hover:bg-[#784218] transition-colors"
            >
              <span>Browse Artisan Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Basket Items List */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
              <div className="divide-y divide-[#F0E9DF]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#F4ECE1]">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#211510]">
                          <Link
                            href={`/product/${item.productSlug}`}
                            className="hover:text-[#8F5323] transition-colors"
                          >
                            {item.productName}
                          </Link>
                        </h3>
                        {item.variantName && (
                          <span className="text-xs font-semibold text-[#8F5323] block mt-0.5">
                            {item.variantName}
                          </span>
                        )}
                        {item.customizationNote && (
                          <p className="text-xs text-[#6B5B52] italic mt-1">
                            Inscription: &ldquo;{item.customizationNote}&rdquo;
                          </p>
                        )}
                        <span className="text-xs text-[#68584F] block mt-1">
                          Unit price: {formatUSD(item.unitPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#F0E9DF]">
                      {/* Stepper */}
                      <div className="flex items-center border border-[#E6DCce] rounded-full bg-[#FAF7F2] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 hover:bg-[#F4ECE1] text-[#6B5B52] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3.5 text-xs font-semibold text-[#211510]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 hover:bg-[#F4ECE1] text-[#6B5B52] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-serif font-bold text-base text-[#211510] min-w-[90px] text-right">
                        {formatUSD(item.unitPrice * item.quantity)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#8E7C72] hover:text-red-600 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#F0E9DF] flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:underline font-semibold"
                >
                  Empty Entire Basket
                </button>
                <span className="text-[#8E7C72]">
                  Freshly prepared in Astoria, Queens, NY
                </span>
              </div>
            </div>

            {/* Order Summary & Coupon Code */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#211510] border-b border-[#F0E9DF] pb-4">
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#211510]">
                    Promotional Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SWEETWELCOME"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs font-semibold uppercase text-[#211510] focus:bg-white focus:border-[#8F5323]"
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || !inputCode.trim()}
                      className="px-4 py-2 rounded-xl bg-[#211510] hover:bg-[#8F5323] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isVerifying ? "Checking..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-600 font-medium">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-xs text-[#3B5934] font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{promoSuccess}</span>
                    </p>
                  )}
                  {promoCode && (
                    <div className="flex items-center justify-between text-xs bg-[#EBF2EA] text-[#3B5934] px-3 py-1.5 rounded-lg font-medium">
                      <span>Promo &apos;{promoCode}&apos; Applied</span>
                      <button
                        type="button"
                        onClick={removePromo}
                        className="text-red-600 hover:underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Totals Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm border-t border-[#F0E9DF] pt-4">
                  <div className="flex justify-between text-[#6B5B52]">
                    <span>Items Subtotal</span>
                    <span className="font-medium text-[#211510]">
                      {formatUSD(subtotal)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#3B5934] font-medium">
                      <span>Discount</span>
                      <span>-{formatUSD(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#6B5B52]">
                    <span>Pickup / Dine-in</span>
                    <span className="text-[#3B5934] font-semibold bg-[#EBF2EA] px-2 py-0.5 rounded text-xs">
                      Free (Astoria)
                    </span>
                  </div>

                  <div className="border-t border-[#E6DCce] pt-3 flex justify-between items-center text-base">
                    <span className="font-serif font-bold text-[#211510]">
                      Total Amount
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#8F5323]">
                      {formatUSD(finalTotal)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#8F5323] hover:bg-[#784218] text-white font-medium text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-[#68584F] pt-2">
                  <ShieldCheck className="w-4 h-4 text-[#3B5934]" />
                  <span>Verified Safe Kitchen & Pickup Packaging</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatUSD } from "@/lib/utils";
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your Treat Basket"
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 240 }}
              className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#E6DCce]"
            >
              {/* Header */}
              <div className="p-6 bg-white border-b border-[#E6DCce] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#211510]">Your Treat Basket</h2>
                    <p className="text-xs text-[#6B5B52]">
                      {itemCount} {itemCount === 1 ? "artisan item" : "artisan items"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="p-2 text-[#6B5B52] hover:text-[#211510] hover:bg-[#F4ECE1] rounded-full transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-[#F4ECE1] flex items-center justify-center text-[#68584F] mb-4">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#211510] mb-1">Your basket is empty</h3>
                    <p className="text-sm text-[#6B5B52] max-w-xs mb-6">
                      Explore our handcrafted cakes, fudgy brownies, and sweet treats fresh from the oven.
                    </p>
                    <Link
                      href="/menu"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8F5323] hover:bg-[#784218] text-white font-medium rounded-full text-sm transition-colors shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
                    >
                      Explore Menu
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-[#E6DCce] shadow-xs flex gap-3"
                    >
                      {item.image && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F4ECE1]">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif font-semibold text-sm text-[#211510] line-clamp-1">
                              {item.productName}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.productName} from basket`}
                              className="text-[#68584F] hover:text-red-600 transition-colors shrink-0 p-1 rounded-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-red-500"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {item.variantName && (
                            <p className="text-xs font-medium text-[#8F5323] mt-0.5">{item.variantName}</p>
                          )}
                          {item.customizationNote && (
                            <p className="text-xs text-[#6B5B52] italic mt-1 line-clamp-1">
                              Note: {item.customizationNote}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0E9DF]">
                          <span className="font-semibold text-sm text-[#211510]">
                            {formatUSD(item.unitPrice * item.quantity)}
                          </span>
                          <div className="flex items-center border border-[#E6DCce] rounded-full bg-[#FAF7F2] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.productName}`}
                              className="p-1 hover:bg-[#F4ECE1] text-[#6B5B52] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-[#211510]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.productName}`}
                              className="p-1 hover:bg-[#F4ECE1] text-[#6B5B52] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 bg-white border-t border-[#E6DCce] space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6B5B52]">Service Method</span>
                    <span className="font-medium text-[#3B5934] bg-[#EBF2EA] px-2 py-0.5 rounded text-xs">
                      Pickup (Free)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-base font-semibold text-[#211510]">Subtotal</span>
                    <span className="font-serif text-xl font-bold text-[#8F5323]">
                      {formatUSD(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#68584F]">
                    * Orders are freshly prepared upon request in Astoria, Queens, NY.
                  </p>
                  <div className="space-y-2 pt-1">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#8F5323] hover:bg-[#784218] text-white font-medium rounded-full transition-all shadow-md text-sm hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="w-full block text-center py-2 text-xs font-medium text-[#6B5B52] hover:text-[#211510] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323] rounded-xs"
                    >
                      View Full Basket & Special Instructions
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

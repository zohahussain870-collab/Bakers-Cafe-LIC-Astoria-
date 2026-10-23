"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatUSD } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  MapPin,
  ArrowRight,
  AlertCircle,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, promoCode, clearCart, isHydrated } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const serviceType: "TAKEOUT" | "DELIVERY" = "TAKEOUT";
  const [requestedDate, setRequestedDate] = useState(() => {
    // Default to tomorrow for optimal preparation
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [requestedTime, setRequestedTime] = useState("04:00 PM - 06:00 PM");
  const [notes, setNotes] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const timeSlots = [
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
    "08:00 PM - 10:00 PM",
  ];

  const finalTotal = Math.max(0, subtotal - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!acknowledged) {
      setErrorMessage("Please acknowledge the halal cafe & bakery order conditions to proceed.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your basket is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          serviceType,
          requestedDate,
          requestedTime,
          deliveryAddress: undefined,
          notes,
          promoCode: promoCode || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
            customizationNote: i.customizationNote,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Order placement failed. Please verify your details.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully! Clear cart & redirect
      clearCart();

      const confirmationUrl = `/order/confirmation/${data.orderReference}?wa=${encodeURIComponent(data.whatsAppUrl || "")}`;
      router.push(confirmationUrl);
    } catch {
      setErrorMessage("A network error occurred. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 border border-[#E6DCce] max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 border-2 border-[#8F5323] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6B5B52]">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 border border-[#E6DCce] max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#68584F] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#211510]">
            No items in your basket
          </h2>
          <p className="text-xs text-[#6B5B52]">
            Please add your favorite bakes from our artisan menu before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8F5323] text-white text-xs font-semibold hover:bg-[#784218] transition-colors"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Final Step
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
            Complete Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            Orders are handcrafted fresh for pickup at our Astoria, Queens, NY cafe.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Fields Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Contact */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#211510] flex items-center gap-2">
                <span>1. Customer Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#211510]">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#211510]">
                    WhatsApp / Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. (718) 489-9077"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#211510]">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. yourname@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
                />
              </div>
            </div>

            {/* Service & Pickup Scheduling */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#211510]">
                2. Pickup & Scheduling
              </h3>

              {/* Service Selection Pill */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8F5323] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-[#211510] text-sm">Pickup (Free) · Dine-in Available</strong>
                    <span className="px-2 py-0.5 rounded bg-[#EBF2EA] text-[#3B5934] font-bold text-[10px]">
                      Default Service
                    </span>
                  </div>
                  <p className="text-[#6B5B52] mt-1">
                    Pickup Location: <strong>{BUSINESS_INFO.address}</strong>
                  </p>
                  <p className="text-[11px] text-[#68584F] mt-0.5">
                    * Orders are prepared specifically for your scheduled window.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#211510]">
                    Scheduled Pickup Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={requestedDate}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#211510]">
                    Scheduled Time Window <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-[#211510]">
                  Special Instructions / Preparation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Any dietary restrictions, birthday theme preference, or pickup instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
                />
              </div>
            </div>

            {/* Acknowledgment & Consent */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs">
              <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-[#6B5B52]">
                <input
                  type="checkbox"
                  required
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8F5323] focus:ring-[#8F5323] border-[#E6DCce] shrink-0 mt-0.5"
                />
                <span>
                  I understand that <strong className="text-[#211510]">Bakers Cafe LIC</strong> is a halal cafe & bakery in Astoria, Queens, NY. All treats are freshly made to order for pickup or dine-in, and minimum prep notice applies.
                </span>
              </label>
            </div>
          </div>

          {/* Itemized Order Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-[#211510] border-b border-[#F0E9DF] pb-4">
                Basket Summary ({items.length} {items.length === 1 ? "item" : "items"})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-[#211510]">
                        {item.quantity}x {item.productName}
                      </h4>
                      {item.variantName && (
                        <p className="text-[11px] text-[#8F5323]">{item.variantName}</p>
                      )}
                      {item.customizationNote && (
                        <p className="text-[11px] text-[#6B5B52] italic">
                          Note: {item.customizationNote}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-[#211510] shrink-0">
                      {formatUSD(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 text-xs sm:text-sm border-t border-[#F0E9DF] pt-4">
                <div className="flex justify-between text-[#6B5B52]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#211510]">{formatUSD(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#3B5934] font-medium">
                    <span>Discount ({promoCode})</span>
                    <span>-{formatUSD(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B5B52]">
                  <span>Pickup</span>
                  <span className="text-[#3B5934] font-semibold">Free</span>
                </div>
                <div className="border-t border-[#E6DCce] pt-3 flex justify-between items-center text-base">
                  <span className="font-serif font-bold text-[#211510]">Total Payable</span>
                  <span className="font-serif text-2xl font-bold text-[#8F5323]">
                    {formatUSD(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#8F5323] hover:bg-[#784218] text-white font-medium text-sm sm:text-base transition-all shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order & Connect to WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-[#FAF7F2] text-[11px] text-[#6B5B52] space-y-1">
                <p className="font-semibold text-[#211510] flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#3B5934]" />
                  <span>How WhatsApp Integration Works:</span>
                </p>
                <p>
                  Placing your order generates an official order reference code in our system and automatically prepares your itemized summary for sending to our kitchen on WhatsApp (+1 718-489-9077).
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

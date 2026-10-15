"use client";

import React, { useState } from "react";
import { formatPKR } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  MessageCircle,
} from "lucide-react";

interface OrderTrackingData {
  orderReference: string;
  customerName: string;
  status: string;
  serviceType: string;
  requestedDate: string;
  requestedTime: string;
  subtotal: number;
  discount: number;
  total: number;
  items: {
    id: string;
    productName: string;
    variantName?: string | null;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    customizationNote?: string | null;
  }[];
}

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Received", desc: "Awaiting Kitchen Confirmation" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Bespoke Ingredients Prepared" },
  { key: "PREPARING", label: "Baking Fresh", desc: "In Oven & Hand-Decorating" },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup", desc: "Packaged for Takeout in Gulberg Town" },
  { key: "COMPLETED", label: "Completed", desc: "Enjoy your artisan treats!" },
];

export default function OrderTrackPage() {
  const [orderReference, setOrderReference] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderReference.trim() || !phone.trim()) {
      setError("Please provide both your Order Reference and Phone Number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderReference: orderReference.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not find an order matching these details.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PREPARING":
        return 2;
      case "READY_FOR_PICKUP":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Live Kitchen Tracking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510]">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            Enter your order reference (e.g. HB-2026-XXXX) and registered phone number to check baking progress and pickup readiness.
          </p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs max-w-xl mx-auto">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Order Reference Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HB-2026-X8K2"
                value={orderReference}
                onChange={(e) => setOrderReference(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] font-mono uppercase text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Registered WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0330 2964562"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#8F5323]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#8F5323] hover:bg-[#784218] text-white font-medium text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {isLoading ? (
                <span>Checking Kitchen Status...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Look Up Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details & Timeline Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DCce] shadow-md space-y-8 animate-fade-in">
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0E9DF] pb-6">
              <div>
                <span className="text-xs text-[#68584F] block">Order Reference</span>
                <span className="font-mono text-2xl font-extrabold text-[#8F5323]">
                  {order.orderReference}
                </span>
                <p className="text-xs text-[#6B5B52] mt-0.5">
                  Ordered by <strong>{order.customerName}</strong>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-[#68584F] block">Current Status</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EBF2EA] text-[#3B5934] border border-[#3B5934]/30 mt-1">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#211510]">
                Preparation Progress
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {STATUS_STEPS.map((step, idx) => {
                  const isPassed = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.key}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-[#F7EDE2] border-[#8F5323] ring-2 ring-[#8F5323]/20 shadow-xs"
                          : isPassed
                          ? "bg-[#EBF2EA] border-[#3B5934]/30"
                          : "bg-[#FAF7F2] border-[#E6DCce] opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPassed
                              ? "bg-[#3B5934] text-white"
                              : "bg-[#E6DCce] text-[#68584F]"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="font-semibold text-xs text-[#211510]">
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B5B52] leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collection Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] text-xs">
              <div className="space-y-1">
                <span className="text-[#68584F] flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#8F5323]" />
                  <span>Takeout Pickup Address:</span>
                </span>
                <p className="text-[#211510] font-medium">{BUSINESS_INFO.address}</p>
                <a
                  href={BUSINESS_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8F5323] underline block pt-0.5"
                >
                  View on Google Maps →
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[#68584F] flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#3B5934]" />
                  <span>Scheduled Pickup Window:</span>
                </span>
                <p className="text-[#211510] font-medium">
                  {order.requestedDate} ({order.requestedTime})
                </p>
              </div>
            </div>

            {/* Itemized Order Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#F0E9DF]">
              <h4 className="font-serif font-bold text-sm text-[#211510]">
                Ordered Treats
              </h4>
              <div className="divide-y divide-[#F0E9DF]">
                {order.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-[#211510]">
                        {it.quantity}x {it.productName}
                      </span>
                      {it.variantName && (
                        <span className="text-[#8F5323] ml-2">({it.variantName})</span>
                      )}
                      {it.customizationNote && (
                        <p className="text-[#6B5B52] italic text-[11px]">
                          Note: {it.customizationNote}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-[#211510]">
                      {formatPKR(it.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E6DCce] flex justify-between items-center text-sm">
                <span className="font-bold text-[#211510]">Total Paid / Payable</span>
                <span className="font-serif text-xl font-bold text-[#8F5323]">
                  {formatPKR(order.total)}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Assistance */}
            <div className="pt-2 text-center">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(`Hi Home Bakery! Inquiring regarding order ${order.orderReference}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3B5934] text-white text-xs font-semibold hover:bg-[#2F472A] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Kitchen on WhatsApp (+92 330 2964562)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPKR, formatPakistanPhone, normalizeWhatsAppNumber } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  ArrowLeft,
  Printer,
  MessageCircle,
  Phone,
  Save,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";

interface OrderDetailEditorProps {
  order: {
    id: string;
    orderReference: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    serviceType: string;
    requestedDate?: string | null;
    requestedTime?: string | null;
    deliveryAddress?: string | null;
    notes?: string | null;
    status: string;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    internalNotes?: string | null;
    createdAt: string;
    items: {
      id: string;
      productName: string;
      variantName?: string | null;
      unitPrice: number;
      quantity: number;
      subtotal: number;
      customizationNote?: string | null;
    }[];
  };
}

export function OrderDetailEditor({ order }: OrderDetailEditorProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [internalNotes, setInternalNotes] = useState(order.internalNotes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setIsUpdating(true);
    setFeedback("");
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus,
          internalNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update order");
      } else {
        setFeedback("Order updated successfully!");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch {
      setError("Network error while updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  const customerWaUrl = `https://wa.me/${normalizeWhatsAppNumber(order.customerPhone)}?text=${encodeURIComponent(
    `Hello ${order.customerName}! This is Home Bakery Karachi regarding your order #${order.orderReference}.`
  )}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-[#E6DCce] hover:bg-[#FAF7F2] text-[#6B5B52] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#B87D4B]">
                #{order.orderReference}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E6DCce] text-[#211510]">
                {currentStatus.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-[#8E7C72]">
              Placed on {new Date(order.createdAt).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })} PKT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E6DCce] text-xs font-semibold text-[#211510] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#8E7C72]" />
            <span>Print Order Slip</span>
          </button>
          <a
            href={customerWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5F7A59] hover:bg-[#4B6346] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Customer</span>
          </a>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 no-print">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Order Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Items and Customer Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Pickup Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
              Customer & Collection Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[#8E7C72] block font-medium">Customer:</span>
                <p className="font-bold text-[#211510]">{order.customerName}</p>
                <p className="text-xs text-[#6B5B52]">
                  Phone: <strong>{formatPakistanPhone(order.customerPhone)}</strong>
                </p>
                {order.customerEmail && (
                  <p className="text-xs text-[#6B5B52]">Email: {order.customerEmail}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[#8E7C72] block font-medium">Schedule:</span>
                <p className="font-bold text-[#211510]">
                  {order.requestedDate || "Immediate"}
                </p>
                <p className="text-xs text-[#6B5B52]">
                  Window: <strong>{order.requestedTime || "Standard"}</strong>
                </p>
                <p className="text-xs text-[#5F7A59] font-semibold mt-1">
                  Service: {order.serviceType === "TAKEOUT" ? "Takeout Pickup (Gulberg Town)" : "Delivery"}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DCce] text-xs">
                <span className="font-bold text-[#211510] block mb-0.5">
                  Customer Special Instructions:
                </span>
                <p className="text-[#6B5B52] italic">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Itemized Treats Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
              Itemized Treats Ordered ({order.items.length})
            </h3>

            <div className="divide-y divide-[#F0E9DF]">
              {order.items.map((it) => (
                <div key={it.id} className="py-3 flex justify-between items-start text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-[#211510]">
                      {it.quantity}x {it.productName}
                    </span>
                    {it.variantName && (
                      <span className="text-xs text-[#B87D4B] ml-2 font-medium">
                        ({it.variantName})
                      </span>
                    )}
                    {it.customizationNote && (
                      <p className="text-xs text-[#6B5B52] italic mt-0.5">
                        Piping Inscription: &ldquo;{it.customizationNote}&rdquo;
                      </p>
                    )}
                    <span className="text-[11px] text-[#8E7C72] block mt-0.5">
                      Rate: {formatPKR(it.unitPrice)} each
                    </span>
                  </div>
                  <span className="font-bold text-[#211510]">
                    {formatPKR(it.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="border-t border-[#E6DCce] pt-3 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-[#6B5B52]">
                <span>Subtotal</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#5F7A59]">
                  <span>Discount</span>
                  <span>-{formatPKR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B5B52]">
                <span>Delivery / Takeout Fee</span>
                <span>{order.deliveryFee > 0 ? formatPKR(order.deliveryFee) : "Free"}</span>
              </div>
              <div className="flex justify-between items-center text-base font-serif font-bold text-[#211510] pt-2 border-t border-[#F0E9DF]">
                <span>Total Amount Payable</span>
                <span className="text-xl text-[#B87D4B]">
                  {formatPKR(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Actions & Staff Notes */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {/* Status Progression Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
              Update Kitchen Status
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#211510]">
                Current Order Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs font-semibold text-[#211510] focus:border-[#B87D4B]"
              >
                <option value="PENDING">PENDING (Awaiting Review)</option>
                <option value="CONFIRMED">CONFIRMED (Accepted)</option>
                <option value="PREPARING">PREPARING (In Oven/Baking)</option>
                <option value="READY_FOR_PICKUP">READY FOR PICKUP (Takeout)</option>
                <option value="COMPLETED">COMPLETED (Collected)</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#211510]">
                Internal Kitchen Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Paid via Raast; Customer picking up at 5:30 PM"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs text-[#211510] focus:border-[#B87D4B]"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#211510] hover:bg-[#B87D4B] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdating ? "Saving Changes..." : "Save Status & Notes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

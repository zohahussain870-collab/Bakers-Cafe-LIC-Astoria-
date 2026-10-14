"use client";

import React, { useState } from "react";
import { formatPKR } from "@/lib/utils";
import { Plus, Tag, AlertCircle, Check } from "lucide-react";

interface PromoItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxUses?: number | null;
  currentUses: number;
  isActive: boolean;
}

export function PromotionsManager({ initialPromos }: { initialPromos: PromoItem[] }) {
  const [promos, setPromos] = useState(initialPromos);
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderValue, setMinOrderValue] = useState("1500");
  const [maxUses, setMaxUses] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue,
          minOrderValue,
          maxUses: maxUses || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create promo code");
      } else {
        setPromos((prev) => [data.promotion, ...prev]);
        setCode("");
        setDescription("");
        setShowAddForm(false);
      }
    } catch {
      setError("Network error while creating promotion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
            Promotions & Discounts
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
            Configure coupons and promotional codes for marketing campaigns.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B87D4B] hover:bg-[#9E6535] text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Cancel" : "Create Promo Code"}</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-4 max-w-2xl animate-fade-in"
        >
          <h3 className="font-serif text-lg font-bold text-[#211510]">
            Create Discount Code
          </h3>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Promo Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EIDSPECIAL"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] font-mono uppercase text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              >
                <option value="PERCENTAGE">Percentage (%) Off</option>
                <option value="FIXED">Fixed Amount (PKR) Off</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder={discountType === "PERCENTAGE" ? "10" : "500"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Minimum Order (PKR)
              </label>
              <input
                type="number"
                min="0"
                placeholder="1500"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Max Total Uses (Optional)
              </label>
              <input
                type="number"
                min="1"
                placeholder="Unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Description / Customer Visible Label
            </label>
            <input
              type="text"
              placeholder="e.g. 10% off celebration orders over PKR 1,500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#211510] hover:bg-[#B87D4B] text-white text-xs font-semibold transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Save Promo Code"}
          </button>
        </form>
      )}

      {/* Promos Table */}
      <div className="bg-white rounded-3xl border border-[#E6DCce] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
              <tr>
                <th className="py-3.5 px-6">Promo Code</th>
                <th className="py-3.5 px-6">Discount</th>
                <th className="py-3.5 px-6">Min Order</th>
                <th className="py-3.5 px-6">Usage Count</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E9DF]">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#B87D4B] flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#8E7C72]" />
                    <span>{p.code}</span>
                  </td>

                  <td className="py-4 px-6 font-bold text-[#211510]">
                    {p.discountType === "PERCENTAGE"
                      ? `${p.discountValue}% Off`
                      : `PKR ${p.discountValue} Off`}
                  </td>

                  <td className="py-4 px-6 text-[#6B5B52]">
                    {p.minOrderValue > 0 ? formatPKR(p.minOrderValue) : "No minimum"}
                  </td>

                  <td className="py-4 px-6 text-xs text-[#6B5B52]">
                    {p.currentUses} {p.maxUses ? `/ ${p.maxUses}` : "used"}
                  </td>

                  <td className="py-4 px-6 text-xs text-[#6B5B52]">
                    {p.description || "—"}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.isActive
                          ? "bg-[#EBF2EA] text-[#5F7A59]"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

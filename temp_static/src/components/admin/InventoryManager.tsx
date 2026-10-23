"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, AlertTriangle, Check, Search } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  stock: number;
  isStockTracked: boolean;
  availability: string;
}

export function InventoryManager({ initialProducts }: { initialProducts: InventoryItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAdjust = async (productId: string, delta: number) => {
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, delta }),
      });

      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, stock: data.stock, isStockTracked: true } : p
          )
        );
        setFeedback("Inventory updated");
        setTimeout(() => setFeedback(""), 2000);
      }
    } catch {
      console.error("Adjustment failed");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
            Inventory & Stock Control
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
            Monitor physical stock levels and made-to-order statuses.
          </p>
        </div>

        {feedback && (
          <span className="text-xs font-semibold text-[#5F7A59] bg-[#EBF2EA] px-3 py-1.5 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{feedback}</span>
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8E7C72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search treat or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
              <tr>
                <th className="py-3.5 px-6">Treat Name</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Fulfillment Mode</th>
                <th className="py-3.5 px-6">Current Stock</th>
                <th className="py-3.5 px-6 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E9DF]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#211510]">
                    <Link
                      href={`/admin/products/${item.id}`}
                      className="hover:text-[#B87D4B] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </td>

                  <td className="py-4 px-6 text-[#6B5B52]">
                    {item.categoryName}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.availability === "MADE_TO_ORDER"
                          ? "bg-[#F7EDE2] text-[#B87D4B]"
                          : "bg-[#EBF2EA] text-[#5F7A59]"
                      }`}
                    >
                      {item.availability.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {item.isStockTracked ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            item.stock <= 5 ? "text-amber-600" : "text-[#211510]"
                          }`}
                        >
                          {item.stock} units
                        </span>
                        {item.stock <= 5 && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#8E7C72] italic">Untracked (Bake on Demand)</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAdjust(item.id, -1)}
                        className="p-1.5 rounded-lg border border-[#E6DCce] hover:bg-[#F4ECE1] text-[#6B5B52] transition-colors"
                        title="Reduce stock by 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjust(item.id, 1)}
                        className="p-1.5 rounded-lg border border-[#E6DCce] hover:bg-[#F4ECE1] text-[#6B5B52] transition-colors"
                        title="Increase stock by 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjust(item.id, 5)}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DCce] text-xs font-semibold text-[#B87D4B] hover:bg-[#F7EDE2] transition-colors"
                        title="Restock batch of 5"
                      >
                        +5 Batch
                      </button>
                    </div>
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

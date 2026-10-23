"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatUSD } from "@/lib/utils";
import { Search, Download, Eye, X } from "lucide-react";

interface OrderItemData {
  id: string;
  productName: string;
  variantName?: string | null;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  orderReference: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  requestedDate?: string | null;
  requestedTime?: string | null;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  items: OrderItemData[];
}

export function OrdersTable({ initialOrders }: { initialOrders: OrderData[] }) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = [
    { key: "ALL", label: "All Orders" },
    { key: "PENDING", label: "Pending" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PREPARING", label: "Preparing" },
    { key: "READY_FOR_PICKUP", label: "Ready" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((ord) => {
      if (selectedStatus !== "ALL" && ord.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRef = ord.orderReference.toLowerCase().includes(q);
        const matchName = ord.customerName.toLowerCase().includes(q);
        const matchPhone = ord.customerPhone.includes(q);
        if (!matchRef && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [initialOrders, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Controls: Search, Status Tabs & CSV Export */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#8E7C72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, customer name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-full border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear order search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E7C72] hover:text-[#211510]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Export Action */}
          <a
            href="/api/admin/orders/export"
            download
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E6DCce] text-xs font-semibold text-[#211510] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#B87D4B]" />
            <span>Export CSV</span>
          </a>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((st) => {
            const count =
              st.key === "ALL"
                ? initialOrders.length
                : initialOrders.filter((o) => o.status === st.key).length;
            const isSelected = selectedStatus === st.key;

            return (
              <button
                key={st.key}
                onClick={() => setSelectedStatus(st.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#211510] text-white shadow-xs"
                    : "bg-[#FAF7F2] text-[#6B5B52] hover:bg-[#F4ECE1] border border-[#E6DCce]"
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E6DCce] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs sm:text-sm text-[#8E7C72]">
            No orders match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
                <tr>
                  <th className="py-3.5 px-6">Reference</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Scheduled Window</th>
                  <th className="py-3.5 px-6">Items Summary</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E9DF]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#B87D4B]">
                      {ord.orderReference}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#211510] block">
                        {ord.customerName}
                      </span>
                      <span className="text-xs text-[#8E7C72]">{ord.customerPhone}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#6B5B52]">
                      <span className="font-medium text-[#211510] block">
                        {ord.requestedDate || "Not scheduled"}
                      </span>
                      <span className="text-[11px] text-[#8E7C72]">
                        {ord.requestedTime || "Standard"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#6B5B52] max-w-xs truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#211510]">
                      {formatUSD(ord.total)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E6DCce] text-[#211510]">
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F7EDE2] text-[#B87D4B] font-semibold text-xs border border-[#E6DCce] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

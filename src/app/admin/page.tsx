import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatUSD } from "@/lib/utils";
import {
  ShoppingBag,
  Clock,
  TrendingUp,
  AlertTriangle,
  PackageCheck,
  ChevronRight,
  Plus,
  Eye,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  // Calculate today's date boundary in America/New_York
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Real Database Queries
  const [
    ordersToday,
    pendingOrders,
    preparingOrders,
    revenueAgg,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.order.count({
      where: { status: "PENDING" },
    }),
    prisma.order.count({
      where: { status: "PREPARING" },
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "COMPLETED"] },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
    prisma.product.findMany({
      where: {
        isStockTracked: true,
        stock: { lte: 5 },
      },
      take: 5,
    }),
    prisma.product.count(),
  ]);

  const totalRevenue = revenueAgg._sum.total || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
            Kitchen Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
            Real-time status of orders, baking pipeline, and inventory in Astoria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B87D4B] hover:bg-[#9E6535] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Treat</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E6DCce] text-[#211510] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
          >
            <span>View All Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Orders Today */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6DCce] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8E7C72]">
            <span className="font-bold uppercase tracking-wider">Orders Today</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#B87D4B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-extrabold text-[#211510]">
            {ordersToday}
          </div>
          <p className="text-[11px] text-[#6B5B52]">
            Registered since 00:00 ET
          </p>
        </div>

        {/* Awaiting Confirmation */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6DCce] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8E7C72]">
            <span className="font-bold uppercase tracking-wider">Awaiting Confirmation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-extrabold text-amber-600">
            {pendingOrders}
          </div>
          <p className="text-[11px] text-[#6B5B52]">
            Requires baker acceptance
          </p>
        </div>

        {/* In Preparation */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6DCce] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8E7C72]">
            <span className="font-bold uppercase tracking-wider">In Oven / Preparing</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-extrabold text-purple-600">
            {preparingOrders}
          </div>
          <p className="text-[11px] text-[#6B5B52]">
            Currently baking for pickup
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6DCce] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8E7C72]">
            <span className="font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2EA] text-[#5F7A59] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#5F7A59]">
            {formatUSD(totalRevenue)}
          </div>
          <p className="text-[11px] text-[#6B5B52]">
            From confirmed & completed orders
          </p>
        </div>
      </div>

      {/* Low Stock Alerts (if any) */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">
              Low Stock Warnings ({lowStockProducts.length} items):
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-semibold text-amber-800 hover:underline"
                >
                  {p.name} ({p.stock} remaining)
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E6DCce] shadow-xs overflow-hidden space-y-4">
        <div className="p-6 border-b border-[#F0E9DF] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#211510]">
              Recent Orders
            </h2>
            <p className="text-xs text-[#6B5B52]">
              Latest pickup and delivery orders placed by customers.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#B87D4B] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8E7C72]">
            No orders placed yet. New customer orders will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
                <tr>
                  <th className="py-3 px-6">Order Ref</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Items</th>
                  <th className="py-3 px-6">Scheduled Window</th>
                  <th className="py-3 px-6">Total (USD)</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E9DF]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#B87D4B]">
                      {ord.orderReference}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-[#211510] block">
                        {ord.customerName}
                      </span>
                      <span className="text-xs text-[#8E7C72]">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-[#6B5B52]">
                      {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-[#6B5B52]">
                      {ord.requestedDate}
                      <span className="block text-[11px] text-[#8E7C72]">{ord.requestedTime}</span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-[#211510]">
                      {formatUSD(ord.total)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E6DCce] text-[#211510]">
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B87D4B] hover:underline"
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

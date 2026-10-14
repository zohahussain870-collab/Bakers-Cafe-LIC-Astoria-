import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPKR, formatPakistanPhone, normalizeWhatsAppNumber } from "@/lib/utils";
import { Users, MessageCircle, Phone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      total: true,
      createdAt: true,
    },
  });

  // Aggregate by normalized phone number
  const customerMap = new Map<
    string,
    {
      name: string;
      phone: string;
      email?: string | null;
      orderCount: number;
      totalSpend: number;
      lastOrderDate: Date;
    }
  >();

  for (const o of orders) {
    const key = normalizeWhatsAppNumber(o.customerPhone);
    const existing = customerMap.get(key);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpend += o.total;
      if (o.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = o.createdAt;
      }
    } else {
      customerMap.set(key, {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        orderCount: 1,
        totalSpend: o.total,
        lastOrderDate: o.createdAt,
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpend - a.totalSpend
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
          Customer Insights
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
          Verified customer profiles aggregated from order history.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6DCce] shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center text-xs sm:text-sm text-[#8E7C72]">
            No customer order history recorded yet. Customer profiles will be built automatically as orders are placed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Phone & WhatsApp</th>
                  <th className="py-3.5 px-6">Orders Placed</th>
                  <th className="py-3.5 px-6">Lifetime Spend</th>
                  <th className="py-3.5 px-6">Last Active</th>
                  <th className="py-3.5 px-6 text-right">Direct Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E9DF]">
                {customers.map((c) => {
                  const waUrl = `https://wa.me/${normalizeWhatsAppNumber(c.phone)}?text=${encodeURIComponent(
                    `Hello ${c.name}! This is Home Bakery in Gulberg Town, Karachi.`
                  )}`;

                  return (
                    <tr key={c.phone} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#211510]">
                        {c.name}
                        {c.email && (
                          <span className="block text-[11px] font-normal text-[#8E7C72]">
                            {c.email}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 font-mono text-[#6B5B52]">
                        {formatPakistanPhone(c.phone)}
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E6DCce] text-[#211510]">
                          {c.orderCount} order{c.orderCount === 1 ? "" : "s"}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-serif font-bold text-[#B87D4B]">
                        {formatPKR(c.totalSpend)}
                      </td>

                      <td className="py-4 px-6 text-xs text-[#8E7C72]">
                        {c.lastOrderDate.toLocaleDateString("en-PK", {
                          timeZone: "Asia/Karachi",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF2EA] hover:bg-[#5F7A59] text-[#5F7A59] hover:text-white font-semibold text-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

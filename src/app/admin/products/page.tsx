import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPKR } from "@/lib/utils";
import { Plus, Edit, ExternalLink, Clock, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
      variants: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
            Manage your artisan cakes, brownies, cupcakes, and bakery treats.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B87D4B] hover:bg-[#9E6535] text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Treat</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6DCce] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
              <tr>
                <th className="py-3.5 px-6">Treat</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Base Price</th>
                <th className="py-3.5 px-6">Prep Notice</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6">Availability</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E9DF]">
              {products.map((prod) => {
                const primaryImage =
                  prod.images[0]?.url ||
                  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80";

                return (
                  <tr key={prod.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#F4ECE1] border border-[#E6DCce]">
                        <Image
                          src={primaryImage}
                          alt={prod.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#211510] block">
                            {prod.name}
                          </span>
                          {prod.isFeatured && (
                            <span title="Featured"><Star className="w-3.5 h-3.5 text-[#B87D4B] fill-[#B87D4B]" /></span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8E7C72] font-mono">
                          /{prod.slug}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E6DCce] text-[#211510]">
                        {prod.category?.name}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-[#211510]">
                      {formatPKR(prod.basePrice)}
                      {prod.variants.length > 0 && (
                        <span className="text-[11px] text-[#8E7C72] block font-normal">
                          +{prod.variants.length} variant(s)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-[#6B5B52]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B87D4B]" />
                        <span>{prod.prepTime}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs">
                      {prod.isStockTracked ? (
                        <span
                          className={`font-semibold ${
                            prod.stock <= 5 ? "text-amber-600 font-bold" : "text-[#5F7A59]"
                          }`}
                        >
                          {prod.stock} in stock
                        </span>
                      ) : (
                        <span className="text-[#8E7C72]">Made to Order</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          prod.availability === "AVAILABLE"
                            ? "bg-[#EBF2EA] text-[#5F7A59]"
                            : prod.availability === "MADE_TO_ORDER"
                            ? "bg-[#F7EDE2] text-[#B87D4B]"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {prod.availability.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 rounded-lg text-[#8E7C72] hover:text-[#211510] hover:bg-[#FAF7F2]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F7EDE2] text-[#B87D4B] font-semibold text-xs border border-[#E6DCce] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

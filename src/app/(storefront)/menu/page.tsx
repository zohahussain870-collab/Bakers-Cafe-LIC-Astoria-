import React from "react";
import { prisma } from "@/lib/prisma";
import { MenuCatalog } from "@/components/products/MenuCatalog";
import { ProductDTO, CategoryDTO } from "@/types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artisan Menu & Treats | Handcrafted in Karachi",
  description:
    "Explore our full collection of Belgian chocolate fudge cakes, fudgy brownies, NYC cookies, gourmet cupcakes, and celebration dessert boxes in Karachi.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  let categories: CategoryDTO[] = [];
  let products: ProductDTO[] = [];

  try {
    const rawCategories = await prisma.category.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    });
    categories = rawCategories as unknown as CategoryDTO[];

    const rawProducts = await prisma.product.findMany({
      where: { availability: { not: "UNAVAILABLE" } },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isAvailable: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    products = rawProducts as unknown as ProductDTO[];
  } catch (error) {
    console.error("Menu page data fetch error:", error);
  }

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D4B]">
            Fresh from Gulberg Town, Karachi
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211510]">
            Our Artisan Menu
          </h1>
          <p className="text-sm sm:text-base text-[#6B5B52]">
            Crafted to order with 100% pure butter and Belgian chocolate. Select your bakes for takeout collection.
          </p>
        </div>

        {/* Interactive Catalog */}
        <MenuCatalog
          initialProducts={products}
          categories={categories}
          initialCategory={resolvedParams.category}
        />
      </div>
    </div>
  );
}

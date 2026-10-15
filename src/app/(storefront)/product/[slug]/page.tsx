import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDTO } from "@/types";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  let product: { name: string; shortDescription: string; images: { url: string }[] } | null = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
    });
  } catch {}

  if (!product) {
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (fallback) {
      product = {
        name: fallback.name,
        shortDescription: fallback.shortDescription,
        images: fallback.images,
      };
    }
  }

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const imageUrl =
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&h=630&q=80";

  return {
    title: `${product.name} | Home Bakery Karachi`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Home Bakery`,
      description: product.shortDescription,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let rawProduct = null;

  try {
    rawProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isAvailable: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  } catch {}

  const product =
    (rawProduct as unknown as ProductDTO) ||
    FALLBACK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  let relatedProducts: ProductDTO[] = [];
  try {
    const rawRelated = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        availability: { not: "UNAVAILABLE" },
      },
      take: 3,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isAvailable: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    relatedProducts = rawRelated as unknown as ProductDTO[];
  } catch {}

  if (relatedProducts.length === 0) {
    relatedProducts = FALLBACK_PRODUCTS.filter(
      (p) => p.categoryId === product.categoryId && p.id !== product.id
    ).slice(0, 3);
  }

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Main Product View */}
        <ProductDetailView product={product} />

        {/* Related Treats Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#E6DCce] pt-14 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B87D4B]">
                More from {product.category?.name}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510] mt-1">
                You May Also Love
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

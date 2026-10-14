import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    basePrice: product.basePrice,
    prepTime: product.prepTime,
    availability: product.availability,
    stock: product.stock,
    isStockTracked: product.isStockTracked,
    allergens: product.allergens,
    ingredients: product.ingredients,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    imageUrl: product.images[0]?.url,
  };

  return <ProductForm categories={categories} initialData={initialData} />;
}

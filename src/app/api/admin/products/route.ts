import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      shortDescription,
      description,
      basePrice,
      prepTime,
      availability,
      stock,
      isStockTracked,
      allergens,
      ingredients,
      isFeatured,
      categoryId,
      imageUrl,
      variants,
    } = body;

    if (!name || !slug || !basePrice || !categoryId) {
      return NextResponse.json(
        { error: "Name, slug, base price, and category are required." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A product with this URL slug already exists." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        shortDescription: shortDescription || "",
        description: description || "",
        basePrice: parseInt(basePrice, 10),
        prepTime: prepTime || "4-6 hours notice",
        availability: availability || "AVAILABLE",
        stock: parseInt(stock, 10) || 0,
        isStockTracked: Boolean(isStockTracked),
        allergens: allergens || null,
        ingredients: ingredients || null,
        isFeatured: Boolean(isFeatured),
        categoryId,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl.trim(),
                  alt: name.trim(),
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            }
          : undefined,
        variants:
          variants && Array.isArray(variants) && variants.length > 0
            ? {
                create: variants.map((v: any) => ({
                  name: v.name,
                  priceAdjustment: parseInt(v.priceAdjustment, 10) || 0,
                  isAvailable: v.isAvailable ?? true,
                })),
              }
            : undefined,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "PRODUCT_CREATED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({ productId: product.id, name: product.name }),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}

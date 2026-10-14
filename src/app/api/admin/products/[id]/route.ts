import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
    } = body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Another product with this slug already exists." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        slug: slug !== undefined ? slug.trim().toLowerCase() : undefined,
        shortDescription: shortDescription !== undefined ? shortDescription : undefined,
        description: description !== undefined ? description : undefined,
        basePrice: basePrice !== undefined ? parseInt(basePrice, 10) : undefined,
        prepTime: prepTime !== undefined ? prepTime : undefined,
        availability: availability !== undefined ? availability : undefined,
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        isStockTracked: isStockTracked !== undefined ? Boolean(isStockTracked) : undefined,
        allergens: allergens !== undefined ? allergens : undefined,
        ingredients: ingredients !== undefined ? ingredients : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
      },
    });

    // Update primary image if provided
    if (imageUrl) {
      const primary = existing.images.find((i) => i.isPrimary);
      if (primary) {
        await prisma.productImage.update({
          where: { id: primary.id },
          data: { url: imageUrl.trim() },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: imageUrl.trim(),
            alt: updated.name,
            isPrimary: true,
            displayOrder: 0,
          },
        });
      }
    }

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "PRODUCT_UPDATED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({ productId: id, name: updated.name }),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete / archive by setting availability to UNAVAILABLE
    await prisma.product.update({
      where: { id },
      data: { availability: "UNAVAILABLE" },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "PRODUCT_ARCHIVED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({ productId: id, name: existing.name }),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to archive product." },
      { status: 500 }
    );
  }
}

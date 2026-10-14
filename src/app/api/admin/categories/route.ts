import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, description, image, displayOrder } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category slug already exists." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description?.trim() || null,
        image: image?.trim() || null,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CATEGORY_CREATED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({ categoryId: category.id, name: category.name }),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category." },
      { status: 500 }
    );
  }
}

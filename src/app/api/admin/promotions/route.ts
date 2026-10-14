import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, description, discountType, discountValue, minOrderValue, maxUses } =
      await req.json();

    if (!code || !discountValue) {
      return NextResponse.json(
        { error: "Code and discount value are required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.promotion.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A promo with this code already exists." },
        { status: 400 }
      );
    }

    const promo = await prisma.promotion.create({
      data: {
        code: cleanCode,
        description: description?.trim() || null,
        discountType: discountType || "PERCENTAGE",
        discountValue: parseInt(discountValue, 10),
        minOrderValue: parseInt(minOrderValue, 10) || 0,
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "PROMOTION_CREATED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({ code: cleanCode }),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, promotion: promo });
  } catch (error) {
    console.error("Promo create error:", error);
    return NextResponse.json(
      { error: "Failed to create promo code." },
      { status: 500 }
    );
  }
}

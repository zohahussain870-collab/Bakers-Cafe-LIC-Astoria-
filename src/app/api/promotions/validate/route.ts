import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Promo code is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const promo = await prisma.promotion.findUnique({
      where: { code: cleanCode },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json(
        { error: "This promo code is invalid or has expired." },
        { status: 400 }
      );
    }

    // Check expiration date
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This promotion has expired." },
        { status: 400 }
      );
    }

    // Check minimum order value
    if (subtotal && subtotal < promo.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value for this promo is PKR ${promo.minOrderValue}.`,
        },
        { status: 400 }
      );
    }

    // Check max usage
    if (promo.maxUses && promo.currentUses >= promo.maxUses) {
      return NextResponse.json(
        { error: "This promo code has reached its maximum usage limit." },
        { status: 400 }
      );
    }

    // Calculate discount in PKR
    let discountAmount = 0;
    if (promo.discountType === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * promo.discountValue) / 100);
    } else {
      discountAmount = promo.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountAmount,
      description:
        promo.description ||
        (promo.discountType === "PERCENTAGE"
          ? `${promo.discountValue}% discount applied`
          : `PKR ${promo.discountValue} discount applied`),
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while validating the promo code." },
      { status: 500 }
    );
  }
}

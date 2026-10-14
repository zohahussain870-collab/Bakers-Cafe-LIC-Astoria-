import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluatePromotion } from "@/lib/discounts";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Promo code is required." },
        { status: 400 }
      );
    }

    const orderSubtotal = typeof subtotal === "number" ? subtotal : 0;
    const cleanCode = code.trim().toUpperCase();

    const promo = await prisma.promotion.findUnique({
      where: { code: cleanCode },
    });

    if (!promo) {
      return NextResponse.json(
        { error: "This promo code is invalid or has expired." },
        { status: 400 }
      );
    }

    const evaluation = evaluatePromotion(orderSubtotal, promo);

    if (!evaluation.valid) {
      return NextResponse.json(
        { error: evaluation.reason || "This promo code cannot be applied." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountAmount: evaluation.discountAmount,
      description:
        promo.description ||
        (promo.discountType === "PERCENTAGE"
          ? `${promo.discountValue}% discount applied`
          : `PKR ${promo.discountValue} discount applied`),
    });
  } catch (error: unknown) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while validating the promo code." },
      { status: 500 }
    );
  }
}

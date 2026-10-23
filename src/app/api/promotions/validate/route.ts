import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluatePromotion, PromotionRule } from "@/lib/discounts";
import { FALLBACK_PROMO } from "@/lib/fallback-data";

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

    let promoCodeName = cleanCode;
    let promoDescription: string | null = null;
    let promoRule: PromotionRule | null = null;

    try {
      const dbPromo = await prisma.promotion.findUnique({
        where: { code: cleanCode },
      });

      if (dbPromo) {
        promoCodeName = dbPromo.code;
        promoDescription = dbPromo.description;
        promoRule = {
          discountType: dbPromo.discountType,
          discountValue: dbPromo.discountValue,
          minOrderValue: dbPromo.minOrderValue,
          isActive: dbPromo.isActive,
          expiresAt: dbPromo.expiresAt,
          maxUses: dbPromo.maxUses,
          currentUses: dbPromo.currentUses,
        };
      }
    } catch {
      if (cleanCode === FALLBACK_PROMO.code) {
        promoCodeName = FALLBACK_PROMO.code;
        promoDescription = FALLBACK_PROMO.description;
        promoRule = {
          discountType: FALLBACK_PROMO.discountType,
          discountValue: FALLBACK_PROMO.discountValue,
          minOrderValue: FALLBACK_PROMO.minOrderValue,
          isActive: FALLBACK_PROMO.isActive,
          expiresAt: null,
          maxUses: null,
          currentUses: 0,
        };
      }
    }

    if (!promoRule) {
      return NextResponse.json(
        { error: "This promo code is invalid or has expired." },
        { status: 400 }
      );
    }

    const evaluation = evaluatePromotion(orderSubtotal, promoRule);

    if (!evaluation.valid) {
      return NextResponse.json(
        { error: evaluation.reason || "This promo code cannot be applied." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: promoCodeName,
      discountAmount: evaluation.discountAmount,
      description:
        promoDescription ||
        (promoRule.discountType === "PERCENTAGE"
          ? `${promoRule.discountValue}% discount applied`
          : `PKR ${promoRule.discountValue} discount applied`),
    });
  } catch (error: unknown) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while validating the promo code." },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

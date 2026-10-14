import { describe, it, expect } from "vitest";

function calculateDiscount(
  subtotal: number,
  promo: {
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderValue: number;
    isActive: boolean;
  }
): number {
  if (!promo.isActive) return 0;
  if (subtotal < promo.minOrderValue) return 0;

  let discount = 0;
  if (promo.discountType === "PERCENTAGE") {
    discount = Math.round((subtotal * promo.discountValue) / 100);
  } else {
    discount = promo.discountValue;
  }

  return Math.min(discount, subtotal);
}

describe("Discount & Promotion Logic", () => {
  it("should calculate 10% discount correctly when min order is met", () => {
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 10,
      minOrderValue: 1500,
      isActive: true,
    };

    expect(calculateDiscount(2800, promo)).toBe(280);
    expect(calculateDiscount(1500, promo)).toBe(150);
  });

  it("should return 0 discount when order subtotal is below minimum threshold", () => {
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 10,
      minOrderValue: 1500,
      isActive: true,
    };

    expect(calculateDiscount(1400, promo)).toBe(0);
  });

  it("should calculate fixed amount discount without exceeding order subtotal", () => {
    const promo = {
      discountType: "FIXED" as const,
      discountValue: 500,
      minOrderValue: 1000,
      isActive: true,
    };

    expect(calculateDiscount(3000, promo)).toBe(500);
  });

  it("should cap discount so it never exceeds subtotal", () => {
    const promo = {
      discountType: "FIXED" as const,
      discountValue: 1000,
      minOrderValue: 500,
      isActive: true,
    };

    expect(calculateDiscount(600, promo)).toBe(600);
  });
});

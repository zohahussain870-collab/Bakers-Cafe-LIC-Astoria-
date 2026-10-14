import { describe, it, expect } from "vitest";
import { evaluatePromotion } from "../../src/lib/discounts";

describe("Production Discount & Promotion Engine (Real Module)", () => {
  it("should calculate 10% discount correctly when min order is met", () => {
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 10,
      minOrderValue: 1500,
      isActive: true,
    };

    const res1 = evaluatePromotion(2800, promo);
    expect(res1.valid).toBe(true);
    expect(res1.discountAmount).toBe(280);

    const res2 = evaluatePromotion(1500, promo);
    expect(res2.valid).toBe(true);
    expect(res2.discountAmount).toBe(150);
  });

  it("should reject discount when order subtotal is below minimum threshold", () => {
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 10,
      minOrderValue: 1500,
      isActive: true,
    };

    const res = evaluatePromotion(1400, promo);
    expect(res.valid).toBe(false);
    expect(res.discountAmount).toBe(0);
    expect(res.reason).toContain("Minimum order value");
  });

  it("should calculate fixed amount discount without exceeding order subtotal", () => {
    const promo = {
      discountType: "FIXED" as const,
      discountValue: 500,
      minOrderValue: 1000,
      isActive: true,
    };

    const res = evaluatePromotion(3000, promo);
    expect(res.valid).toBe(true);
    expect(res.discountAmount).toBe(500);
  });

  it("should cap discount so it never exceeds subtotal", () => {
    const promo = {
      discountType: "FIXED" as const,
      discountValue: 1000,
      minOrderValue: 500,
      isActive: true,
    };

    const res = evaluatePromotion(600, promo);
    expect(res.valid).toBe(true);
    expect(res.discountAmount).toBe(600);
  });

  it("should reject inactive promotions", () => {
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 20,
      minOrderValue: 0,
      isActive: false,
    };

    const res = evaluatePromotion(2000, promo);
    expect(res.valid).toBe(false);
    expect(res.discountAmount).toBe(0);
  });

  it("should reject expired promotions", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60);
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 20,
      minOrderValue: 0,
      isActive: true,
      expiresAt: pastDate,
    };

    const res = evaluatePromotion(2000, promo);
    expect(res.valid).toBe(false);
    expect(res.discountAmount).toBe(0);
    expect(res.reason).toContain("expired");
  });

  it("should reject promotions that have reached maximum usage limits", () => {
    const promo = {
      discountType: "PERCENTAGE" as const,
      discountValue: 15,
      minOrderValue: 0,
      isActive: true,
      maxUses: 10,
      currentUses: 10,
    };

    const res = evaluatePromotion(2000, promo);
    expect(res.valid).toBe(false);
    expect(res.discountAmount).toBe(0);
    expect(res.reason).toContain("maximum usage limit");
  });
});

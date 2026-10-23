/**
 * Pure discount calculation and promotional validation engine.
 * Ensures consistent calculation across storefront checkout, API validation,
 * and automated unit testing.
 */

export interface PromotionRule {
  discountType: "PERCENTAGE" | "FIXED" | string;
  discountValue: number;
  minOrderValue?: number;
  isActive: boolean;
  expiresAt?: Date | null;
  maxUses?: number | null;
  currentUses?: number;
}

export interface DiscountCalculationResult {
  valid: boolean;
  discountAmount: number;
  reason?: string;
}

export function evaluatePromotion(
  subtotal: number,
  promo: PromotionRule,
  now: Date = new Date()
): DiscountCalculationResult {
  if (!promo.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      reason: "This promotion code is inactive.",
    };
  }

  if (promo.expiresAt && promo.expiresAt < now) {
    return {
      valid: false,
      discountAmount: 0,
      reason: "This promotion has expired.",
    };
  }

  const minOrder = promo.minOrderValue || 0;
  if (subtotal < minOrder) {
    return {
      valid: false,
      discountAmount: 0,
      reason: `Minimum order value for this promo is PKR ${minOrder}.`,
    };
  }

  if (promo.maxUses !== undefined && promo.maxUses !== null && promo.currentUses !== undefined) {
    if (promo.currentUses >= promo.maxUses) {
      return {
        valid: false,
        discountAmount: 0,
        reason: "This promo code has reached its maximum usage limit.",
      };
    }
  }

  let discount = 0;
  if (promo.discountType === "PERCENTAGE") {
    discount = Math.round((subtotal * promo.discountValue) / 100);
  } else {
    discount = promo.discountValue;
  }

  // Never allow discount to exceed order subtotal
  discount = Math.min(discount, Math.max(0, subtotal));

  return {
    valid: true,
    discountAmount: discount,
  };
}

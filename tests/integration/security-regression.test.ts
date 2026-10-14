import { describe, it, expect } from "vitest";
import { normalizeWhatsAppNumber, generateOrderReference } from "../../src/lib/utils";

describe("Security Regression & ASVS Integrity Tests", () => {
  describe("FINDING-SEC-01 Regression: Phone Normalization & Exact Match Safety", () => {
    it("should never allow a short prefix like '92' to match a full customer phone", () => {
      const customerPhone = normalizeWhatsAppNumber("0330 2964562"); // "923302964562"
      const maliciousShortPhone = normalizeWhatsAppNumber("92"); // "92"

      // Strict equality must fail
      expect(customerPhone === maliciousShortPhone).toBe(false);

      // Enforcing minimum phone length prevents short inputs
      expect(maliciousShortPhone.length >= 10).toBe(false);
      expect(customerPhone.length >= 10).toBe(true);
    });

    it("should match authentic telephone variations for the same customer", () => {
      const v1 = normalizeWhatsAppNumber("03302964562");
      const v2 = normalizeWhatsAppNumber("+92 330 2964562");
      const v3 = normalizeWhatsAppNumber("923302964562");
      const v4 = normalizeWhatsAppNumber("0330 2964562");

      expect(v1).toBe("923302964562");
      expect(v2).toBe("923302964562");
      expect(v3).toBe("923302964562");
      expect(v4).toBe("923302964562");

      expect(v1 === v2).toBe(true);
      expect(v2 === v3).toBe(true);
      expect(v3 === v4).toBe(true);
    });

    it("should reject different customer numbers strictly", () => {
      const phoneA = normalizeWhatsAppNumber("03302964562");
      const phoneB = normalizeWhatsAppNumber("03302964563");

      expect(phoneA === phoneB).toBe(false);
    });
  });

  describe("FINDING-SEC-04 Regression: Cryptographic Order Reference Entropy", () => {
    it("should generate references adhering to HB-2026-XXXXXX format with 6 characters", () => {
      const ref = generateOrderReference();
      expect(ref).toMatch(/^HB-2026-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
      expect(ref.length).toBe(14); // "HB-2026-" (8) + 6 chars = 14
    });

    it("should produce 500 unique references consecutively without collision", () => {
      const set = new Set<string>();
      for (let i = 0; i < 500; i++) {
        set.add(generateOrderReference());
      }
      expect(set.size).toBe(500);
    });
  });
});

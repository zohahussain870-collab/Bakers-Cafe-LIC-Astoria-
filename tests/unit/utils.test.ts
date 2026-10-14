import { describe, it, expect } from "vitest";
import {
  formatPKR,
  generateOrderReference,
  normalizeWhatsAppNumber,
  formatPakistanPhone,
} from "../../src/lib/utils";

describe("Utility Functions & Formatting", () => {
  describe("formatPKR", () => {
    it("should format integer PKR amounts with comma separators", () => {
      expect(formatPKR(2800)).toBe("PKR 2,800");
      expect(formatPKR(15000)).toBe("PKR 15,000");
      expect(formatPKR(0)).toBe("PKR 0");
    });
  });

  describe("generateOrderReference", () => {
    it("should generate a reference with HB-2026- prefix", () => {
      const ref = generateOrderReference();
      expect(ref).toMatch(/^HB-2026-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    });

    it("should produce non-identical random references", () => {
      const ref1 = generateOrderReference();
      const ref2 = generateOrderReference();
      expect(ref1).not.toBe(ref2);
    });
  });

  describe("normalizeWhatsAppNumber", () => {
    it("should convert Pakistani 03xx numbers to 923xx international format", () => {
      expect(normalizeWhatsAppNumber("03302964562")).toBe("923302964562");
      expect(normalizeWhatsAppNumber("0330 2964562")).toBe("923302964562");
    });

    it("should keep already formatted 923xx numbers intact", () => {
      expect(normalizeWhatsAppNumber("+92 330 2964562")).toBe("923302964562");
      expect(normalizeWhatsAppNumber("923302964562")).toBe("923302964562");
    });
  });

  describe("formatPakistanPhone", () => {
    it("should cleanly format telephone numbers for local display", () => {
      expect(formatPakistanPhone("03302964562")).toBe("+92 330 2964562");
      expect(formatPakistanPhone("+92 330 2964562")).toBe("+92 330 2964562");
    });
  });
});

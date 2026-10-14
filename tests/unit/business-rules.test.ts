import { describe, it, expect } from "vitest";
import { BUSINESS_INFO, ORDER_STATUSES } from "../../src/lib/constants";

describe("Business Information — Source of Truth", () => {
  it("must preserve the official business name and address in Gulberg Town, Karachi", () => {
    expect(BUSINESS_INFO.name).toBe("Home Bakery");
    expect(BUSINESS_INFO.address).toContain("House R-1932, Block 17, Gulberg Town, Karachi");
    expect(BUSINESS_INFO.postalCode).toBe("75950");
  });

  it("must maintain the official phone and WhatsApp number", () => {
    expect(BUSINESS_INFO.phone).toBe("+92 330 2964562");
    expect(BUSINESS_INFO.whatsappNumber).toBe("923302964562");
  });

  it("must accurately reference the supplied 5.0 Google rating without fabrication", () => {
    expect(BUSINESS_INFO.suppliedRating.score).toBe(5.0);
    expect(BUSINESS_INFO.suppliedRating.count).toBe(1);
    expect(BUSINESS_INFO.suppliedRating.sourceNote).toContain("Supplied Google rating");
  });

  it("must enforce Takeout as the default service method", () => {
    expect(BUSINESS_INFO.serviceType).toContain("Takeout");
  });

  it("must provide all standard order lifecycle statuses", () => {
    const statusValues = ORDER_STATUSES.map((s) => s.value);
    expect(statusValues).toContain("PENDING");
    expect(statusValues).toContain("CONFIRMED");
    expect(statusValues).toContain("PREPARING");
    expect(statusValues).toContain("READY_FOR_PICKUP");
    expect(statusValues).toContain("COMPLETED");
    expect(statusValues).toContain("CANCELLED");
  });
});

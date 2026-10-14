import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/auth";

describe("Authentication & Password Cryptography", () => {
  it("should securely hash a plaintext password with bcrypt", async () => {
    const raw = "HomeBakeryAdmin2026!";
    const hash = await hashPassword(raw);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(raw);
    expect(hash).toMatch(/^\$2[aby]\$\d+\$/);
  });

  it("should successfully verify the correct password against its hash", async () => {
    const raw = "HomeBakeryAdmin2026!";
    const hash = await hashPassword(raw);

    const isMatch = await verifyPassword(raw, hash);
    expect(isMatch).toBe(true);
  });

  it("should reject an incorrect password attempt", async () => {
    const raw = "HomeBakeryAdmin2026!";
    const hash = await hashPassword(raw);

    const isMatch = await verifyPassword("WrongPassword123!", hash);
    expect(isMatch).toBe(false);
  });
});

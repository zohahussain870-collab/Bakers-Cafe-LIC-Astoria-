import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/auth";

describe("Authentication & Password Cryptography", () => {
  const TEST_PASSWORD_FIXTURE = "BakingSecAudit2026!#$";

  it("should securely hash a plaintext password with bcrypt (work factor 12)", async () => {
    const hash = await hashPassword(TEST_PASSWORD_FIXTURE);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(TEST_PASSWORD_FIXTURE);
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
  });

  it("should successfully verify the correct password against its hash", async () => {
    const hash = await hashPassword(TEST_PASSWORD_FIXTURE);

    const isMatch = await verifyPassword(TEST_PASSWORD_FIXTURE, hash);
    expect(isMatch).toBe(true);
  });

  it("should reject an incorrect password attempt", async () => {
    const hash = await hashPassword(TEST_PASSWORD_FIXTURE);

    const isMatch = await verifyPassword("CompletelyIncorrectPassword999!", hash);
    expect(isMatch).toBe(false);
  });
});

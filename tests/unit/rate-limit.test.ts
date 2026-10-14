import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../../src/lib/rate-limit";

describe("Rate Limiter & Brute Force Throttling", () => {
  it("should allow requests within configured threshold", () => {
    const id = "test_user_allow_" + Date.now();
    const options = { intervalMs: 5000, maxRequests: 3 };

    const r1 = checkRateLimit(id, options);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(id, options);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(id, options);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("should block requests that exceed threshold", () => {
    const id = "test_user_block_" + Date.now();
    const options = { intervalMs: 5000, maxRequests: 2 };

    checkRateLimit(id, options);
    checkRateLimit(id, options);

    const blocked = checkRateLimit(id, options);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("should isolate rate limits across distinct identifiers", () => {
    const idA = "client_A_" + Date.now();
    const idB = "client_B_" + Date.now();
    const options = { intervalMs: 5000, maxRequests: 1 };

    const rA1 = checkRateLimit(idA, options);
    expect(rA1.success).toBe(true);

    const rA2 = checkRateLimit(idA, options);
    expect(rA2.success).toBe(false);

    // Client B should still be allowed
    const rB1 = checkRateLimit(idB, options);
    expect(rB1.success).toBe(true);
  });
});

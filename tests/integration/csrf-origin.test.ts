import { describe, it, expect } from "vitest";
import { validateOriginAndCsrf } from "../../src/lib/csrf";

describe("CSRF & Origin Enforcement (ASVS V4.2)", () => {
  it("should allow safe read-only GET requests without Origin validation", () => {
    const req = new Request("http://localhost:3000/api/admin/settings", {
      method: "GET",
    });
    const result = validateOriginAndCsrf(req);
    expect(result).toBeNull();
  });

  it("should reject state-changing requests lacking application/json Content-Type (HTTP 415)", async () => {
    const req = new Request("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "origin": "http://localhost:3000",
      },
      body: "isMaintenanceMode=true",
    });

    const result = validateOriginAndCsrf(req);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(415);
    const body = await result?.json();
    expect(body.error).toContain("Content-Type");
  });

  it("should reject state-changing requests from untrusted external origins (HTTP 403)", async () => {
    const req = new Request("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "origin": "https://evil-attacker.com",
        "host": "localhost:3000",
      },
      body: JSON.stringify({ isMaintenanceMode: true }),
    });

    const result = validateOriginAndCsrf(req);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(403);
    const body = await result?.json();
    expect(body.error).toContain("untrusted origin");
  });

  it("should reject state-changing requests from untrusted referer when origin is missing (HTTP 403)", async () => {
    const req = new Request("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "referer": "https://malicious-forum.com/post/123",
        "host": "localhost:3000",
      },
      body: JSON.stringify({ isMaintenanceMode: true }),
    });

    const result = validateOriginAndCsrf(req);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(403);
    const body = await result?.json();
    expect(body.error).toContain("untrusted referer");
  });

  it("should allow legitimate same-origin state mutations", () => {
    const req = new Request("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "origin": "http://localhost:3000",
        "host": "localhost:3000",
      },
      body: JSON.stringify({ isMaintenanceMode: false }),
    });

    const result = validateOriginAndCsrf(req);
    expect(result).toBeNull();
  });
});

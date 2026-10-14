import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as chatHandler } from "../../src/app/api/chat/route";
import { POST as emailHandler } from "../../src/app/api/contact/email/route";
import { validateOriginAndCsrf } from "../../src/lib/csrf";

describe("Chatbot & Email API Route Security & Integrity", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("CSRF Defense on Chat & Email Endpoints", () => {
    it("should reject cross-origin requests with untrusted Origin header", () => {
      const maliciousReq = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://evil-attacker.com",
        },
        body: JSON.stringify({ message: "Hello" }),
      });

      const csrfError = validateOriginAndCsrf(maliciousReq);
      expect(csrfError).not.toBeNull();
      expect(csrfError?.status).toBe(403);
    });

    it("should reject non-JSON Content-Type submissions with HTTP 415", () => {
      const formReq = new Request("http://localhost:3000/api/contact/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "http://localhost:3000",
        },
        body: "customerEmail=attacker%40evil.com&message=spam",
      });

      const csrfError = validateOriginAndCsrf(formReq);
      expect(csrfError).not.toBeNull();
      expect(csrfError?.status).toBe(415);
    });

    it("should allow valid same-origin JSON requests through CSRF validation", () => {
      const validReq = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify({ message: "Hello Home Bakery" }),
      });

      const csrfError = validateOriginAndCsrf(validReq);
      expect(csrfError).toBeNull();
    });
  });

  describe("POST /api/chat", () => {
    it("should reject an invalid or empty request body with 400", async () => {
      const req = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
          "x-forwarded-for": "198.51.100.11",
        },
        body: JSON.stringify({ message: "" }),
      });

      const response = await chatHandler(req);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toBe("Validation failed");
    });

    it("should return a successful AI/fallback response for valid input", async () => {
      const req = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
          "x-forwarded-for": "198.51.100.12",
        },
        body: JSON.stringify({
          message: "What are your popular cakes?",
          history: [],
        }),
      });

      const response = await chatHandler(req);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.text).toBeDefined();
      expect(typeof json.text).toBe("string");
      expect(["gemini", "fallback"]).toContain(json.source);
      expect(json.timestamp).toBeDefined();
    });
  });

  describe("POST /api/contact/email", () => {
    it("should reject missing or malformed email address with 400", async () => {
      const req = new Request("http://localhost:3000/api/contact/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
          "x-forwarded-for": "198.51.100.13",
        },
        body: JSON.stringify({
          customerName: "Anonymous",
          customerEmail: "not-an-email-at-all",
          subject: "Inquiry",
          message: "Please let me know prices.",
        }),
      });

      const response = await emailHandler(req);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toBe("Validation failed");
    });

    it("should return unconfigured fallback when RESEND_API_KEY is not configured", async () => {
      const req = new Request("http://localhost:3000/api/contact/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
          "x-forwarded-for": "198.51.100.14",
        },
        body: JSON.stringify({
          customerName: "Areeba",
          customerEmail: "areeba@example.com",
          subject: "Cupcakes for Birthday",
          message: "Do you have vanilla cupcakes with buttercream?",
        }),
      });

      const response = await emailHandler(req);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.notConfigured).toBe(true);
      expect(json.mailtoUrl).toBeDefined();
      expect(json.mailtoUrl).toContain("mailto:contact%40homebakery.pk");
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateChatbotResponse } from "../../src/lib/ai/gemini";
import { sendContactEmail } from "../../src/lib/email/resend";

describe("Gemini AI & Resend Email Integrations", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Gemini AI Assistant Integration", () => {
    it("should return helpful offline fallback when GEMINI_API_KEY is not configured", async () => {
      delete process.env.GEMINI_API_KEY;

      const response = await generateChatbotResponse({
        message: "What cakes do you have available?",
        catalog: [
          {
            name: "Belgian Chocolate Fudge Cake",
            category: "Cakes",
            basePrice: 3200,
            prepTime: "6 hours",
            shortDescription: "Rich chocolate layers with dark ganache.",
          },
        ],
      });

      expect(response.source).toBe("fallback");
      expect(response.text).toContain("Belgian Chocolate Fudge Cake");
      expect(response.text).toContain("PKR 3200");
    });

    it("should answer opening hours gracefully in fallback mode", async () => {
      delete process.env.GEMINI_API_KEY;

      const response = await generateChatbotResponse({
        message: "What are your opening hours and notice time?",
      });

      expect(response.source).toBe("fallback");
      expect(response.text).toContain("24 hours");
      expect(response.text).toContain("4-6 hours");
    });

    it("should parse and return model output when Gemini API responds successfully", async () => {
      process.env.GEMINI_API_KEY = "test-fake-gemini-key";

      const mockCandidate = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "Hello! Our Belgian Chocolate Fudge Cake is freshly baked with rich dark chocolate ganache for PKR 3200.",
                },
              ],
            },
          },
        ],
      };

      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCandidate,
      } as unknown as Response);

      const response = await generateChatbotResponse({
        message: "Tell me about the chocolate cake",
        history: [{ role: "user", text: "Hi" }],
      });

      expect(response.source).toBe("gemini");
      expect(response.text).toContain("Belgian Chocolate Fudge Cake");
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Verify the API URL and authorization key
      const [calledUrl, calledInit] = fetchSpy.mock.calls[0];
      expect(calledUrl.toString()).toContain("generativelanguage.googleapis.com");
      expect(calledUrl.toString()).toContain("key=test-fake-gemini-key");

      const parsedBody = JSON.parse(calledInit?.body as string);
      expect(parsedBody.systemInstruction).toBeDefined();
      expect(parsedBody.contents.length).toBe(2);
    });

    it("should gracefully catch quota/network errors without crashing or leaking keys", async () => {
      process.env.GEMINI_API_KEY = "test-secret-key-123";

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: "Quota exceeded" } }),
      } as unknown as Response);

      const response = await generateChatbotResponse({
        message: "How can I order?",
      });

      expect(response.source).toBe("fallback");
      expect(response.text).not.toContain("test-secret-key-123");
      expect(response.text).toContain("Placing an order is simple");
    });
  });

  describe("Resend Email Integration", () => {
    it("should return notConfigured status and mailto fallback when RESEND_API_KEY is missing", async () => {
      delete process.env.RESEND_API_KEY;

      const result = await sendContactEmail({
        customerName: "Zainab Ali",
        customerEmail: "zainab@example.com",
        subject: "Custom Birthday Cake",
        message: "Need a cake for 20 people this Friday.",
      });

      expect(result.success).toBe(false);
      expect(result.notConfigured).toBe(true);
      expect(result.mailtoUrl).toBeDefined();
      expect(result.mailtoUrl).toContain("mailto:contact%40homebakery.pk");
      expect(result.mailtoUrl).toContain("Custom%20Birthday%20Cake");
    });

    it("should deliver email and return id when provider succeeds", async () => {
      process.env.RESEND_API_KEY = "re_test_dummy_key_123";

      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "msg_987654321" }),
      } as unknown as Response);

      const result = await sendContactEmail({
        customerName: "Farhan Qureshi",
        customerEmail: "farhan@example.com",
        subject: "Event Catering Inquiry",
        message: "Can you provide 50 cupcakes for a corporate tea party?",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBe("msg_987654321");
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      const [calledUrl, calledInit] = fetchSpy.mock.calls[0];
      expect(calledUrl).toBe("https://api.resend.com/emails");
      expect(calledInit?.headers).toHaveProperty(
        "Authorization",
        "Bearer re_test_dummy_key_123"
      );
    });

    it("should handle provider rejection safely with mailto fallback", async () => {
      process.env.RESEND_API_KEY = "re_test_dummy_key_123";

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ name: "validation_error", message: "Domain not verified" }),
      } as unknown as Response);

      const result = await sendContactEmail({
        customerName: "Hamza Tariq",
        customerEmail: "hamza@example.com",
        subject: "Special Request",
        message: "Gluten free brownie options?",
      });

      expect(result.success).toBe(false);
      expect(result.mailtoUrl).toBeDefined();
      expect(result.message).toContain("rejected the request");
    });
  });
});

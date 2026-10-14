import { describe, it, expect } from "vitest";
import {
  chatRequestSchema,
  contactEmailSchema,
  whatsAppPrepSchema,
} from "../../src/lib/validations/chat";

describe("Chatbot & Contact Validation Schemas", () => {
  describe("chatRequestSchema", () => {
    it("should accept a valid message and history", () => {
      const result = chatRequestSchema.safeParse({
        message: "What kind of brownies do you bake?",
        history: [
          { role: "user", text: "Hello" },
          { role: "model", text: "Welcome to Home Bakery!" },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("should reject an empty message", () => {
      const result = chatRequestSchema.safeParse({
        message: "   ",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("cannot be empty");
      }
    });

    it("should reject an oversized message exceeding 1000 characters", () => {
      const longMessage = "A".repeat(1001);
      const result = chatRequestSchema.safeParse({
        message: longMessage,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("cannot exceed 1000 characters");
      }
    });

    it("should reject conversation history exceeding 20 items", () => {
      const history = Array.from({ length: 21 }, (_, i) => ({
        role: i % 2 === 0 ? "user" : "model",
        text: `Message ${i}`,
      }));

      const result = chatRequestSchema.safeParse({
        message: "Test question",
        history,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("cannot exceed 20 messages");
      }
    });
  });

  describe("contactEmailSchema", () => {
    it("should accept valid contact email payload", () => {
      const result = contactEmailSchema.safeParse({
        customerName: "Sara Ahmed",
        customerEmail: "sara.ahmed@example.com",
        subject: "Wedding Cake Consultation",
        message: "We need a 3-tier chocolate fudge cake for next Saturday.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const result = contactEmailSchema.safeParse({
        customerEmail: "not-an-email",
        subject: "Inquiry",
        message: "Hello kitchen!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email");
      }
    });

    it("should reject subject with CRLF header injection characters", () => {
      const result = contactEmailSchema.safeParse({
        customerEmail: "hacker@example.com",
        subject: "Subject\r\nBcc: victim@example.com",
        message: "Header injection attempt",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("newline");
      }
    });

    it("should reject too short message", () => {
      const result = contactEmailSchema.safeParse({
        customerEmail: "valid@example.com",
        subject: "Hello",
        message: "Hi",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 5 characters");
      }
    });
  });

  describe("whatsAppPrepSchema", () => {
    it("should accept valid WhatsApp message preparation", () => {
      const result = whatsAppPrepSchema.safeParse({
        customerName: "Imran Khan",
        phone: "03001234567",
        message: "I want to place an order for Lotus Biscoff Cake.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty WhatsApp message", () => {
      const result = whatsAppPrepSchema.safeParse({
        message: "",
      });
      expect(result.success).toBe(false);
    });
  });
});

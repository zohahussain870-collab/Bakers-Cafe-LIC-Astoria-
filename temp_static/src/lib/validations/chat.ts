import { z } from "zod";

/**
 * Chat message request schema for Gemini AI interactions.
 * Enforces strict bounds on input length and conversation history depth.
 */
export const chatHistoryItemSchema = z.object({
  role: z.enum(["user", "model", "assistant"]),
  text: z.string().min(1).max(1000).trim(),
});

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Message cannot be empty",
    }),
  history: z.array(chatHistoryItemSchema).max(20, "Conversation history cannot exceed 20 messages").default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatHistoryItem = z.infer<typeof chatHistoryItemSchema>;

/**
 * Contact email submission schema.
 * Rejects header injection, malformed addresses, and oversized payloads.
 */
export const contactEmailSchema = z.object({
  customerName: z
    .string()
    .max(100, "Name cannot exceed 100 characters")
    .trim()
    .optional()
    .default("Guest Customer"),
  customerEmail: z
    .string()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters")
    .trim()
    .toLowerCase(),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(150, "Subject cannot exceed 150 characters")
    .trim()
    // Prevent CRLF header injection
    .refine((val) => !/[\r\n]/.test(val), {
      message: "Subject cannot contain newline characters",
    }),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message cannot exceed 2000 characters")
    .trim(),
});

export type ContactEmailRequest = z.infer<typeof contactEmailSchema>;

/**
 * WhatsApp message preparation schema.
 */
export const whatsAppPrepSchema = z.object({
  customerName: z.string().max(100).trim().optional(),
  phone: z.string().max(25).trim().optional(),
  message: z.string().min(1, "Message is required").max(1500, "Message is too long").trim(),
});

export type WhatsAppPrepRequest = z.infer<typeof whatsAppPrepSchema>;

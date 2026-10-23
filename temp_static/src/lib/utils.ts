import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer amount as US dollars.
 * e.g. 34 -> "$34"
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a cryptographically secure, high-entropy, human-readable Order Reference
 * e.g. "BC-2026-X8K2M9" (32^6 = 1,073,741,824 possible permutations)
 * Uses native Web Crypto API (globalThis.crypto) to eliminate node built-in shims.
 */
export function generateOrderReference(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // removed ambiguous 0, 1, I, O (32 chars)
  const bytes = new Uint8Array(6);
  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 6; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(bytes[i] % chars.length);
  }
  return `BC-2026-${code}`;
}

/**
 * Clean & normalize a phone number for official WhatsApp click-to-chat links
 * Input: "+1 718-489-9077" or "7184899077" -> "17184899077"
 */
export function normalizeWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits;
  }
  return digits;
}

/**
 * Validate a US phone number (10 digits, optionally prefixed with 1).
 */
export function isValidUSPhone(rawPhone: string): boolean {
  const digits = normalizeWhatsAppNumber(rawPhone);
  return digits.length === 11 && digits.startsWith("1");
}

/**
 * Format a US telephone number for display.
 * e.g. "7184899077" -> "+1 (718) 489-9077"
 */
export function formatUSPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (national.length === 10) {
    return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
  }
  return rawPhone;
}

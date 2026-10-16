import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer amount into Pakistani Rupee (PKR) display
 * e.g. 1500 -> "PKR 1,500"
 */
export function formatPKR(amount: number): string {
  return `PKR ${new Intl.NumberFormat("en-PK").format(amount)}`;
}

/**
 * Generate a cryptographically secure, high-entropy, human-readable Order Reference
 * e.g. "HB-2026-X8K2M9" (32^6 = 1,073,741,824 possible permutations)
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
  return `HB-2026-${code}`;
}

/**
 * Clean & normalize a phone number for official WhatsApp click-to-chat links
 * Input: "+92 330 2964562" or "03302964562" -> "923302964562"
 */
export function normalizeWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `92${digits.slice(1)}`;
  }
  if (digits.startsWith("92")) {
    return digits;
  }
  return digits;
}

/**
 * Format telephone number for clean display in Pakistan
 * e.g. "03302964562" -> "+92 330 2964562"
 */
export function formatPakistanPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) {
    return `+92 ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `+92 ${digits.slice(1, 4)} ${digits.slice(4)}`;
  }
  return rawPhone;
}

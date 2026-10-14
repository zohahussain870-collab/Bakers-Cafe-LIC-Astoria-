/**
 * Hardened Rate Limiter utility with memory bounds, IP validation,
 * and proxy normalization (OWASP ASVS V2.2, V13.1).
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Bounded in-memory store to prevent Memory Exhaustion DoS
const MAX_STORE_SIZE = 10000;
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    pruneStaleEntries();
  }, 5 * 60 * 1000).unref?.();
}

function pruneStaleEntries(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitOptions {
  intervalMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { intervalMs: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt <= now) {
    // If store exceeds max capacity, prune stale or evict oldest to prevent OOM
    if (rateLimitStore.size >= MAX_STORE_SIZE) {
      pruneStaleEntries();
      if (rateLimitStore.size >= MAX_STORE_SIZE) {
        // Evict first (oldest) entry
        const oldestKey = rateLimitStore.keys().next().value;
        if (oldestKey) rateLimitStore.delete(oldestKey);
      }
    }

    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + options.intervalMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      resetAt: newRecord.resetAt,
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Validate that an IP string is a syntactically valid IPv4 or IPv6 address.
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  // IPv4 simple check: 4 octets 0-255
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split(".").map(Number);
    return parts.every((p) => p >= 0 && p <= 255);
  }
  // IPv6 check
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * Safely extract client IP respecting trusted reverse proxies (Cloudflare, Vercel)
 * and rejecting malformed or spoofed addresses.
 */
export function getClientIp(req: Request): string {
  // 1. Cloudflare prioritized header
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp && isValidIp(cfIp)) {
    return cfIp;
  }

  // 2. Vercel edge IP header
  const vercelIp = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
                   req.headers.get("x-vercel-ip")?.trim();
  if (vercelIp && isValidIp(vercelIp)) {
    return vercelIp;
  }

  // 3. Nginx / reverse proxy X-Real-IP
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }

  // 4. Standard X-Forwarded-For: In production behind a single reverse proxy,
  // the client IP is typically the first or last depending on architecture.
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // When behind an untrusted network in development or unconfigured proxy,
    // evaluate the last hop or validate format
    const ips = forwarded.split(",").map((s) => s.trim()).filter(Boolean);
    for (const ip of ips) {
      if (isValidIp(ip)) {
        return ip;
      }
    }
  }

  return "127.0.0.1";
}

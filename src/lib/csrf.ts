import { NextResponse } from "next/server";

/**
 * Defense-in-depth Cross-Site Request Forgery (CSRF) & Origin Validator
 * (OWASP ASVS V4.2, V13.1, V14.4)
 */

export function validateOriginAndCsrf(req: Request): NextResponse | null {
  const method = req.method.toUpperCase();

  // Safe read-only HTTP methods do not mutate state
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null;
  }

  // 1. Content-Type enforcement: state mutations must use application/json
  // This prevents standard HTML form POST submissions from bypassing CORS preflight
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid Content-Type. State-changing requests must submit application/json." },
      { status: 415 }
    );
  }

  // 2. Origin & Referer validation
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || "";

  // Derive allowed origins from host header and NEXT_PUBLIC_APP_URL
  const allowedHosts = new Set<string>();
  if (host) allowedHosts.add(host.toLowerCase());
  allowedHosts.add("localhost:3000");
  allowedHosts.add("127.0.0.1:3000");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const parsedApp = new URL(appUrl);
      allowedHosts.add(parsedApp.host.toLowerCase());
    } catch {}
  }

  // Check Origin header if present
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (!allowedHosts.has(originUrl.host.toLowerCase())) {
        return NextResponse.json(
          { error: "Cross-origin request blocked: untrusted origin." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Malformed origin header." },
        { status: 400 }
      );
    }
  } else if (referer) {
    // If Origin is omitted (e.g. some same-origin proxy scenarios), check Referer
    try {
      const refererUrl = new URL(referer);
      if (!allowedHosts.has(refererUrl.host.toLowerCase())) {
        return NextResponse.json(
          { error: "Cross-origin request blocked: untrusted referer." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Malformed referer header." },
        { status: 400 }
      );
    }
  }

  return null;
}

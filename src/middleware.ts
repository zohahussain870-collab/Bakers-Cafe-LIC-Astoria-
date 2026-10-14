import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateOriginAndCsrf } from "@/lib/csrf";

export function middleware(req: NextRequest) {
  // Enforce Origin & CSRF defense on state-changing API endpoints
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const csrfError = validateOriginAndCsrf(req);
    if (csrfError) {
      return csrfError;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};

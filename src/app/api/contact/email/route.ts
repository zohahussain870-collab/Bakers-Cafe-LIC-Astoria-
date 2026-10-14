import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { contactEmailSchema } from "@/lib/validations/chat";
import { sendContactEmail } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Abuse protection: Rate limit to 5 emails per 15 minutes per IP
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`contact_email_${clientIp}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many email requests. Please wait a few minutes or message us on WhatsApp.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate request body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const validation = contactEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    // 3. Dispatch email via Resend or return safe fallback
    const result = await sendContactEmail(validation.data);

    if (result.notConfigured) {
      return NextResponse.json(
        {
          success: false,
          notConfigured: true,
          message: result.message,
          mailtoUrl: result.mailtoUrl,
        },
        { status: 200 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          mailtoUrl: result.mailtoUrl,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      id: result.id,
    });
  } catch (err: unknown) {
    console.error("[Contact Email API Error]:", err);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while sending your email inquiry. Please reach out via WhatsApp.",
      },
      { status: 500 }
    );
  }
}

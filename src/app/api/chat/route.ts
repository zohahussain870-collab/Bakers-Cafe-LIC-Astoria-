import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { chatRequestSchema } from "@/lib/validations/chat";
import { generateChatbotResponse } from "@/lib/ai/gemini";
import type { CatalogProductSummary } from "@/lib/ai/gemini";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Abuse protection: Rate limit to 20 chat requests per minute per IP
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`chat_${clientIp}`, {
      intervalMs: 60 * 1000,
      maxRequests: 20,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many messages sent. Please wait a moment before trying again.",
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

    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { message, history } = validation.data;

    // 3. Query active products to provide grounded catalog context
    let catalogSummary: CatalogProductSummary[] = [];
    try {
      const products = await prisma.product.findMany({
        where: {
          availability: { not: "UNAVAILABLE" },
        },
        select: {
          name: true,
          basePrice: true,
          prepTime: true,
          shortDescription: true,
          allergens: true,
          category: {
            select: { name: true },
          },
          variants: {
            where: { isAvailable: true },
            select: { name: true, priceAdjustment: true },
          },
        },
        take: 25,
      });

      catalogSummary = products.map((p) => ({
        name: p.name,
        category: p.category.name,
        basePrice: p.basePrice,
        prepTime: p.prepTime,
        shortDescription: p.shortDescription,
        allergens: p.allergens,
        variants: p.variants,
      }));
    } catch (dbErr) {
      console.warn("[Chat API] Database unavailable, using fallback catalog context:", dbErr);
      catalogSummary = FALLBACK_PRODUCTS.map((p) => ({
        name: p.name,
        category: p.category?.name || "Bakery",
        basePrice: p.basePrice,
        prepTime: p.prepTime,
        shortDescription: p.shortDescription,
        allergens: p.allergens || undefined,
        variants: p.variants?.map((v) => ({ name: v.name, priceAdjustment: v.priceAdjustment })),
      }));
    }

    // 4. Generate AI response via Gemini with grounded context
    const response = await generateChatbotResponse({
      message,
      history,
      catalog: catalogSummary,
    });

    return NextResponse.json({
      text: response.text,
      source: response.source,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    console.error("[Chat API Error]:", err);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing your message. Please reach us directly on WhatsApp.",
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

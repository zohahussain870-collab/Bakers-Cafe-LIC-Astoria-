import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Pre-computed constant dummy bcrypt hash used to prevent timing attack enumeration
const DUMMY_HASH = "$2b$12$e8984928042940294820492840294820492840294820492840294";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // Rate limiting: max 5 login attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`admin_login_${clientIp}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error:
            "Too many failed login attempts from this network. Access is throttled for 15 minutes.",
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive) {
      // Execute dummy bcrypt comparison to neutralize timing attacks (ASVS V2.2.4)
      await verifyPassword(password, DUMMY_HASH).catch(() => {});

      // Record failed attempt in audit log
      await prisma.auditLog.create({
        data: {
          action: "LOGIN_FAILED",
          userId: null,
          userName: null,
          details: JSON.stringify({ email: cleanEmail, reason: "Account not found or inactive" }),
          ipAddress: clientIp,
        },
      }).catch(() => {});

      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      // Record failed attempt in audit log
      await prisma.auditLog.create({
        data: {
          action: "LOGIN_FAILED",
          userId: user.id,
          userName: user.name,
          details: JSON.stringify({ email: cleanEmail, reason: "Incorrect password" }),
          ipAddress: clientIp,
        },
      }).catch(() => {});

      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create session and set HTTP-only cookie
    await createSession(user.id);

    // Record successful login in audit log
    await prisma.auditLog.create({
      data: {
        action: "LOGIN_SUCCESS",
        userId: user.id,
        userName: user.name,
        details: JSON.stringify({ email: cleanEmail }),
        ipAddress: clientIp,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred during authentication." },
      { status: 500 }
    );
  }
}

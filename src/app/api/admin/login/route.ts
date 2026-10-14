import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
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
      // Generic error message to prevent user enumeration
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
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred during authentication." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, delta, newStock } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let finalStock = product.stock;
    if (newStock !== undefined) {
      finalStock = Math.max(0, parseInt(newStock, 10));
    } else if (delta !== undefined) {
      finalStock = Math.max(0, product.stock + parseInt(delta, 10));
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: finalStock,
        isStockTracked: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "INVENTORY_ADJUSTED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({
          productId,
          productName: product.name,
          previousStock: product.stock,
          newStock: finalStock,
        }),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, stock: updated.stock });
  } catch (error) {
    console.error("Inventory adjustment error:", error);
    return NextResponse.json(
      { error: "Failed to adjust inventory." },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

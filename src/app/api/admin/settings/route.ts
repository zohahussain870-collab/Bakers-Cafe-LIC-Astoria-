import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      address,
      phone,
      whatsappNumber,
      mapsUrl,
      isOnlineOrderingEnabled,
      isWhatsAppOrderingEnabled,
      isTakeoutEnabled,
      isDeliveryEnabled,
      deliveryFee,
      minOrderValue,
      defaultPrepTime,
      isMaintenanceMode,
      maintenanceMessage,
    } = body;

    const updated = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: {
        ...(businessName !== undefined ? { businessName: businessName.trim() } : {}),
        ...(address !== undefined ? { address: address.trim() } : {}),
        ...(phone !== undefined ? { phone: phone.trim() } : {}),
        ...(whatsappNumber !== undefined ? { whatsappNumber: whatsappNumber.trim() } : {}),
        ...(mapsUrl !== undefined ? { mapsUrl: mapsUrl.trim() } : {}),
        ...(isOnlineOrderingEnabled !== undefined ? { isOnlineOrderingEnabled: Boolean(isOnlineOrderingEnabled) } : {}),
        ...(isWhatsAppOrderingEnabled !== undefined ? { isWhatsAppOrderingEnabled: Boolean(isWhatsAppOrderingEnabled) } : {}),
        ...(isTakeoutEnabled !== undefined ? { isTakeoutEnabled: Boolean(isTakeoutEnabled) } : {}),
        ...(isDeliveryEnabled !== undefined ? { isDeliveryEnabled: Boolean(isDeliveryEnabled) } : {}),
        ...(deliveryFee !== undefined ? { deliveryFee: parseInt(deliveryFee, 10) || 0 } : {}),
        ...(minOrderValue !== undefined ? { minOrderValue: parseInt(minOrderValue, 10) || 0 } : {}),
        ...(defaultPrepTime !== undefined ? { defaultPrepTime: defaultPrepTime.trim() } : {}),
        ...(isMaintenanceMode !== undefined ? { isMaintenanceMode: Boolean(isMaintenanceMode) } : {}),
        ...(maintenanceMessage !== undefined ? { maintenanceMessage: maintenanceMessage.trim() } : {}),
      },
      create: {
        id: "default",
        businessName: businessName?.trim() || "Home Bakery",
        address: address?.trim() || "House R-1932, Block 17, Gulberg Town, Karachi, 75950, Pakistan",
        phone: phone?.trim() || "+92 330 2964562",
        whatsappNumber: whatsappNumber?.trim() || "923302964562",
        mapsUrl: mapsUrl?.trim() || "https://www.google.com/maps/search/?api=1&query=Home+Bakery+House+R-1932+Block+17+Gulberg+Town+Karachi",
        isOnlineOrderingEnabled: Boolean(isOnlineOrderingEnabled),
        isWhatsAppOrderingEnabled: Boolean(isWhatsAppOrderingEnabled),
        isTakeoutEnabled: Boolean(isTakeoutEnabled),
        isDeliveryEnabled: Boolean(isDeliveryEnabled),
        deliveryFee: parseInt(deliveryFee, 10) || 250,
        minOrderValue: parseInt(minOrderValue, 10) || 0,
        defaultPrepTime: defaultPrepTime?.trim() || "4-6 hours notice",
        isMaintenanceMode: Boolean(isMaintenanceMode),
        maintenanceMessage: maintenanceMessage?.trim() || "Kitchen maintenance in progress",
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "SETTINGS_UPDATED",
        userId: admin.id,
        userName: admin.name,
        details: JSON.stringify({
          isMaintenanceMode: updated.isMaintenanceMode,
          isOnlineOrderingEnabled: updated.isOnlineOrderingEnabled,
        }),
      },
    }).catch(() => {});

    // Instant cache invalidation
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update business settings." },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static'
export async function GET() { return Response.json({ message: 'API not available in static export' }, { status: 503 }) }

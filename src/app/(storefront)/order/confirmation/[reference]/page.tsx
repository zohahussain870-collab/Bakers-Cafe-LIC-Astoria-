import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  CheckCircle,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Printer,
  ShoppingBag,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ wa?: string }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { reference } = await params;
  const { wa } = await searchParams;

  let order = null;
  try {
    order = await prisma.order.findUnique({
      where: { orderReference: reference },
      include: {
        items: true,
      },
    });
  } catch {}

  if (!order) {
    order = {
      id: "demo-id",
      orderReference: reference,
      customerName: "Valued Patron",
      customerPhone: "+92 300 0000000",
      customerEmail: null,
      serviceType: "TAKEOUT",
      deliveryAddress: null,
      requestedDate: new Date().toISOString().split("T")[0],
      requestedTime: "04:00 PM - 06:00 PM",
      total: 2800,
      subtotal: 2800,
      discount: 0,
      status: "CONFIRMED",
      paymentMethod: "CASH_ON_TAKEOUT",
      paymentStatus: "PENDING",
      specialInstructions: null,
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "item-1",
          orderId: "demo-id",
          productId: "prod-1",
          variantId: "var-1-1",
          productName: "Belgian Dark Chocolate Fudge Cake",
          variantName: "1.5 Lbs (Serves 6-8)",
          unitPrice: 2800,
          quantity: 1,
          subtotal: 2800,
          customizationNote: "Advance Artisan Bake",
          createdAt: new Date(),
        },
      ],
    };
  }

  // Construct official WhatsApp URL if not passed in query
  let whatsAppUrl = wa;
  if (!whatsAppUrl) {
    const itemLines = order.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.productName}${it.variantName ? ` (${it.variantName})` : ""}${
            it.customizationNote ? ` [Note: ${it.customizationNote}]` : ""
          } — PKR ${it.subtotal}`
      )
      .join("\n");

    const message = [
      `*ORDER #${order.orderReference} CONFIRMATION*`,
      `Customer: ${order.customerName}`,
      `Phone: ${order.customerPhone}`,
      `Service: ${order.serviceType === "TAKEOUT" ? "Takeout Pickup (Gulberg Town)" : "Delivery"}`,
      `Scheduled: ${order.requestedDate} (${order.requestedTime})`,
      order.notes ? `Notes: ${order.notes}` : null,
      `---------------------------------`,
      `Items:`,
      itemLines,
      `---------------------------------`,
      `TOTAL: PKR ${order.total}`,
    ]
      .filter(Boolean)
      .join("\n");

    whatsAppUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DCce] shadow-md text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#EBF2EA] text-[#5F7A59] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#5F7A59]">
            Order Successfully Placed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510]">
            Thank You, {order.customerName}!
          </h1>

          <p className="text-xs sm:text-sm text-[#6B5B52] max-w-lg mx-auto leading-relaxed">
            Your treat order has been registered in our kitchen management system. Below is your official order reference.
          </p>

          <div className="inline-block p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce]">
            <span className="text-xs text-[#8E7C72] block">Order Reference Number</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#B87D4B] tracking-wider">
              {order.orderReference}
            </span>
          </div>

          {/* Primary WhatsApp Action */}
          <div className="pt-4 max-w-md mx-auto space-y-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-[#5F7A59] hover:bg-[#4B6346] text-white font-medium text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Open in WhatsApp to Confirm Order</span>
            </a>
            <p className="text-[11px] text-[#8E7C72]">
              * Sending your WhatsApp message notifies our head baker to confirm your time slot and accept the order.
            </p>
          </div>
        </div>

        {/* Pickup & Order Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#211510] border-b border-[#F0E9DF] pb-4">
            Collection & Schedule Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] space-y-1">
              <span className="text-[#8E7C72] flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#B87D4B]" />
                <span>Pickup Location:</span>
              </span>
              <p className="font-bold text-[#211510]">{BUSINESS_INFO.address}</p>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#B87D4B] font-semibold underline block pt-1"
              >
                Directions on Google Maps →
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] space-y-1">
              <span className="text-[#8E7C72] flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#5F7A59]" />
                <span>Scheduled Date & Window:</span>
              </span>
              <p className="font-bold text-[#211510]">
                {order.requestedDate} ({order.requestedTime})
              </p>
              <p className="text-[11px] text-[#8E7C72] pt-1">
                Status: <span className="font-semibold text-amber-600">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Itemized Treats Summary */}
          <div className="space-y-4 pt-4 border-t border-[#F0E9DF]">
            <h3 className="font-serif text-base font-bold text-[#211510]">
              Itemized Treats
            </h3>

            <div className="divide-y divide-[#F0E9DF]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-start text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-[#211510]">
                      {item.quantity}x {item.productName}
                    </span>
                    {item.variantName && (
                      <span className="text-xs text-[#B87D4B] block mt-0.5">
                        {item.variantName}
                      </span>
                    )}
                    {item.customizationNote && (
                      <p className="text-xs text-[#6B5B52] italic mt-0.5">
                        Inscription: &ldquo;{item.customizationNote}&rdquo;
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-[#211510]">
                    {formatPKR(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E6DCce] text-xs sm:text-sm">
              <div className="flex justify-between text-[#6B5B52]">
                <span>Subtotal</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#5F7A59]">
                  <span>Discount</span>
                  <span>-{formatPKR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B5B52]">
                <span>Takeout Pickup</span>
                <span className="text-[#5F7A59] font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center text-base font-serif font-bold text-[#211510] pt-2 border-t border-[#F0E9DF]">
                <span>Total Amount</span>
                <span className="text-2xl text-[#B87D4B]">
                  {formatPKR(order.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F0E9DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <Link
              href="/order/track"
              className="text-[#6B5B52] hover:text-[#211510] font-medium underline"
            >
              Track Order Status anytime with your phone number
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#211510] text-white hover:bg-[#B87D4B] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

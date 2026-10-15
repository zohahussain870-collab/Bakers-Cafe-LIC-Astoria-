"use client";

import dynamic from "next/dynamic";

// Dynamically loaded client-side widgets to optimize initial page bundle and reduce unused JS
const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

const ChatbotWidget = dynamic(
  () => import("@/components/chatbot/ChatbotWidget").then((mod) => mod.ChatbotWidget),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <CartDrawer />
      <ChatbotWidget />
    </>
  );
}

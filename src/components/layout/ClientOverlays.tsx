"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";

// Dynamically loaded client-side widgets to optimize initial page bundle and eliminate initial TBT
const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

const ChatbotWidget = dynamic(
  () => import("@/components/chatbot/ChatbotWidget").then((mod) => mod.ChatbotWidget),
  { ssr: false }
);

export function ClientOverlays() {
  const { isOpen } = useCart();
  const [mountChatbot, setMountChatbot] = useState(false);

  useEffect(() => {
    // Defer chatbot widget until main thread is idle to eliminate TBT and maximize mobile performance
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        () => setMountChatbot(true),
        { timeout: 2500 }
      );
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => setMountChatbot(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {isOpen && <CartDrawer />}
      {mountChatbot && <ChatbotWidget />}
    </>
  );
}

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <main className="flex-1">{children}</main>
      </div>

      <Footer />
      <CartDrawer />
      <ChatbotWidget />
    </div>
  );
}

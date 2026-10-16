import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientOverlays } from "@/components/layout/ClientOverlays";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between w-full">
      <div className="w-full">
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </div>

      <Footer />
      <ClientOverlays />
    </div>
  );
}

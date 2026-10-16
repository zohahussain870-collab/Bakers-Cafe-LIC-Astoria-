"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MessageSquare, X } from "lucide-react";

const ChatWindow = dynamic(
  () => import("./ChatWindow").then((mod) => mod.ChatWindow),
  { ssr: false }
);

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setHasInteracted(true);
  };

  return (
    <>
      {/* Floating Chat Modal */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* Floating Circular Launcher Button */}
      <div className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-40 select-none">
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-label={
            isOpen
              ? "Close Home Bakery customer support chat"
              : "Open Home Bakery customer support chat"
          }
          className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-[#784218] via-[#8F5323] to-[#A3632E] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#8F5323]/40"
        >
          {/* Subtle pulse ring on initial state */}
          {!hasInteracted && !isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#8F5323]/30 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
          )}

          {/* Badge: Live help indicator */}
          {!isOpen && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          )}

          {/* Tooltip on hover (desktop) */}
          <span className="sr-only">Customer Support Chat</span>
          <span
            role="tooltip"
            className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#211510] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-md hidden sm:block"
          >
            {isOpen ? "Close Chat" : "Need help? Chat with us!"}
          </span>
        </button>
      </div>
    </>
  );
}

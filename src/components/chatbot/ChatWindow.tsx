"use client";

import React, { useState } from "react";
import { X, Minus } from "lucide-react";
import { ChannelSwitcher, type ChatChannel } from "./ChannelSwitcher";
import { AiChatView, type MessageItem } from "./AiChatView";
import { WhatsAppView } from "./WhatsAppView";
import { EmailView } from "./EmailView";

interface ChatWindowProps {
  onClose: () => void;
}

const INITIAL_WELCOME_MESSAGE: MessageItem = {
  id: "welcome-1",
  role: "assistant",
  text: "Hello! 👋 Welcome to Home Bakery Karachi. I can help you with our freshly baked artisan menu, prices, ordering steps, or custom cake inquiries. What can I bake for you today?",
  timestamp: 0,
};

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>("chat");
  const [sharedDraft, setSharedDraft] = useState("");

  // Persistent in-memory chat history during user session
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_WELCOME_MESSAGE]);

  return (
    <div
      role="dialog"
      aria-label="Home Bakery Customer Support"
      aria-modal="true"
      className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] h-[550px] max-h-[82vh] bg-white rounded-3xl border border-[#E6DCce] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* Header */}
      <div className="bg-[#211510] text-white px-4 py-3 flex items-center justify-between shrink-0 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#B87D4B] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
            HB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif font-bold text-sm tracking-wide">Home Bakery</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-white/70">Gulberg Town, Karachi • Online Help</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClose}
            aria-label="Minimize support chat"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close support chat"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Channel Switcher */}
      <ChannelSwitcher
        activeChannel={activeChannel}
        onSelectChannel={setActiveChannel}
      />

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeChannel === "chat" && (
          <AiChatView
            messages={messages}
            setMessages={setMessages}
            onPrefillWhatsApp={(draft) => setSharedDraft(draft)}
          />
        )}

        {activeChannel === "whatsapp" && (
          <WhatsAppView initialMessage={sharedDraft} />
        )}

        {activeChannel === "email" && (
          <EmailView initialMessage={sharedDraft} />
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Sparkles, MessageCircle, Mail } from "lucide-react";

export type ChatChannel = "chat" | "whatsapp" | "email";

interface ChannelSwitcherProps {
  activeChannel: ChatChannel;
  onSelectChannel: (channel: ChatChannel) => void;
}

export function ChannelSwitcher({
  activeChannel,
  onSelectChannel,
}: ChannelSwitcherProps) {
  const channels: Array<{
    id: ChatChannel;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "chat", label: "AI Chat", icon: Sparkles },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "email", label: "Email", icon: Mail },
  ];

  return (
    <div
      role="tablist"
      aria-label="Contact channels"
      className="flex items-center gap-1 p-1 bg-[#FAF7F2] border-b border-[#F0E9DF]"
    >
      {channels.map((ch) => {
        const Icon = ch.icon;
        const isActive = activeChannel === ch.id;

        return (
          <button
            key={ch.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`channel-panel-${ch.id}`}
            id={`channel-tab-${ch.id}`}
            type="button"
            onClick={() => onSelectChannel(ch.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B87D4B] ${
              isActive
                ? "bg-white text-[#B87D4B] shadow-xs font-bold border border-[#E6DCce]"
                : "text-[#6B5B52] hover:text-[#211510] hover:bg-white/60"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-transform ${
                isActive ? "text-[#B87D4B] scale-110" : "text-[#8E7C72]"
              }`}
            />
            <span>{ch.label}</span>
          </button>
        );
      })}
    </div>
  );
}

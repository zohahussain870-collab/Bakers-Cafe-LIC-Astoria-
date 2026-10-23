"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";
import type { ChatHistoryItem } from "@/lib/validations/chat";

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface AiChatViewProps {
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  onPrefillWhatsApp: (text: string) => void;
}

const SUGGESTED_PROMPTS = [
  "What products do you have?",
  "How can I place an order?",
  "What are your opening hours?",
  "How can I contact Bakers Cafe LIC?",
];

export function AiChatView({
  messages,
  setMessages,
  onPrefillWhatsApp,
}: AiChatViewProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend ?? input).trim();
    if (!text || isLoading) return;

    setError(null);
    setInput("");

    // Keep draft for WhatsApp sync
    onPrefillWhatsApp(text);

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Map history for API
      const historyPayload: ChatHistoryItem[] = messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson.error || `Server responded with status ${res.status}`
        );
      }

      const data = await res.json();
      const assistantMessage: MessageItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: data.text || "Thank you for reaching out! How else may I assist you today?",
        timestamp: data.timestamp || Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to reach the assistant.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2]/40">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#8F5323] text-white rounded-br-xs"
                  : "bg-white text-[#211510] border border-[#E6DCce] rounded-bl-xs"
              }`}
            >
              {m.role === "assistant" && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8F5323] uppercase tracking-wider mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Bakery Assistant</span>
                </div>
              )}
              {m.text}
            </div>
            <span className="text-[10px] text-[#68584F] mt-0.5 px-1 font-medium">
              {new Date(m.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-[#E6DCce] rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#8F5323] animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-[#8F5323] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#8F5323] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => handleSend(messages[messages.length - 1]?.text)}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-900 underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry message</span>
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompt chips */}
      {messages.length <= 2 && (
        <div className="px-3 pt-1 pb-2 border-t border-[#F0E9DF] bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#68584F] mb-1.5 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            <span>Suggested Questions:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E6DCce] text-[#211510] hover:bg-[#F7EDE2] hover:border-[#8F5323] transition-colors font-medium disabled:opacity-50 text-left focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8F5323]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input footer */}
      <div className="p-3 bg-white border-t border-[#F0E9DF]">
        <div className="flex items-end gap-2 bg-[#FAF7F2] border border-[#E6DCce] rounded-2xl p-1.5 focus-within:border-[#8F5323] focus-within:ring-1 focus-within:ring-[#8F5323] transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ask Bakers Cafe LIC assistant a question"
            placeholder="Type your question... (Enter to send)"
            disabled={isLoading}
            maxLength={1000}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-[13px] text-[#211510] placeholder-[#68584F] focus:outline-none resize-none max-h-24"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="p-2 rounded-xl bg-[#8F5323] text-white hover:bg-[#784218] disabled:opacity-40 disabled:hover:bg-[#8F5323] transition-all shrink-0 shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#68584F] px-2 pt-1 font-medium">
          <span>Shift+Enter for new line</span>
          <span>{input.length}/1000</span>
        </div>
      </div>
    </div>
  );
}

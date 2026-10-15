"use client";

import React, { useState } from "react";
import { MessageCircle, ExternalLink, AlertCircle, Info } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/constants";

interface WhatsAppViewProps {
  initialMessage?: string;
}

export function WhatsAppView({ initialMessage = "" }: WhatsAppViewProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please write a message to send to Home Bakery.");
      return;
    }

    setError(null);

    // Format greeting & inquiry
    let formattedText = `Hello Home Bakery!\n\n`;
    if (customerName.trim()) {
      formattedText += `Customer Name: ${customerName.trim()}\n`;
    }
    if (phone.trim()) {
      formattedText += `Contact: ${phone.trim()}\n`;
    }
    formattedText += `Inquiry: ${message.trim()}`;

    const waUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
      formattedText
    )}`;

    // Open WhatsApp
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2]/40 overflow-y-auto p-4 sm:p-5">
      <div className="space-y-4">
        {/* Information Callout */}
        <div className="p-3.5 rounded-2xl bg-[#EBF2EA] border border-[#D1E0CF] text-[#2C4128] text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-[#5F7A59] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#3B5436]">
              Direct Kitchen WhatsApp: {BUSINESS_INFO.phone}
            </p>
            <p className="mt-0.5 text-[11px] text-[#4A6644]">
              Tapping <strong>Continue to WhatsApp</strong> will launch your WhatsApp application with your message ready. You can review and hit send directly in WhatsApp!
            </p>
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-3.5">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="wa-customer-name"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Your Name <span className="text-[#68584F] font-normal">(Optional)</span>
            </label>
            <input
              id="wa-customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              maxLength={100}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510]"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label
              htmlFor="wa-customer-phone"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Phone / WhatsApp Number{" "}
              <span className="text-[#68584F] font-normal">(Optional)</span>
            </label>
            <input
              id="wa-customer-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0300 1234567"
              maxLength={25}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510]"
            />
          </div>

          {/* Message Area */}
          <div>
            <label
              htmlFor="wa-message"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Your Inquiry or Order Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="wa-message"
              rows={4}
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Tell us what treats you'd like, pickup dates, or any special custom cake requests..."
              maxLength={1500}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510] resize-none"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#5F7A59] hover:bg-[#4B6346] text-white text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F7A59]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Continue to WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </form>
      </div>
    </div>
  );
}

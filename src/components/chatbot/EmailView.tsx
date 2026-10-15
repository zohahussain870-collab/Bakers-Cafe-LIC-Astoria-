"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

interface EmailViewProps {
  initialMessage?: string;
}

export function EmailView({ initialMessage = "" }: EmailViewProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("Home Bakery Inquiry");
  const [message, setMessage] = useState(initialMessage);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unconfiguredInfo, setUnconfiguredInfo] = useState<{
    message: string;
    mailtoUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setUnconfiguredInfo(null);

    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setErrorMessage("Please provide a valid email address so we can reply.");
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage("Please enter a message of at least 5 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim() || "Guest Customer",
          customerEmail: customerEmail.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (data.notConfigured) {
        setUnconfiguredInfo({
          message: data.message,
          mailtoUrl: data.mailtoUrl,
        });
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to send email");
      }

      setSuccessMessage(
        data.message || "Your email inquiry has been received! We will reply promptly."
      );
      setMessage("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to deliver email inquiry.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2]/40 overflow-y-auto p-4 sm:p-5">
      <div className="space-y-4">
        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-950">Email Dispatched!</p>
              <p className="mt-0.5 leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Unconfigured Provider Fallback Banner */}
        {unconfiguredInfo && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Email Provider Not Configured</p>
                <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
                  {unconfiguredInfo.message}
                </p>
              </div>
            </div>
            <a
              href={unconfiguredInfo.mailtoUrl}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#211510] hover:bg-[#B87D4B] text-white text-xs font-bold transition-colors w-full justify-center"
            >
              <span>Open in Email Application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[10px] text-amber-700 text-center">
              *Opens your device&apos;s default mail client with prefilled details.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="email-name"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Your Name <span className="text-[#68584F] font-normal">(Optional)</span>
            </label>
            <input
              id="email-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Bilal Ahmed"
              maxLength={100}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510]"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label
              htmlFor="email-address"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Your Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email-address"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. you@example.com"
              maxLength={150}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510]"
            />
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="email-subject"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="email-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Inquiry or Custom Cake Question"
              maxLength={150}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510]"
            />
          </div>

          {/* Message Area */}
          <div>
            <label
              htmlFor="email-message"
              className="block text-xs font-bold text-[#211510] mb-1"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="email-message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your inquiry, event date, dietary requirements, or questions..."
              maxLength={2000}
              className="w-full px-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E6DCce] rounded-xl focus:outline-none focus:border-[#B87D4B] focus:ring-1 focus:ring-[#B87D4B] transition-all text-[#211510] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#211510] hover:bg-[#B87D4B] text-white text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B87D4B]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Email...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Email to Kitchen</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

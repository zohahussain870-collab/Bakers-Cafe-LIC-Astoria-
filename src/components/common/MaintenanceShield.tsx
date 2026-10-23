import React from "react";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/constants";
import { Wrench, Phone, MessageCircle, MapPin, Lock } from "lucide-react";

export function MaintenanceShield({
  message,
}: {
  message?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-12 border border-[#E6DCce] shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F7EDE2] text-[#B87D4B] flex items-center justify-center mx-auto shadow-sm">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D4B]">
            Scheduled Kitchen Maintenance
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#211510]">
            Bakers Cafe LIC
          </h1>
        </div>

        <p className="text-sm text-[#6B5B52] leading-relaxed">
          {message ||
            "Our artisan kitchen is currently undergoing scheduled updates. Online order placement is temporarily paused, but we will be back shortly!"}
        </p>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] text-xs text-left space-y-2">
          <p className="font-semibold text-[#211510] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#B87D4B]" />
            <span>Need an urgent custom cake or inquiry?</span>
          </p>
          <p className="text-[#6B5B52]">
            Reach out directly to our head baker on WhatsApp:
          </p>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Bakers Cafe LIC! Inquiring regarding an urgent order during maintenance.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#5F7A59] font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>+1 718-489-9077 (WhatsApp)</span>
          </a>
        </div>

        <div className="pt-4 border-t border-[#F0E9DF] flex items-center justify-between text-xs text-[#8E7C72]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#B87D4B]" />
            <span>Astoria, Queens, NY</span>
          </div>
          <Link
            href="/admin/login"
            className="hover:text-[#211510] flex items-center gap-1 transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Staff Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

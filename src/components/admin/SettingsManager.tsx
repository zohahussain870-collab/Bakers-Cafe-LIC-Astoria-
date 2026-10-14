"use client";

import React, { useState } from "react";
import { formatPKR } from "@/lib/utils";
import { Save, AlertTriangle, ShieldCheck, Check, Power, Wrench, Settings } from "lucide-react";

interface SettingsData {
  businessName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  mapsUrl: string;
  isOnlineOrderingEnabled: boolean;
  isWhatsAppOrderingEnabled: boolean;
  isTakeoutEnabled: boolean;
  isDeliveryEnabled: boolean;
  deliveryFee: number;
  minOrderValue: number;
  defaultPrepTime: string;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
}

export function SettingsManager({ initialSettings }: { initialSettings: SettingsData }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback("");
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update settings");
      } else {
        setSettings(data.settings);
        setFeedback("Settings saved and live in effect!");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch {
      setError("Network error while updating settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
            Operational Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
            Configure business information, ordering toggles, and kitchen maintenance mode.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B87D4B] hover:bg-[#9E6535] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Maintenance Mode Emergency Switch */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border transition-all ${
          settings.isMaintenanceMode
            ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
            : "bg-white border-[#E6DCce]"
        } shadow-xs space-y-4`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                settings.isMaintenanceMode
                  ? "bg-amber-500 text-white"
                  : "bg-[#FAF7F2] text-[#8E7C72]"
              }`}
            >
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#211510]">
                Maintenance Mode
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
                When enabled, all public visitors see a branded maintenance page. Authenticated administrators retain full bypass access.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={settings.isMaintenanceMode}
              onChange={(e) =>
                setSettings({ ...settings, isMaintenanceMode: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {settings.isMaintenanceMode && (
          <div className="pt-2 space-y-2">
            <label className="block text-xs font-bold text-[#211510]">
              Custom Maintenance Message Displayed to Visitors:
            </label>
            <textarea
              rows={2}
              value={settings.maintenanceMessage}
              onChange={(e) =>
                setSettings({ ...settings, maintenanceMessage: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm text-[#211510] focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* Ordering & Operational Switches */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
          Ordering Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] cursor-pointer">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#211510] block">
                Online Ordering
              </span>
              <span className="text-xs text-[#8E7C72]">
                Allow customer checkout on website
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.isOnlineOrderingEnabled}
              onChange={(e) =>
                setSettings({ ...settings, isOnlineOrderingEnabled: e.target.checked })
              }
              className="w-5 h-5 rounded text-[#B87D4B] focus:ring-[#B87D4B] border-[#E6DCce]"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] cursor-pointer">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#211510] block">
                WhatsApp Integration
              </span>
              <span className="text-xs text-[#8E7C72]">
                Direct order forwarding via WhatsApp
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.isWhatsAppOrderingEnabled}
              onChange={(e) =>
                setSettings({ ...settings, isWhatsAppOrderingEnabled: e.target.checked })
              }
              className="w-5 h-5 rounded text-[#B87D4B] focus:ring-[#B87D4B] border-[#E6DCce]"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] cursor-pointer">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#211510] block">
                Takeout / Self-Pickup
              </span>
              <span className="text-xs text-[#8E7C72]">
                Gulberg Town kitchen collection (Free)
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.isTakeoutEnabled}
              onChange={(e) =>
                setSettings({ ...settings, isTakeoutEnabled: e.target.checked })
              }
              className="w-5 h-5 rounded text-[#B87D4B] focus:ring-[#B87D4B] border-[#E6DCce]"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] cursor-pointer">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#211510] block">
                Delivery Service
              </span>
              <span className="text-xs text-[#8E7C72]">
                Third-party delivery (Disabled by default)
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.isDeliveryEnabled}
              onChange={(e) =>
                setSettings({ ...settings, isDeliveryEnabled: e.target.checked })
              }
              className="w-5 h-5 rounded text-[#B87D4B] focus:ring-[#B87D4B] border-[#E6DCce]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Delivery Fee (PKR)
            </label>
            <input
              type="number"
              min="0"
              value={settings.deliveryFee}
              onChange={(e) =>
                setSettings({ ...settings, deliveryFee: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Minimum Order Value (PKR)
            </label>
            <input
              type="number"
              min="0"
              value={settings.minOrderValue}
              onChange={(e) =>
                setSettings({ ...settings, minOrderValue: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>
        </div>
      </div>

      {/* Business Source of Truth */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
          Business Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Business Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#211510]">
            Kitchen Full Address
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#211510]">
            Google Maps Search URL
          </label>
          <input
            type="url"
            value={settings.mapsUrl}
            onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
          />
        </div>
      </div>
    </form>
  );
}

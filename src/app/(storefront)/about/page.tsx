import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/constants";
import { Sparkles, ShieldCheck, Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "About Our Artisan Bakery | Handcrafted in Gulberg Town, Karachi",
  description:
    "Learn about Home Bakery's commitment to pure butter, Belgian chocolate, small-batch craftsmanship, and authentic home-based baking in Karachi.",
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-[#FAF7F2] min-h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Our Artisan Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211510]">
            Baking with Heart & Honest Craft
          </h1>
          <p className="text-sm sm:text-base text-[#6B5B52] leading-relaxed">
            From our home kitchen in Gulberg Town, Karachi, we handcraft decadent celebration cakes, fudgy brownies, and sweet delicacies with zero shortcuts.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#F4ECE1]">
            <Image
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan baker preparing handcrafted pastry"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
              The Home Bakery Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              In a commercial world dominated by pre-mixed flour, artificial preservatives, and days-old display cases, Home Bakery was born out of a desire for something genuine.
            </p>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              We operate exclusively as a home-based artisan patisserie. Every single bake is created specifically for the customer who ordered it. We crack fresh farm eggs, melt real 54% and 70% Belgian chocolate, whip pure dairy butter, and bake in measured small batches.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#E6DCce] flex items-start gap-3 shadow-2xs">
              <MapPin className="w-5 h-5 text-[#8F5323] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-[#211510] block">Karachi Kitchen Location:</strong>
                <p className="text-[#6B5B52] mt-0.5">{BUSINESS_INFO.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Standards */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DCce] shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-[#211510]">
              Our Uncompromising Standards
            </h2>
            <p className="text-xs text-[#6B5B52] mt-1">
              What sets our treats apart in taste, texture, and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211510]">
                100% Real Dairy Butter
              </h3>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                We never use cheap margarine, vegetable shortening, or artificial butter substitutes. Every crust and crumb is naturally rich.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2EA] text-[#3B5934] flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211510]">
                Freshly Baked to Order
              </h3>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Zero stored or frozen inventory. Your cake or brownie batch is mixed and baked only after your order is confirmed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DCce] space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F7EDE2] text-[#8F5323] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211510]">
                Strict Hygiene & Care
              </h3>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Prepared in a sanitized private kitchen and packaged in premium, food-safe bakery presentation boxes.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8F5323] hover:bg-[#784218] text-white font-medium text-sm transition-all shadow-md"
          >
            <span>Explore Today&apos;s Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

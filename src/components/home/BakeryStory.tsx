import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Award, ShieldCheck } from "lucide-react";

export function BakeryStory() {
  return (
    <section className="py-20 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-[#F4ECE1]">
              <Image
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
                alt="Baker dusted with flour kneading artisan dough"
                fill
                sizes="(max-width: 1024px) 50vw, 300px"
                className="object-cover"
              />
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-[#F4ECE1]">
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                  alt="Freshly baked croissants and artisan pastries"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E6DCce] shadow-xs">
                <span className="font-serif text-3xl font-bold text-[#B87D4B]">100%</span>
                <p className="text-xs font-medium text-[#211510] mt-1">
                  Pure dairy butter & small-batch craftsmanship
                </p>
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B87D4B]">
              Our Craft & Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] leading-tight">
              Honest Ingredients, Patient Hands & Passion in Every Crumb
            </h2>
            <p className="text-sm sm:text-base text-[#6B5B52] leading-relaxed">
              Home Bakery began as a celebration of authentic flavors in Gulberg Town, Karachi. We believe that true luxury in baking comes from uncompromising simplicity: real creamy butter, rich Belgian chocolate, unbleached flour, and time-honored techniques.
            </p>
            <p className="text-sm sm:text-base text-[#6B5B52] leading-relaxed">
              Because we bake from a private home kitchen, we don't hold days-old inventory on display counters. When you place an order, our oven is heated specifically for your batch.
            </p>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF2EA] text-[#5F7A59] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#211510]">
                    Strict Kitchen Hygiene
                  </h4>
                  <p className="text-xs text-[#8E7C72] mt-0.5">
                    Sanitized preparation surfaces and food-grade packaging.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F7EDE2] text-[#B87D4B] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#211510]">
                    Custom Inscriptions
                  </h4>
                  <p className="text-xs text-[#8E7C72] mt-0.5">
                    Personalized messages and tailored flavor variants.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-semibold text-[#B87D4B] hover:text-[#9E6535] underline decoration-2 underline-offset-4 transition-colors"
              >
                Read our full baking story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

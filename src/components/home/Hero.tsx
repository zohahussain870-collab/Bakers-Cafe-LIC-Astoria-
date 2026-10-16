import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BUSINESS_INFO } from "@/lib/constants";
import {
  ArrowRight,
  MessageCircle,
  Star,
  MapPin,
  Clock,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F7EDE2] rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#EBF2EA] rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-hero-fade-in-up">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EDE2] text-[#8F5323] border border-[#8F5323]/25">
                <MapPin className="w-3.5 h-3.5" />
                <span>Gulberg Town • Karachi</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF2EA] text-[#3B5934] border border-[#3B5934]/25">
                <Clock className="w-3.5 h-3.5" />
                <span>Freshly Baked to Order</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E6DCce] text-[#211510] shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>5.0 Google Rating</span>
                <span className="text-[10px] text-[#68584F] font-medium">(1 review)</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#211510] tracking-tight leading-[1.12]">
              Little Moments, <br />
              <span className="text-[#8F5323] italic font-normal">Baked Beautifully.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#6B5B52] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Handcrafted sweetness for celebrations, thoughtful gifts, and everyday cravings. Made in small batches in our Karachi home kitchen using Belgian chocolate, pure butter, and honest artisan craft.
            </p>

            {/* Service Notice */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-[#E6DCce] text-xs text-[#6B5B52] flex items-center justify-center lg:justify-start gap-2 shadow-2xs">
              <MapPin className="w-4 h-4 text-[#8F5323] shrink-0" />
              <span>
                <strong>Takeout Pickup:</strong> House R-1932, Block 17, Gulberg Town, Karachi. (Advance notice required)
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#8F5323] hover:bg-[#784218] text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg text-sm sm:text-base group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                <span>Explore Our Treats</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Home Bakery! I'd like to place an artisan bake order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#211510] border border-[#E6DCce] font-medium rounded-full transition-colors text-sm sm:text-base shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
              >
                <MessageCircle className="w-4 h-4 text-[#3B5934]" />
                <span>WhatsApp Ordering</span>
              </a>
            </div>

            {/* Micro Details */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#68584F] font-medium">
              <div>✓ 100% Real Dairy Butter</div>
              <div>✓ No Artificial Preservatives</div>
              <div>✓ Eggless Options Available</div>
            </div>
          </div>

          {/* Editorial Visual Composition */}
          <div className="lg:col-span-5 relative animate-hero-fade-in-scale">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F4ECE1] group select-none transition-shadow duration-500 hover:shadow-[0_25px_60px_-15px_rgba(33,21,16,0.35)]">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
                  alt="Artisan Belgian chocolate cake layered with rich ganache"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 500px"
                  className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#F5D5B0]">
                    Signature Cake
                  </span>
                  <h2 className="font-serif text-xl font-bold mt-0.5">
                    Belgian Dark Chocolate Fudge
                  </h2>
                  <p className="text-xs text-white/90 mt-1">
                    Layers of dark cocoa sponge with 54% Callebaut ganache
                  </p>
                </div>
              </div>

              {/* Floating Dessert Accent Card */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white rounded-2xl p-3.5 border border-[#E6DCce] shadow-xl flex items-center gap-3.5 max-w-xs animate-hero-card-in">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#F4ECE1]">
                  <Image
                    src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80"
                    alt="Salted caramel brownies"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex text-amber-500 text-xs" aria-label="5 out of 5 stars">★★★★★</div>
                  <p className="font-serif text-xs font-bold text-[#211510] mt-0.5">
                    Salted Caramel Brownies
                  </p>
                  <p className="text-[11px] text-[#3B5934] font-semibold mt-0.5">
                    Fresh out of the oven
                  </p>
                </div>
              </div>

              {/* Floating Badge on Top Right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-[#211510] text-[#FAF7F2] rounded-full px-4 py-2 border border-[#3A2922] shadow-lg flex items-center gap-2 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open for Takeout Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

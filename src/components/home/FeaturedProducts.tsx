"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ProductDTO } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Cake } from "lucide-react";
import { EASE_EDITORIAL } from "@/lib/animation";

export function FeaturedProducts({ products }: { products: ProductDTO[] }) {
  const shouldReduceMotion = useReducedMotion();

  if (!products || products.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.11,
      },
    },
  };

  const cardVariants = {
    hidden: (index: number) => ({
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 30,
      x: shouldReduceMotion ? 0 : index % 2 === 0 ? -12 : 12,
    }),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: EASE_EDITORIAL,
      },
    },
  };

  return (
    <section className="py-20 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading Reveal */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: EASE_EDITORIAL }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EDE2] text-[#8F5323] border border-[#8F5323]/25 mb-2">
            <Cake className="w-3.5 h-3.5" />
            <span>Artisan Favorites</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510]">
            Fresh Out of Our Oven
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B52] mt-2">
            Each creation is baked with uncompromised dedication to quality, pure butter, and Belgian chocolate.
          </p>
        </motion.div>

        {/* Product Grid with Staggered Scroll Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              variants={cardVariants}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Reveal */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.15, ease: EASE_EDITORIAL }}
          className="mt-14 text-center"
        >
          <Link
            href="/menu"
            aria-label="Explore the artisan bakery menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#211510] hover:bg-[#8F5323] text-white font-medium text-sm transition-all duration-300 shadow-md group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323]"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryDTO } from "@/types";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CategoryShowcase({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="py-16 bg-white border-y border-[#E6DCce] overflow-hidden section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Reveal */}
        <ScrollReveal
          direction="up"
          duration={650}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
              Handcrafted Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
              Explore Our Artisan Range
            </h2>
          </div>
          <Link
            href="/menu"
            aria-label="Explore the artisan bakery menu"
            className="text-sm font-semibold text-[#8F5323] hover:text-[#784218] inline-flex items-center gap-1 group transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] rounded-sm"
          >
            <span>View Full Menu</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </ScrollReveal>

        {/* Categories Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.id}
              direction="up"
              delay={index * 60}
              duration={650}
              className="h-full"
            >
              <Link
                href={`/menu?category=${category.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F7EDE2] border border-[#E6DCce] transition-all duration-300 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8F5323] h-full"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-white shadow-xs bg-[#F4ECE1]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E6DCce] flex items-center justify-center text-xs text-[#68584F]">
                      Bakery
                    </div>
                  )}
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#211510] group-hover:text-[#8F5323] transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-[#68584F] mt-1 font-medium">
                  {category._count?.products ? `${category._count.products} Treats` : "Freshly Baked"}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

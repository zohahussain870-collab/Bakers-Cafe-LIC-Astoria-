import React from "react";
import { ShoppingCart, CalendarClock, Flame, PackageCheck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function OrderingSteps() {
  const steps = [
    {
      step: "01",
      icon: ShoppingCart,
      title: "Select Your Treats",
      description:
        "Browse our artisan menu and customize sizes, flavors, and eggless preferences to match your celebration.",
    },
    {
      step: "02",
      icon: CalendarClock,
      title: "Schedule Your Pickup",
      description:
        "Select your preferred pickup date and time window. Add custom piping notes or personalized messages.",
    },
    {
      step: "03",
      icon: Flame,
      title: "Handcrafted Fresh",
      description:
        "We never freeze or pre-make. Your order is baked fresh from scratch in our home kitchen using 100% real dairy butter.",
    },
    {
      step: "04",
      icon: PackageCheck,
      title: "Gulberg Town Takeout",
      description:
        "Collect your bakery box fresh and securely packaged from House R-1932, Block 17, Gulberg Town, Karachi.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E6DCce] overflow-hidden section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <ScrollReveal
          direction="up"
          duration={650}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5323]">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211510] mt-1">
            How Takeout Ordering Works
          </h2>
          <p className="text-sm sm:text-base text-[#6B5B52] mt-2">
            Because we are a dedicated home-based bakery, each order receives individualized care and fresh preparation.
          </p>
        </ScrollReveal>

        {/* Step Cards with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.step}
                direction="up"
                delay={index * 100}
                duration={650}
                className="h-full"
              >
                <div className="relative bg-[#FAF7F2] p-8 rounded-2xl border border-[#E6DCce] flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#E6DCce] text-[#8F5323] flex items-center justify-center shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-serif text-2xl font-bold text-[#8A796D]">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#211510] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

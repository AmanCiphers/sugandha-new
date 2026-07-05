"use client";

import { Shield, Truck, Award, Heart } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Every product is carefully curated from trusted fragrance houses and artisans.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Free delivery on orders above ₹499. Fast and reliable shipping across India.",
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description:
      "Your privacy and security are our priority. Shop with complete confidence.",
  },
  {
    icon: Heart,
    title: "Love It Guarantee",
    description:
      "Not satisfied? We offer hassle-free returns within 7 days of delivery.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="The Sugandha Difference"
          subtitle="Why fragrance lovers choose us"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-foreground">
                  <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-background" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

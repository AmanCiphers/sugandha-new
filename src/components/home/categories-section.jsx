"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

const fallbackGradients = [
  "from-rose-gold/30 to-muted-blush",
  "from-champagne-gold/30 to-beige",
  "from-stone/20 to-warm-white",
  "from-matte-black/10 to-ivory",
  "from-champagne-gold-dark/20 to-soft-cream",
];

export function CategoriesSection({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="border-t border-border/40 bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Shop by Category"
          subtitle="Find your perfect fragrance family"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative flex h-[260px] items-end overflow-hidden rounded-lg border border-border/40 bg-muted transition-all duration-300 hover:shadow-lg"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br", fallbackGradients[index % fallbackGradients.length])} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 w-full p-6">
                <h3 className="font-serif text-xl font-semibold text-white">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-white/80">
                    {category.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-white/70 transition-colors group-hover:text-white">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

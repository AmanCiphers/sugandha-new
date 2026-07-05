"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Premium Fragrance Collection
            </p>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover Your
              <span className="block text-champagne-gold-dark">
                Signature Scent
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore our curated collection of premium perfumes, attars, and
              fragrance essentials. Crafted for those who appreciate the art of
              fine scent.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop">
                <Button className="h-12 rounded-full bg-foreground px-8 text-sm text-background hover:bg-foreground/90">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-foreground/20 px-8 text-sm"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-champagne-gold/30 via-champagne-gold/10 to-transparent animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-border/40" />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-foreground/5 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-7xl font-bold text-foreground/10 sm:text-8xl">
                    S
                  </p>
                  <p className="mt-2 font-serif text-sm italic text-muted-foreground">
                    Since 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    </section>
  );
}

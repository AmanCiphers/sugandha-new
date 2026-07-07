"use client";

import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 ">
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

            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Free shipping above ₹499</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Handcrafted with care</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-champagne-gold/20 via-champagne-gold/5 to-transparent animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-champagne-gold/20" />
              <div className="absolute inset-16 rounded-full border border-champagne-gold/10" />
              <div className="absolute inset-24 rounded-full bg-gradient-to-br from-foreground/3 to-transparent" />

              {/* Logo in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <img
                    src="/sugandha_logo.svg"
                    alt="Sugandha"
                    className="h-24 w-auto sm:h-28 lg:h-32 opacity-90"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <span className="h-px w-8 bg-champagne-gold/40" />
                    <span className="font-serif text-xs italic tracking-[0.2em] text-muted-foreground">
                      Est. 2024
                    </span>
                    <span className="h-px w-8 bg-champagne-gold/40" />
                  </div>
                </div>
              </div>

              {/* Floating decorative dots */}
              <div className="absolute left-6 top-1/4 h-2 w-2 rounded-full bg-champagne-gold/30" />
              <div className="absolute right-10 top-1/3 h-1.5 w-1.5 rounded-full bg-champagne-gold/20" />
              <div className="absolute bottom-1/4 right-8 h-2 w-2 rounded-full bg-champagne-gold/25" />
              <div className="absolute bottom-1/3 left-10 h-1.5 w-1.5 rounded-full bg-champagne-gold/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    </section>
  );
}

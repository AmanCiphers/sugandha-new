"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";

export function TrendingProducts({ products = [] }) {
  if (!products.length) return null;

  const displayProducts = products.slice(0, 4);

  return (
    <section className="border-t border-border/40 bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trending Now"
          subtitle="What everyone is talking about this season"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              finalPrice={product.finalPrice || product.price}
              imageUrl={product.imageUrl || null}
              rating={product.rating || 0}
              reviewCount={product.reviewCount || 0}
              brand={product.brand}
              discountType={product.discountType}
              discountValue={product.discountValue}
              firstVariantId={product.firstVariantId}
              firstVariantSizeMl={product.firstVariantSizeMl}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop?filter=trending">
            <Button
              variant="outline"
              className="h-12 rounded-full border-foreground/20 px-8"
            >
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

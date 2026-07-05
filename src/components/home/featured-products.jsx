"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";

export function FeaturedProducts({ products = [] }) {
  if (!products.length) return null;

  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Collection"
          subtitle="Handpicked premium selections for the discerning customer"
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
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop?filter=featured">
            <Button
              variant="outline"
              className="h-12 rounded-full border-foreground/20 px-8"
            >
              View All Featured
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { ProductCard } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BestSellers({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Best Sellers"
          subtitle="Most loved fragrances by our customers"
        />
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto max-w-6xl"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ProductCard
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

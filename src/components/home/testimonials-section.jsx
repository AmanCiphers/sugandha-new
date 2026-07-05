"use client";

import { SectionHeader } from "@/components/shared/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <section className="border-t border-border/40 bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real stories from fragrance lovers"
        />
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto max-w-5xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full border-border/40 bg-card">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <Quote className="h-8 w-8 text-champagne-gold-dark/40" />
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs font-medium text-muted-foreground">
                          {testimonial.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {testimonial.customerName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

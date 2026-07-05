"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { STORE_NAME } from "@/constants";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        title={`About ${STORE_NAME}`}
        subtitle="Our passion for fragrance, crafted for you"
      />

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          {STORE_NAME} was born from a deep appreciation for the art of fine fragrance. 
          We believe that scent is one of the most powerful ways to express individuality 
          and create lasting memories.
        </p>
        <p>
          Our journey began with a simple mission: to bring the finest fragrances from 
          around the world to fragrance enthusiasts in India. From traditional attars 
          that have been cherished for centuries to modern perfumes that define 
          contemporary elegance, every product in our collection is carefully curated 
          for quality and authenticity.
        </p>
        <p>
          We work directly with trusted fragrance houses and skilled artisans to ensure 
          that every bottle that reaches you is of the highest quality. Our Attars are 
          sourced from the perfumers of Kannauj, the perfume capital of India, while 
          our international fragrances are imported from renowned houses across the globe.
        </p>
        <p>
          At {STORE_NAME}, we are committed to providing not just products, but 
          experiences. Whether you are discovering your signature scent or looking 
          for the perfect gift, we are here to help you find something truly special.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {[
          { number: "500+", label: "Fragrances" },
          { number: "10k+", label: "Happy Customers" },
          { number: "50+", label: "Cities Served" },
        ].map((stat) => (
          <div key={stat.label} className="text-center rounded-lg border border-border/40 p-8">
            <p className="font-serif text-4xl font-bold text-champagne-gold-dark">{stat.number}</p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

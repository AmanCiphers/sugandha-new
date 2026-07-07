"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { SORT_OPTIONS } from "@/constants";

export default function CategoryContent({ products, category }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price_asc": return a.finalPrice - b.finalPrice;
          case "price_desc": return b.finalPrice - a.finalPrice;
          case "rating": return b.rating - a.rating;
          default: return 0;
        }
      });
  }, [products, searchQuery, sortBy]);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative flex h-[240px] items-end sm:h-[320px]">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/20 to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-foreground focus:outline-none focus:ring-0"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 cursor-pointer rounded-full border border-border bg-background px-4 text-sm focus:border-foreground focus:outline-none focus:ring-0"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

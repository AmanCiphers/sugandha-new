"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { SORT_OPTIONS } from "@/constants";

export default function ShopContent({ initialProducts, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        if (selectedCategory !== "All" && p.category?.slug !== selectedCategory) {
          return false;
        }
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
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
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Shop All
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore our complete collection of premium fragrances
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-foreground focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-full border border-border bg-background px-4 text-sm focus:border-foreground focus:outline-none focus:ring-0"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className={`mt-4 flex flex-wrap gap-2 ${showFilters ? "block" : "hidden"} lg:flex`}>
        <button
          onClick={() => setSelectedCategory("All")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            selectedCategory === "All"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat.slug
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
        {selectedCategory !== "All" && (
          <button
            onClick={() => setSelectedCategory("All")}
            className="flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Clear
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">No products found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

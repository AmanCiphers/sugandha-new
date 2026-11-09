"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ExternalLink, Star, Package, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";
import { toast } from "sonner";

export function ChatProductCard({ product, onAddToCart, compact = false }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (variantSize) => {
    if (adding) return;
    setAdding(true);
    try {
      await onAddToCart(product, variantSize);
    } finally {
      setAdding(false);
    }
  };

  const bestVariant = product.variants?.[1] || product.variants?.[0];
  const entryVariant = product.variants?.[0];
  const categoryIcon = product.category === "Car Perfumes" ? "🚗" : "🌿";
  const intensity = product.intensity || "moderate";
  const intensityColor = intensity === "strong" ? "text-red-500" : intensity === "moderate" ? "text-amber-500" : "text-green-500";
  const intensityLabel = intensity.charAt(0).toUpperCase() + intensity.slice(1);

  if (compact) {
    return (
      <Card className="group hover:shadow-lg hover:border-foreground/20 transition-all duration-200 border-border/40" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Link href={product.productUrl} className="flex-shrink-0">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.productName} className="h-14 w-14 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-champagne-gold/20 to-beige flex items-center justify-center">
                  <span className="text-lg">{categoryIcon}</span>
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={product.productUrl} className="font-medium text-sm text-foreground hover:underline truncate block">
                {product.productName}
              </Link>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="px-1.5 py-0.5 rounded bg-muted">{categoryIcon} {product.category}</span>
                <span className={`${intensityColor} px-1.5 py-0.5 rounded bg-muted/50`}><Star className="h-2.5 w-2.5 mr-0.5" /> {intensityLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.reason || "Great match for your preferences!"}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {bestVariant && (
                    <span className="text-sm font-bold text-foreground">
                      {bestVariant.size_ml}ml @ ₹{bestVariant.price}
                    </span>
                  )}
                  {entryVariant && bestVariant && entryVariant.size_ml !== bestVariant.size_ml && (
                    <span className="text-xs text-muted-foreground line-through">({entryVariant.size_ml}ml @ ₹{entryVariant.price})</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-[10px] gap-1"
                    onClick={() => handleAdd(bestVariant ? `${bestVariant.size_ml}ml` : undefined)}
                    disabled={adding}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    {adding ? "Adding..." : "Add"}
                  </Button>
                  <Link href={product.productUrl} className="h-7 w-7 p-1 rounded-lg border border-border/40 hover:bg-muted transition-colors" aria-label="View details">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl hover:border-foreground/20 transition-all duration-300 border-border/40 overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative h-24 sm:h-28 bg-gradient-to-br from-champagne-gold/10 to-rose-gold/10">
        <Link href={product.productUrl} className="absolute inset-0">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.productName} 
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-4xl opacity-50">{categoryIcon}</span>
            </div>
          )}
        </Link>
        <div className="absolute top-2 right-2 flex gap-1">
          <Link 
            href={product.productUrl} 
            className="p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm transition-colors"
            aria-label="View product"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
        {product.category === "Car Perfumes" && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-background/90 backdrop-blur-sm text-[10px] font-medium text-muted-foreground">
            🚗 Car Perfume
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={product.productUrl} className="font-semibold text-sm text-foreground hover:underline block truncate">
              {product.productName}
            </Link>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-foreground">
                {categoryIcon} {product.category}
              </span>
              <span className={`${intensityColor} px-2 py-0.5 rounded-full text-xs font-medium bg-muted/50 flex items-center gap-1`}>
                <Star className="h-3 w-3" />
                {intensityLabel}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground flex items-center gap-1">
                <Package className="h-2.5 w-2.5" />
                {product.pricingType === "per_ml" ? "Per ML" : "Flat Price"}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {product.reason || product.description || "A great choice for your fragrance collection!"}
        </p>

        {product.notes && (
          <div className="pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <span className="font-medium text-foreground">Notes:</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {product.notes.split(",").slice(0, 5).map((note, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground border border-border/40">
                  {note.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-3">
            {bestVariant && (
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">
                  {bestVariant.size_ml}ml @ ₹{bestVariant.price}
                </span>
                {entryVariant && bestVariant.size_ml !== entryVariant.size_ml && (
                  <span className="block text-xs text-muted-foreground line-through">
                    {entryVariant.size_ml}ml @ ₹{entryVariant.price}
                  </span>
                )}
              </div>
            )}
            <div className="flex-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {product.longevity} lasting</span>
              <span className="flex items-center gap-1"><Truck className="h-2.5 w-2.5" /> Free ship ₹499+</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-9 px-4 gap-1.5"
              onClick={() => handleAdd(bestVariant ? `${bestVariant.size_ml}ml` : undefined)}
              disabled={adding}
            >
              <ShoppingCart className="h-4 w-4" />
              {adding ? "Adding..." : "Add to Cart"}
            </Button>
            <Link 
              href={product.productUrl} 
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-border/40 hover:bg-muted hover:border-foreground/30 transition-all"
              aria-label="View details"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
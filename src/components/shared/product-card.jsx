"use client";

import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";

export function ProductCard({
  id,
  name,
  slug,
  price,
  finalPrice,
  imageUrl,
  rating,
  reviewCount,
  brand,
  isNew,
  discountType,
  discountValue,
  stockStatus,
  firstVariantId,
  firstVariantSizeMl,
  className,
}) {
  const { addItem } = useCart();
  const hasDiscount = finalPrice < price;
  const outOfStock = stockStatus === "out_of_stock";
  const noVariant = !firstVariantId;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-black/5",
        className
      )}
    >
      <Link href={`/product/${slug}`} className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-champagne-gold/20 to-beige">
            <span className="font-serif text-4xl text-muted-foreground/30">
              S
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {hasDiscount && discountType === "percentage" && (
            <Badge className="bg-rose-gold/90 text-deep-charcoal border-0 text-[10px] font-medium">
              -{discountValue}%
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-foreground text-background border-0 text-[10px] font-medium">
              New
            </Badge>
          )}
          {outOfStock && (
            <Badge variant="secondary" className="border-0 text-[10px] font-medium">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
          <Button
            className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
            size="sm"
            disabled={outOfStock || noVariant}
            onClick={(e) => {
              e.preventDefault();
              if (noVariant) return;
              addItem(id, 1, {
                price: finalPrice,
                productName: name,
                variantId: firstVariantId,
                sizeMl: firstVariantSizeMl,
              });
            }}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {noVariant ? "Unavailable" : outOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {brand && (
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {brand}
          </p>
        )}
        <Link href={`/product/${slug}`}>
          <h3 className="mt-1 text-sm font-medium leading-tight text-foreground transition-colors hover:text-muted-foreground">
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs text-muted-foreground">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

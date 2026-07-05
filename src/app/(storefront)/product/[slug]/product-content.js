"use client";

import { useState } from "react";
import { Star, ShoppingBag, Heart, Share2, Minus, Plus, Truck, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shared/product-card";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";

const STOCK_STATUS_LABELS = {
  in_stock: { label: "In Stock", color: "text-green-600" },
  low_stock: { label: "Low Stock", color: "text-orange-500" },
  out_of_stock: { label: "Out of Stock", color: "text-red-500" },
};

export default function ProductContent({ product, relatedProducts }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const activeVariants = product.variants?.filter(v => v.is_active !== false) || [];
  const [selectedVariantId, setSelectedVariantId] = useState(
    activeVariants.find(v => v.stock > 0)?.id || activeVariants[0]?.id
  );

  const selectedVariant = activeVariants.find(v => v.id === selectedVariantId);
  const hasDiscount = product.discountType && product.discountValue > 0;
  const variantOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : true;
  const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= selectedVariant.low_stock_threshold;

  let displayPrice = selectedVariant?.price || product.price;
  let displayFinalPrice = displayPrice;
  if (hasDiscount) {
    if (product.discountType === "percentage") {
      displayFinalPrice = displayPrice - (displayPrice * product.discountValue / 100);
    } else {
      displayFinalPrice = displayPrice - product.discountValue;
    }
  }

  const highlights = [
    product.pricingType === "per_ml" ? "Pure attar oil" : "Premium quality",
    "Long-lasting fragrance",
    "Handcrafted in India",
    product.pricingType === "per_ml" ? "Concentrated formula" : "Ready to use",
    "Cruelty-free",
  ];

  const specifications = {
    "Type": product.category?.name || "Fragrance",
    "Pricing": product.pricingType === "per_ml" ? "Per ML" : "Per Unit",
    "Variants": `${activeVariants.length} size${activeVariants.length > 1 ? "s" : ""} available`,
    ...(selectedVariant ? { "Size": `${selectedVariant.size_ml}ml` } : {}),
  };

  const handleAddToCart = () => {
    if (!selectedVariant || variantOutOfStock) return;
    addItem(product.id, quantity, {
      variantId: selectedVariant.id,
      sizeMl: selectedVariant.size_ml,
      price: Math.round(displayFinalPrice),
      productName: product.name,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-champagne-gold/20 to-beige">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-8xl text-muted-foreground/20">S</span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-rose-gold/90 text-deep-charcoal border-0">
                -{product.discountType === "percentage" ? product.discountValue + "%" : formatPrice(product.discountValue)}
              </Badge>
            )}
            {variantOutOfStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </p>
            {product.sku && (
              <p className="mt-1 font-mono text-xs text-muted-foreground">SKU: {product.sku}</p>
            )}
            <h1 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(Math.round(displayFinalPrice))}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(displayPrice)}
              </span>
            )}
          </div>

          {isLowStock && (
            <p className="text-xs text-orange-500">Only {selectedVariant.stock} left in stock</p>
          )}

          <Separator />

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {activeVariants.length > 1 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const isOut = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVariantId(v.id); setQuantity(1); }}
                      disabled={isOut}
                      className={`relative rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : isOut
                          ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                          : "border-border/40 text-foreground hover:border-foreground"
                      }`}
                    >
                      <span>{v.size_ml}ml</span>
                      {isOut && (
                        <span className="block text-[10px] opacity-60">Out of stock</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-l-full transition-colors hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-r-full transition-colors hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              className="flex-1 rounded-full h-12 bg-foreground text-background hover:bg-foreground/90"
              disabled={variantOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {variantOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>

            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg border border-border/40 bg-muted/30 p-4">
            <div className="text-center">
              <Truck className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-xs text-muted-foreground">Free Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-xs text-muted-foreground">Secure Payment</p>
            </div>
            <div className="text-center">
              <RefreshCw className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-xs text-muted-foreground">7-Day Returns</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-8 border-b border-border">
          {["description", "specifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "description" && (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === "specifications" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
            You May Also Like
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

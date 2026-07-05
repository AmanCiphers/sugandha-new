"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";

const mockProducts = {
  "1": { id: "1", name: "Royal Oud Attar", price: 2499, imageUrl: null, slug: "royal-oud-attar" },
  "2": { id: "2", name: "Musk Al Tahara", price: 1999, imageUrl: null, slug: "musk-al-tahara" },
  "3": { id: "3", name: "Car Freshner - Ocean Breeze", price: 399, imageUrl: null, slug: "car-freshner-ocean-breeze" },
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, itemCount } = useCart();

  const cartItems = items.map((item) => {
    const product = mockProducts[item.productId];
    return { ...item, product };
  }).filter((item) => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 499 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Shopping Cart ({itemCount})
        </h1>
        <Link href="/shop">
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-border/40 p-4">
              <Link href={`/product/${item.product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-champagne-gold/20 to-beige flex items-center justify-center">
                <span className="font-serif text-2xl text-muted-foreground/30">S</span>
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-l-full transition-colors hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex h-8 w-10 items-center justify-center text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-r-full transition-colors hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border/40 p-6">
            <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="mt-6 w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-12">
                Proceed to Checkout
              </Button>
            </Link>
            {shipping > 0 && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Add items worth {formatPrice(499 - subtotal)} for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";

const mockProducts = {
  "1": { id: "1", name: "Royal Oud Attar", price: 2499, imageUrl: null, slug: "royal-oud-attar" },
  "2": { id: "2", name: "Musk Al Tahara", price: 1999, imageUrl: null, slug: "musk-al-tahara" },
  "3": { id: "3", name: "Car Freshner - Ocean Breeze", price: 399, imageUrl: null, slug: "car-freshner-ocean-breeze" },
};

export default function CheckoutPage() {
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = items.map((item) => {
    const product = mockProducts[item.productId];
    return { ...item, product };
  }).filter((item) => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 499 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock checkout - replace with actual backend later
    await new Promise((r) => setTimeout(r, 1500));
    alert("Order placed successfully! (Demo)");
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <div className="grid gap-12 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Shipping Information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
                <Input required placeholder="John Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <Input required type="email" placeholder="john@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
                <Input required type="tel" placeholder="+91 98765 43210" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
                <Input required placeholder="123 Main Street" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">City</label>
                <Input required placeholder="Mumbai" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">State</label>
                <Input required placeholder="Maharashtra" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Pincode</label>
                <Input required placeholder="400001" />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Payment Method</h2>
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 cursor-pointer hover:border-foreground/30 transition-colors">
                <input type="radio" name="payment" defaultChecked className="accent-foreground" />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 cursor-pointer hover:border-foreground/30 transition-colors">
                <input type="radio" name="payment" className="accent-foreground" />
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">UPI / Card (Coming Soon)</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full h-12 bg-foreground text-background hover:bg-foreground/90"
            disabled={isSubmitting || cartItems.length === 0}
          >
            {isSubmitting ? "Processing..." : `Place Order - ${formatPrice(total)}`}
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border/40 p-6 sticky top-28">
            <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            <div className="mt-4 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                  <span className="text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

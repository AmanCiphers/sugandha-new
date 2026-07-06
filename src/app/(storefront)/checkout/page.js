"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";
import { useAuth } from "@/features/auth/context/auth-context";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shipping, setShipping] = useState({
    full_name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharge = subtotal >= 499 ? 0 : 99;
  const total = subtotal + shippingCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }

    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            productName: i.productName,
            sizeMl: i.sizeMl,
            quantity: i.quantity,
            price: i.price,
          })),
          shipping,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/account/orders/${data.order.order_number}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
                <Input required placeholder="John Doe" value={shipping.full_name} onChange={(e) => updateField("full_name", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <Input required type="email" placeholder="john@example.com" value={shipping.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
                <Input required type="tel" placeholder="+91 98765 43210" value={shipping.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
                <Input required placeholder="123 Main Street" value={shipping.line1} onChange={(e) => updateField("line1", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Address Line 2 (Optional)</label>
                <Input placeholder="Apartment, suite, etc." value={shipping.line2} onChange={(e) => updateField("line2", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">City</label>
                <Input required placeholder="Mumbai" value={shipping.city} onChange={(e) => updateField("city", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">State</label>
                <Input required placeholder="Maharashtra" value={shipping.state} onChange={(e) => updateField("state", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Pincode</label>
                <Input required placeholder="400001" value={shipping.pincode} onChange={(e) => updateField("pincode", e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Payment Method</h2>
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 cursor-pointer hover:border-foreground/30 transition-colors">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-foreground" />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" value="online" disabled className="accent-foreground" />
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">UPI / Card (Coming Soon)</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full h-12 bg-foreground text-background hover:bg-foreground/90"
            disabled={isSubmitting || items.length === 0}
          >
            {isSubmitting ? "Processing..." : `Place Order - ${formatPrice(total)}`}
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border/40 p-6 sticky top-28">
            <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.productName}{item.sizeMl ? ` (${item.sizeMl}ml)` : ""} x{item.quantity}
                  </span>
                  <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{shippingCharge === 0 ? "Free" : formatPrice(shippingCharge)}</span>
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

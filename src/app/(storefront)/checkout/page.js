"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, Truck, Tag, Loader2 } from "lucide-react";
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
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharge = subtotal >= 499 ? 0 : 99;
  const discountAmount = coupon?.discount || 0;
  const total = subtotal + shippingCharge - discountAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || validatingCoupon) return;

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error(data.error || "Invalid coupon");
      }

      setCoupon(data.coupon);
      toast.success(`Coupon applied: ${data.coupon.code}`);
    } catch (err) {
      setCouponError(err.message);
      setCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

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
          couponId: coupon?.id || null,
          discountAmount,
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

          <Separator />

          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Coupon Code</h2>
            <div className="mt-4">
              {coupon ? (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{coupon.code}</p>
                      <p className="text-sm text-green-600">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% off`
                          : `${formatPrice(coupon.discount_value)} off`}
                        <span className="text-green-700 font-semibold ml-2">−{formatPrice(coupon.discount)}</span>
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                    Remove
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="pl-10"
                      disabled={validatingCoupon}
                    />
                  </div>
                  <Button type="submit" className="rounded-full h-10" disabled={validatingCoupon || !couponCode.trim()}>
                    {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </form>
              )}
              {couponError && <p className="mt-2 text-sm text-red-500">{couponError}</p>}
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
              {discountAmount > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({coupon?.code})</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                </>
              )}
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
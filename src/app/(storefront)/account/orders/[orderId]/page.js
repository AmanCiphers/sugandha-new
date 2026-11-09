import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";
import { createClient } from "@/lib/supabase/server";
import { getOrderByOrderNumber } from "@/lib/queries";

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?redirect=/account/orders/${orderId}`);

  const order = await getOrderByOrderNumber(orderId);
  if (!order) notFound();

  const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status);
  const address = order.shipping_address;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Order {order.order_number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.placed_at)}</p>
        </div>
        {statusInfo && (
          <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Items</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-border/40 p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-champagne-gold/20 to-beige flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">{item.variant_size}ml &times; Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatPrice(item.total_price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border/40 p-6">
            <h3 className="text-sm font-semibold text-foreground">Order Summary</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{order.shipping_charge === 0 ? "Free" : formatPrice(order.shipping_charge)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {address && (
            <div className="rounded-lg border border-border/40 p-6">
              <h3 className="text-sm font-semibold text-foreground">Shipping Address</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>{address.full_name}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p className="mt-1">{address.phone}</p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border/40 p-6">
            <h3 className="text-sm font-semibold text-foreground">Payment Method</h3>
            <p className="mt-2 text-sm text-muted-foreground capitalize">
              {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

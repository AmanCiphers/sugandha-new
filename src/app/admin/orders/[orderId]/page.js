import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";
import { getAdminOrderById } from "@/lib/admin-queries";

export default async function AdminOrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = await getAdminOrderById(orderId);
  if (!order) notFound();

  const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status);
  const address = order.shipping_address;
  const profile = order.profile;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.placed_at)}</p>
        </div>
        {statusInfo && (
          <Badge className={`${statusInfo.color} border-0 ml-auto`}>{statusInfo.label}</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-champagne-gold/20 to-beige flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variant_size}ml &times; Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.total_price)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping_charge === 0 ? "Free" : formatPrice(order.shipping_charge)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{profile.full_name || "Unknown"}</p>
                <p className="text-muted-foreground">{profile.email}</p>
              </CardContent>
            </Card>
          )}

          {address && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>{address.full_name}</p>
                  <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p className="mt-1">{address.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground capitalize">
                {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

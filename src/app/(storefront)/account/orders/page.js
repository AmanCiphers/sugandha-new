import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";
import { createClient } from "@/lib/supabase/server";
import { getOrdersByUserId } from "@/lib/queries";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/account/orders");

  const orders = await getOrdersByUserId(user.id);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Package className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">No Orders Yet</h1>
        <p className="mt-2 text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const getStatusInfo = (status) => ORDER_STATUSES.find((s) => s.value === status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <Link
              key={order.id}
              href={`/account/orders/${order.order_number}`}
              className="block rounded-lg border border-border/40 p-6 transition-all hover:shadow-lg hover:shadow-black/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.order_number}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.placed_at)}</p>
                </div>
                {statusInfo && (
                  <Badge className={`${statusInfo.color} border-0`}>
                    {statusInfo.label}
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                </p>
                <p className="text-sm font-semibold text-foreground">{formatPrice(order.total_amount)}</p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <span>View Details</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

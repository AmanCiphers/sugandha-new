import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { getAdminUserById } from "@/lib/admin-queries";

export default async function AdminUserDetailPage({ params }) {
  const { userId } = await params;
  const user = await getAdminUserById(userId);
  if (!user) notFound();

  const address = user.addresses?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{user.full_name || "Unknown"}</h1>
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="border-0 ml-auto">
          {user.role}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {user.orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{o.order_number}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.placed_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={o.status === "delivered" ? "default" : "secondary"} className="border-0 text-[10px]">
                          {o.status.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-sm font-semibold">{formatPrice(o.total_amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              {address?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{address.phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    {address.line1}, {address.city}, {address.state} {address.pincode}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined {formatDate(user.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-medium">{user.totalOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-medium">{formatPrice(user.totalSpent)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { ORDER_STATUSES } from "@/constants";
import { getAdminDashboard } from "@/lib/admin-queries";

function StatusBadge({ status }) {
  const styles = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  const kpis = [
    { title: "Total Revenue", value: formatPrice(data.totalRevenue), icon: IndianRupee },
    { title: "Total Orders", value: data.totalOrders, icon: ShoppingCart },
    { title: "Total Customers", value: data.totalCustomers, icon: Users },
    { title: "Avg Order Value", value: formatPrice(data.avgOrderValue), icon: TrendingUp },
    { title: "Pending Orders", value: data.pendingOrders, icon: Clock },
    { title: "Low Stock Items", value: data.lowStockItems, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{o.customer_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="text-sm font-semibold">{formatPrice(o.total_amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";

export default function OrderList({ orders }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const statusFilters = ["all", ...ORDER_STATUSES.map((s) => s.value)];

  const filtered = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-transparent pl-10 pr-4 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          {statusFilters.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Status" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left font-medium text-muted-foreground p-4">Order</th>
                  <th className="text-left font-medium text-muted-foreground p-4">Customer</th>
                  <th className="text-left font-medium text-muted-foreground p-4">Date</th>
                  <th className="text-center font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Total</th>
                  <th className="text-right font-medium text-muted-foreground p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const statusInfo = ORDER_STATUSES.find((s) => s.value === o.status);
                  return (
                    <tr key={o.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{o.order_number}</td>
                      <td className="p-4 text-muted-foreground">{o.customerName}</td>
                      <td className="p-4 text-muted-foreground">{formatDate(o.placed_at)}</td>
                      <td className="p-4 text-center">
                        {statusInfo && (
                          <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>
                        )}
                      </td>
                      <td className="p-4 text-right font-medium">{formatPrice(o.total_amount)}</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/orders/${o.id}`}>
                          <Button variant="ghost" size="icon-sm"><ChevronRight className="h-4 w-4" /></Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

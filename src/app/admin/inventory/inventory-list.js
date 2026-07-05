"use client";

import { useState } from "react";
import { Search, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const statusIcons = {
  in_stock: CheckCircle,
  low_stock: AlertTriangle,
  out_of_stock: AlertTriangle,
};

const statusColors = {
  in_stock: "text-green-600",
  low_stock: "text-orange-500",
  out_of_stock: "text-red-500",
};

export default function InventoryList({ items }) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((i) =>
    i.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>

      <CardHeader className="px-0 pt-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-transparent pl-10 pr-4 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
          />
        </div>
      </CardHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left font-medium text-muted-foreground p-4">Product</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Size (ml)</th>
                  <th className="text-right font-medium text-muted-foreground p-4">In Stock</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Low Stock At</th>
                  <th className="text-center font-medium text-muted-foreground p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const Icon = statusIcons[item.status];
                  return (
                    <tr key={item.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{item.productName}</td>
                      <td className="p-4 text-right">{item.sizeMl}</td>
                      <td className="p-4 text-right font-medium">{item.stock}</td>
                      <td className="p-4 text-right">{item.lowStockThreshold}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Icon className={`h-4 w-4 ${statusColors[item.status]}`} />
                          <span className={`text-xs capitalize ${statusColors[item.status]}`}>
                            {item.status.replace(/_/g, " ")}
                          </span>
                        </div>
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

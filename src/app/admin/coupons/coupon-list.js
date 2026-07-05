"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default function CouponList({ coupons }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button className="rounded-full" onClick={() => alert("Add coupon form coming soon")}>
          <Plus className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left font-medium text-muted-foreground p-4">Code</th>
                  <th className="text-left font-medium text-muted-foreground p-4">Discount</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Min Order</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Used</th>
                  <th className="text-center font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-mono text-sm font-medium">{c.code}</td>
                    <td className="p-4">
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : formatPrice(c.discount_value)}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {c.min_order_amount ? formatPrice(c.min_order_amount) : "—"}
                    </td>
                    <td className="p-4 text-right">{c.used_count}/{c.usage_limit || "∞"}</td>
                    <td className="p-4 text-center">
                      <Badge variant={c.is_active ? "default" : "secondary"} className="border-0">
                        {c.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon-sm"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon-sm" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ProductList({ products }) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Product deleted");
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full max-w-sm rounded-lg border border-input bg-transparent pl-10 pr-4 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left font-medium text-muted-foreground pb-3">Product</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">SKU</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Category</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Price</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Stock</th>
                  <th className="text-center font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{p.sku || "—"}</td>
                    <td className="py-3 text-muted-foreground">{p.categoryName}</td>
                    <td className="py-3 text-right">{formatPrice(p.primaryPrice)}</td>
                    <td className="py-3 text-right">
                      <span className={p.totalStock <= 5 ? "text-orange-500" : "text-foreground"}>
                        {p.totalStock}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={p.is_active ? "default" : "secondary"} className="border-0">
                        {p.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${p.id}/edit`}>
                          <Button variant="ghost" size="icon-sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog open={deletingId === p.id} onOpenChange={(open) => setDeletingId(open ? p.id : null)}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{p.name}"? This action cannot be undone.
                                Products with existing orders cannot be deleted — deactivate them instead.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
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
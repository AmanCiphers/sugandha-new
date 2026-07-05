"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryList({ categories }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="rounded-full" onClick={() => alert("Add category form coming soon")}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left font-medium text-muted-foreground p-4">Name</th>
                  <th className="text-left font-medium text-muted-foreground p-4">Slug</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Products</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-muted-foreground">/{cat.slug}</td>
                    <td className="p-4 text-right">{cat.productCount}</td>
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

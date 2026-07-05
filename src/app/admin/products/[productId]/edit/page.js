"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    alert("Product updated! (Demo)");
    setSaving(false);
    router.push("/admin/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product #{params.productId}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Product Name</label>
                <Input required defaultValue="Royal Oud Attar" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price (₹)</label>
                <Input required type="number" defaultValue="2499" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus:border-ring focus:outline-none" defaultValue="Attars">
                  <option>Attars</option>
                  <option>Perfumes</option>
                  <option>Car Perfumes</option>
                  <option>Incense</option>
                  <option>Gift Sets</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  rows={4}
                  defaultValue="Experience the timeless elegance..."
                  className="h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 resize-y"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="rounded-full">
                {saving ? "Saving..." : "Update Product"}
              </Button>
              <Link href="/admin/products">
                <Button variant="outline" type="button" className="rounded-full">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

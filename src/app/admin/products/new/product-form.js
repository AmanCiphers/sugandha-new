"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const emptyVariant = { size_ml: "", price: "", stock: "", low_stock_threshold: "5" };

export default function ProductForm({ categories }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [pricingType, setPricingType] = useState("per_ml");
  const [variants, setVariants] = useState([{ ...emptyVariant }]);

  const addVariant = () => setVariants([...variants, { ...emptyVariant }]);
  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };
  const updateVariant = (index, field, value) => {
    setVariants(variants.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const productData = {
      name: form.name.value,
      slug: form.slug.value,
      sku: form.sku.value || null,
      brand: form.brand.value,
      short_description: form.description.value,
      category_id: form.category.value,
      pricing_type: pricingType,
      base_price: pricingType === "per_unit" ? Number(form.basePrice.value) : 0,
      variants: variants.filter(v => v.size_ml && v.price).map(v => ({
        size_ml: Number(v.size_ml),
        price: Number(v.price),
        stock: Number(v.stock) || 0,
        low_stock_threshold: Number(v.low_stock_threshold) || 5,
      })),
    };
    setSaving(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      toast.success(`Product created with SKU: ${data.product.sku}`);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Product Name</label>
                <Input required name="name" placeholder="Enter product name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Slug</label>
                <Input required name="slug" placeholder="product-name-slug" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  SKU <span className="text-xs text-muted-foreground">(leave blank for auto)</span>
                </label>
                <Input name="sku" placeholder="Auto-generated (e.g. A-001)" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Brand</label>
                <Input name="brand" placeholder="Sugandha" defaultValue="Sugandha" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Pricing Type</label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus:border-ring focus:outline-none"
                >
                  <option value="per_ml">Per ML</option>
                  <option value="per_unit">Per Unit (flat)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  name="category"
                  required
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus:border-ring focus:outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {pricingType === "per_unit" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Base Price (₹)</label>
                  <Input required name="basePrice" type="number" placeholder="499" />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Product description..."
                  className="h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 resize-y"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="rounded-full">
                <Plus className="mr-1 h-3 w-3" /> Add Size
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="flex items-end gap-3 rounded-lg border border-border/40 p-4">
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Size (ml)</label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="3"
                      value={v.size_ml}
                      onChange={(e) => updateVariant(i, "size_ml", e.target.value)}
                    />
                  </div>
                  <div className="w-28">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Price (₹)</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      placeholder={pricingType === "per_ml" ? "150" : "499"}
                      value={v.price}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Stock</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      placeholder="50"
                      value={v.stock}
                      onChange={(e) => updateVariant(i, "stock", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Low Stock At</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="5"
                      value={v.low_stock_threshold}
                      onChange={(e) => updateVariant(i, "low_stock_threshold", e.target.value)}
                    />
                  </div>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mb-0.5 text-red-500"
                      onClick={() => removeVariant(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="rounded-full">
            {saving ? "Saving..." : "Save Product"}
          </Button>
          <Link href="/admin/products">
            <Button variant="outline" type="button" className="rounded-full">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

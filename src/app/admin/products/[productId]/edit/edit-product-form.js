"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function EditProductForm({ product, categories }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(product.name || "");
  const [slug, setSlug] = useState(product.slug || "");
  const [brand, setBrand] = useState(product.brand || "");
  const [shortDescription, setShortDescription] = useState(product.short_description || "");
  const [fullDescription, setFullDescription] = useState(product.full_description || "");
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [pricingType, setPricingType] = useState(product.pricing_type || "per_ml");
  const [basePrice, setBasePrice] = useState(String(product.base_price || ""));

  const [isActive, setIsActive] = useState(product.is_active !== false);
  const [isFeatured, setIsFeatured] = useState(product.is_featured || false);
  const [isBestSeller, setIsBestSeller] = useState(product.is_best_seller || false);
  const [isTrending, setIsTrending] = useState(product.is_trending || false);
  const [isNew, setIsNew] = useState(product.is_new || false);

  const [variants, setVariants] = useState(
    (product.variants || []).map((v) => ({
      ...v,
      size_ml: String(v.size_ml),
      price: String(v.price),
      stock: String(v.stock),
      low_stock_threshold: String(v.low_stock_threshold || 5),
    }))
  );

  const [images, setImages] = useState(
    (product.images || []).map((img) => ({
      ...img,
      url: img.url || "",
      alt_text: img.alt_text || "",
    }))
  );

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: `new-${Date.now()}`, size_ml: "", price: "", stock: "0", low_stock_threshold: "5", is_active: true },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addImage = () => {
    setImages([...images, { id: `new-${Date.now()}`, url: "", alt_text: "" }]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const processedVariants = variants.map((v) => ({
      ...v,
      size_ml: parseFloat(v.size_ml),
      price: parseFloat(v.price),
      stock: parseInt(v.stock, 10),
      low_stock_threshold: parseInt(v.low_stock_threshold || "5", 10),
    }));

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          brand: brand || null,
          short_description: shortDescription || null,
          full_description: fullDescription || null,
          category_id: categoryId || null,
          pricing_type: pricingType,
          base_price: parseFloat(basePrice),
          is_active: isActive,
          is_featured: isFeatured,
          is_best_seller: isBestSeller,
          is_trending: isTrending,
          is_new: isNew,
          variants: processedVariants,
          images: images.map((img) => ({
            url: img.url,
            alt_text: img.alt_text || null,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success("Product saved");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
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
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Badge variant="outline" className="ml-auto font-mono text-xs">{product.sku}</Badge>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Product Name *</label>
                  <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Royal Oud Attar" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Slug</label>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated if empty" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Brand</label>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Sugandha" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus:border-ring focus:outline-none"
                  >
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.productCount} products)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Short Description</label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief product summary (shown on cards)"
                    className="h-16 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 resize-y"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Full Description</label>
                  <textarea
                    rows={5}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Detailed product description"
                    className="h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50 resize-y"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Pricing Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="pricing_type"
                        value="per_ml"
                        checked={pricingType === "per_ml"}
                        onChange={() => setPricingType("per_ml")}
                        className="accent-foreground"
                      />
                      Per ML (attars — price × size)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="pricing_type"
                        value="per_unit"
                        checked={pricingType === "per_unit"}
                        onChange={() => setPricingType("per_unit")}
                        className="accent-foreground"
                      />
                      Per Unit (car perfumes — flat)
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Base Price {pricingType === "per_ml" ? "(₹ per ml)" : "(₹)"} *
                  </label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    className="max-w-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Variants (Sizes)</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariant} className="rounded-full">
                  <Plus className="mr-1 h-3 w-3" /> Add Variant
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {variants.length === 0 && (
                  <p className="text-sm text-muted-foreground">No variants. Add at least one.</p>
                )}
                {variants.map((v, i) => (
                  <div key={v.id} className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 p-3">
                    <div className="flex-1 min-w-[80px]">
                      <label className="mb-1 block text-xs text-muted-foreground">Size (ml)</label>
                      <Input
                        required
                        type="number"
                        step="0.1"
                        min="0"
                        value={v.size_ml}
                        onChange={(e) => updateVariant(i, "size_ml", e.target.value)}
                        placeholder="3"
                      />
                    </div>
                    <div className="flex-1 min-w-[80px]">
                      <label className="mb-1 block text-xs text-muted-foreground">Price (₹)</label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={v.price}
                        onChange={(e) => updateVariant(i, "price", e.target.value)}
                        placeholder="165"
                      />
                    </div>
                    <div className="w-[70px]">
                      <label className="mb-1 block text-xs text-muted-foreground">Stock</label>
                      <Input
                        required
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => updateVariant(i, "stock", e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div className="w-[70px]">
                      <label className="mb-1 block text-xs text-muted-foreground">Low Stock</label>
                      <Input
                        type="number"
                        min="0"
                        value={v.low_stock_threshold}
                        onChange={(e) => updateVariant(i, "low_stock_threshold", e.target.value)}
                        placeholder="5"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={v.is_active !== false}
                        onChange={(e) => updateVariant(i, "is_active", e.target.checked)}
                        className="accent-foreground"
                      />
                      Active
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeVariant(i)}
                      className="text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Images</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addImage} className="rounded-full">
                  <Plus className="mr-1 h-3 w-3" /> Add Image
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {images.length === 0 && (
                  <p className="text-sm text-muted-foreground">No images. The first image will be used as primary.</p>
                )}
                {images.map((img, i) => (
                  <div key={img.id} className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 p-3">
                    <div className="flex-1 min-w-[200px]">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Image URL {i === 0 ? "(Primary)" : ""}
                      </label>
                      <Input
                        required
                        value={img.url}
                        onChange={(e) => updateImage(i, "url", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="mb-1 block text-xs text-muted-foreground">Alt Text</label>
                      <Input
                        value={img.alt_text}
                        onChange={(e) => updateImage(i, "alt_text", e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeImage(i)}
                      className="text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Status & Flags */}
            <Card>
              <CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-foreground"
                  />
                  Active (visible on storefront)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-foreground"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-foreground"
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="accent-foreground"
                  />
                  Trending
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-foreground"
                  />
                  New
                </label>
              </CardContent>
            </Card>

            {/* Save */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full h-11"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin/products" className="block">
                  <Button variant="outline" type="button" className="w-full rounded-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

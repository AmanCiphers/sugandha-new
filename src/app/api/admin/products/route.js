import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminSupabase = createAdminClient();
  const body = await request.json();

  const { name, slug, sku, brand, short_description, category_id, pricing_type, base_price, variants } = body;

  if (!name || !slug || !category_id) {
    return NextResponse.json({ error: "name, slug, and category_id are required" }, { status: 400 });
  }

  const { data: product, error: productError } = await adminSupabase
    .from("products")
    .insert({
      name,
      slug,
      sku: sku || null,
      brand: brand || null,
      short_description: short_description || null,
      category_id,
      pricing_type: pricing_type || "per_ml",
      base_price: pricing_type === "per_unit" ? (base_price || 0) : 0,
      is_active: true,
    })
    .select("id, sku")
    .single();

  if (productError) {
    console.error("Error creating product:", productError);
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  if (variants && variants.length > 0) {
    const variantRows = variants.map((v) => ({
      product_id: product.id,
      size_ml: v.size_ml,
      price: v.price,
      stock: v.stock || 0,
      low_stock_threshold: v.low_stock_threshold || 5,
      is_active: true,
    }));

    const { error: variantError } = await adminSupabase
      .from("product_variants")
      .insert(variantRows);

    if (variantError) {
      await adminSupabase.from("products").delete().eq("id", product.id);
      console.error("Error creating variants:", variantError);
      return NextResponse.json({ error: variantError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ product }, { status: 201 });
}

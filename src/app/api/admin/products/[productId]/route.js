import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await params;
    const body = await request.json();
    const adminSupabase = createAdminClient();

    // Update product fields
    const { variants, images, category, ...productFields } = body;

    const { error: productError } = await adminSupabase
      .from("products")
      .update({ ...productFields, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 });
    }

    // Delete removed variants and upsert remaining
    if (variants) {
      const incomingIds = variants.filter(v => v.id.startsWith("new-") === false).map(v => v.id);
      const { error: deleteVarError } = await adminSupabase
        .from("product_variants")
        .delete()
        .eq("product_id", productId)
        .not("id", "in", `(${incomingIds.join(",")})`);
      if (deleteVarError) console.error("Variant delete error:", deleteVarError);

      for (const v of variants) {
        if (v.id.startsWith("new-")) {
          const { error: insertError } = await adminSupabase
            .from("product_variants")
            .insert({
              product_id: productId,
              size_ml: v.size_ml,
              price: v.price,
              stock: v.stock,
              low_stock_threshold: v.low_stock_threshold || 5,
              is_active: v.is_active !== false,
            });
          if (insertError) console.error("Variant insert error:", insertError);
        } else {
          const { error: updateError } = await adminSupabase
            .from("product_variants")
            .update({
              size_ml: v.size_ml,
              price: v.price,
              stock: v.stock,
              low_stock_threshold: v.low_stock_threshold || 5,
              is_active: v.is_active !== false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", v.id)
            .eq("product_id", productId);
          if (updateError) console.error("Variant update error:", updateError);
        }
      }
    }

    // Replace images
    if (images) {
      // Delete existing images
      await adminSupabase
        .from("product_images")
        .delete()
        .eq("product_id", productId);

      // Insert new images
      if (images.length > 0) {
        const { error: imgError } = await adminSupabase
          .from("product_images")
          .insert(
            images.map((img, i) => ({
              product_id: productId,
              url: img.url,
              alt_text: img.alt_text || "",
              sort_order: i,
              is_primary: i === 0,
            }))
          );
        if (imgError) console.error("Image insert error:", imgError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { productId } = await params;

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

  // Check if product has order items (prevent deletion if referenced)
  const { data: variants } = await adminSupabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);

  if (variants?.length) {
    const variantIds = variants.map(v => v.id);
    const { data: referencedItems } = await adminSupabase
      .from("order_items")
      .select("id")
      .in("variant_id", variantIds)
      .limit(1);

    if (referencedItems?.length) {
      return NextResponse.json({ error: "Cannot delete product with existing orders. Deactivate instead." }, { status: 400 });
    }
  }

  // Delete product (cascades to variants, images via FK)
  const { error } = await adminSupabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

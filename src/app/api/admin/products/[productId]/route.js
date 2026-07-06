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

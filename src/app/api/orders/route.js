import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shipping, paymentMethod } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.variantId) {
        return NextResponse.json({ error: `"${item.productName}" is missing variant information. Try removing and re-adding it.` }, { status: 400 });
      }
    }

    if (!shipping?.full_name || !shipping?.phone || !shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.pincode) {
      return NextResponse.json({ error: "Missing required shipping fields" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Save shipping address
    const { data: address, error: addrError } = await adminSupabase
      .from("addresses")
      .insert({
        user_id: user.id,
        label: "Shipping",
        full_name: shipping.full_name,
        phone: shipping.phone,
        line1: shipping.line1,
        line2: shipping.line2 || null,
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
      })
      .select()
      .single();

    if (addrError) {
      console.error("Address insert error:", addrError);
      return NextResponse.json({ error: addrError.message }, { status: 500 });
    }

    // Generate order number (SGD-A1B2C3-D4E5)
    const ts = Math.floor(Date.now() / 1000).toString();
    const orderNumber = "SGD-"
      + crypto.createHash("md5").update(ts).digest("hex").substring(0, 6).toUpperCase()
      + "-"
      + crypto.createHash("md5").update(Math.random().toString()).digest("hex").substring(0, 4).toUpperCase();

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCharge = subtotal >= 499 ? 0 : 99;
    const total = subtotal + shippingCharge;

    // Create order
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        subtotal,
        shipping_charge: shippingCharge,
        discount_amount: 0,
        total_amount: total,
        payment_method: paymentMethod || "cod",
        shipping_address_id: address.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      variant_id: item.variantId,
      product_name: item.productName,
      variant_size: item.sizeMl || 0,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await adminSupabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      await adminSupabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Status history
    await adminSupabase
      .from("order_status_history")
      .insert({
        order_id: order.id,
        to_status: "pending",
        changed_by: user.id,
      });

    // Deduct stock for each variant
    for (const item of items) {
      const { data: variant } = await adminSupabase
        .from("product_variants")
        .select("stock")
        .eq("id", item.variantId)
        .single();

      if (variant) {
        await adminSupabase
          .from("product_variants")
          .update({ stock: Math.max(0, variant.stock - item.quantity) })
          .eq("id", item.variantId);
      }
    }

    return NextResponse.json({
      success: true,
      order: { id: order.id, order_number: orderNumber, total },
    }, { status: 201 });

  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

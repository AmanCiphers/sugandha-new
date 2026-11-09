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
    const { items, shipping, paymentMethod, couponId, discountAmount } = body;

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
    const discount = Number(discountAmount) || 0;
    const total = subtotal + shippingCharge - discount;

    // Create order
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        subtotal,
        shipping_charge: shippingCharge,
        discount_amount: discount,
        total_amount: total,
        payment_method: paymentMethod || "cod",
        coupon_id: couponId || null,
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

    // Increment coupon usage count
    if (couponId) {
      const { data: coupon } = await adminSupabase
        .from("coupons")
        .select("used_count")
        .eq("id", couponId)
        .single();
      if (coupon) {
        await adminSupabase
          .from("coupons")
          .update({ used_count: (coupon.used_count || 0) + 1 })
          .eq("id", couponId);
      }
    }

    // Send admin notification email (non-blocking)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    if (adminEmail && resendKey) {
      const itemsList = items
        .map((i) => `${i.productName}${i.sizeMl ? ` (${i.sizeMl}ml)` : ""} x ${i.quantity} — ₹${(i.price * i.quantity).toFixed(2)}`)
        .join("\n");

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sugandha Orders <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Order #${orderNumber} — ₹${total.toFixed(2)}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#1a1a1a;">New Order Received 🎉</h2>
              <p style="color:#666;">Order <strong>#${orderNumber}</strong> has been placed.</p>

              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px 0;color:#666;">Customer</td><td style="padding:8px 0;font-weight:600;">${shipping.full_name}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;font-weight:600;">${shipping.phone}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Payment</td><td style="padding:8px 0;font-weight:600;text-transform:capitalize;">${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Total</td><td style="padding:8px 0;font-weight:600;font-size:18px;">₹${total.toFixed(2)}</td></tr>
              </table>

              <h3 style="color:#1a1a1a;margin-top:24px;">Items</h3>
              <table style="width:100%;border-collapse:collapse;">
                ${items.map((i) => `
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #eee;">${i.productName}${i.sizeMl ? ` (${i.sizeMl}ml)` : ""}</td>
                    <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:center;">x${i.quantity}</td>
                    <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">₹${(i.price * i.quantity).toFixed(2)}</td>
                  </tr>
                `).join("")}
              </table>

              <h3 style="color:#1a1a1a;margin-top:24px;">Shipping Address</h3>
              <p style="color:#666;line-height:1.6;">
                ${shipping.full_name}<br>
                ${shipping.line1}${shipping.line2 ? `<br>${shipping.line2}` : ""}<br>
                ${shipping.city}, ${shipping.state} ${shipping.pincode}
              </p>

              <p style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;color:#999;font-size:12px;">
                This is an automated notification from Sugandha.
              </p>
            </div>
          `,
        }),
      }).catch((err) => console.error("Admin email notification failed:", err));
    }

    // Send customer confirmation email
    if (user?.email && resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sugandha <onboarding@resend.dev>",
          to: user.email,
          subject: `Order Confirmed — #${orderNumber}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#1a1a1a;">Thank you for your order! 🎉</h2>
              <p style="color:#666;">Hi ${shipping.full_name}, your order <strong>#${orderNumber}</strong> has been placed successfully.</p>

              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px 0;color:#666;">Order Number</td><td style="padding:8px 0;font-weight:600;">#${orderNumber}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Payment</td><td style="padding:8px 0;font-weight:600;text-transform:capitalize;">${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Total</td><td style="padding:8px 0;font-weight:600;font-size:18px;">₹${total.toFixed(2)}</td></tr>
              </table>

              <h3 style="color:#1a1a1a;margin-top:24px;">Items Ordered</h3>
              <table style="width:100%;border-collapse:collapse;">
                ${items.map((i) => `
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #eee;">${i.productName}${i.sizeMl ? ` (${i.sizeMl}ml)` : ""}</td>
                    <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:center;">x${i.quantity}</td>
                    <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">₹${(i.price * i.quantity).toFixed(2)}</td>
                  </tr>
                `).join("")}
              </table>

              <h3 style="color:#1a1a1a;margin-top:24px;">Shipping To</h3>
              <p style="color:#666;line-height:1.6;">
                ${shipping.full_name}<br>
                ${shipping.line1}${shipping.line2 ? `<br>${shipping.line2}` : ""}<br>
                ${shipping.city}, ${shipping.state} ${shipping.pincode}
              </p>

              <p style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;color:#666;font-size:14px;line-height:1.6;">
                We'll notify you when your order ships. For any queries, contact us at <a href="mailto:support@sugandha.in" style="color:#1a1a1a;">support@sugandha.in</a>.
              </p>
            </div>
          `,
        }),
      }).catch((err) => console.error("Customer email notification failed:", err));
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

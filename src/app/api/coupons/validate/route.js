import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { code, subtotal } = body;

  if (!code || !subtotal) {
    return NextResponse.json({ error: "Code and subtotal required" }, { status: 400 });
  }

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .maybeSingle();

  if (error || !coupon) {
    return NextResponse.json({ valid: false, error: "Invalid coupon code" }, { status: 400 });
  }

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return NextResponse.json({ valid: false, error: "Coupon not yet active" }, { status: 400 });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return NextResponse.json({ valid: false, error: "Coupon expired" }, { status: 400 });
  }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return NextResponse.json({ valid: false, error: "Coupon usage limit reached" }, { status: 400 });
  }
  if (subtotal < Number(coupon.min_order_amount)) {
    return NextResponse.json({ valid: false, error: `Minimum order ₹${coupon.min_order_amount}` }, { status: 400 });
  }

  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = subtotal * (Number(coupon.discount_value) / 100);
    if (coupon.max_discount_amount) {
      discount = Math.min(discount, Number(coupon.max_discount_amount));
    }
  } else {
    discount = Number(coupon.discount_value);
  }
  discount = Math.min(discount, subtotal);

  return NextResponse.json({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      discount,
    },
  });
}
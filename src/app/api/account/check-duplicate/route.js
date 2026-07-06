import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone } = body;
    const supabase = createAdminClient();

    if (email) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (data) {
        return NextResponse.json({ duplicate: true, field: "email" });
      }
    }

    if (phone) {
      const trimmed = phone.trim();

      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", trimmed)
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (data) {
        return NextResponse.json({ duplicate: true, field: "phone" });
      }

      // Fallback: match by digits only (ignores +, spaces, dashes)
      const digitsOnly = trimmed.replace(/\D/g, "");
      if (digitsOnly.length > 5) {
        const { data: all, error: allError } = await supabase
          .from("profiles")
          .select("phone, id");
        if (allError) {
          return NextResponse.json({ error: allError.message }, { status: 500 });
        }
        if (all?.some((p) => p.phone && p.phone.replace(/\D/g, "") === digitsOnly)) {
          return NextResponse.json({ duplicate: true, field: "phone" });
        }
      }
    }

    return NextResponse.json({ noDuplicate: true });
  } catch (err) {
    console.error("check-duplicate API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

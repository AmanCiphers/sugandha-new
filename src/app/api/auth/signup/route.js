import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email,
          password,
          data: { full_name: name, phone: phone || null },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.msg || data.error || data.error_description || "Signup failed";
      return NextResponse.json({ error: errorMsg }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      needsConfirmation: !data.access_token,
    });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

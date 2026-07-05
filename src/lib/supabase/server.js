// Server-side Supabase client
//
// This file creates a Supabase client that runs on the server (API routes,
// server components, server actions). It uses cookies to maintain the
// user's session across requests.
//
// The `@supabase/ssr` package handles cookie encryption and decryption
// so the auth session persists between page loads.
//
// Usage (in an API route):
//   import { createClient } from "@/lib/supabase/server"
//   const supabase = await createClient()
//   const { data } = await supabase.from("products").select("*")

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

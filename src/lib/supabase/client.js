// Browser-side Supabase client
//
// This file creates a Supabase client that runs in the browser.
// It uses the ANON key — this is safe because:
//   1. The anon key only enables connectivity
//   2. Row Level Security (RLS) policies control what data this client can access
//   3. Without proper RLS, this key alone cannot read private data
//
// Usage: import { createClient } from "@/lib/supabase/client"
//        const supabase = createClient()
//        const { data } = await supabase.from("products").select("*")

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

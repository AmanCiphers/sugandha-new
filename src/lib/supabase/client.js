// Browser-side Supabase client
//
// This file creates a Supabase client that runs in the browser.
// It uses the ANON key — this is safe because:
//   1. The anon key only enables connectivity
//   2. Row Level Security (RLS) policies control what data this client can access
    // 3. Without proper RLS, this key alone cannot read private data
//
// Uses localStorage for auth state, AND syncs to cookies so the server-side
// Supabase client (createServerClient) can read the session for SSR/middleware.
//
// Cookie values are stored as raw JSON (not URL-encoded) because the server's
// cookieStore.getAll() doesn't URL-decode, while the browser's document.cookie
// API works fine with raw JSON values (no semicolons/special chars in our data).
//
// Usage: import { createClient } from "@/lib/supabase/client"
//        const supabase = createClient()
//        const { data } = await supabase.from("products").select("*")

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function setCookie(key, value, maxAge) {
  document.cookie = `${key}=${value}; path=/; samesite=lax; max-age=${maxAge}`;
}

function removeCookie(key) {
  document.cookie = `${key}=; path=/; max-age=0`;
}

let cachedClient = null;

export function createClient() {
  if (cachedClient) return cachedClient;
  cachedClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        autoRefreshToken: true,
        persistSession: true,
        storage: {
          getItem(key) {
            if (typeof localStorage === "undefined") return null;
            return localStorage.getItem(key);
          },
          setItem(key, value) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(key, value);
            }
            if (typeof document !== "undefined") {
              setCookie(key, value, 60 * 60 * 24 * 365);
            }
          },
          removeItem(key) {
            if (typeof localStorage !== "undefined") {
              localStorage.removeItem(key);
            }
            if (typeof document !== "undefined") {
              removeCookie(key);
            }
          },
        },
      },
    }
  );
  return cachedClient;
}

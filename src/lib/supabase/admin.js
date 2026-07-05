// Admin Supabase client
//
// This client uses the SERVICE ROLE key, which bypasses ALL Row Level
// Security policies. This is intentional — admin operations need full
// access to all data without being restricted by user-level policies.
//
// IMPORTANT: This client must NEVER be used in:
//   - Browser code (the service role key is not exposed to the client)
//   - Non-admin API routes
//
// It should ONLY be used in admin API routes and server-side admin operations.
//
// Usage:
//   import { createAdminClient } from "@/lib/supabase/admin"
//   const supabase = createAdminClient()
//   const { data } = await supabase.from("products").select("*")

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

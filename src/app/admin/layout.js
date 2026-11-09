import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminLayoutClient from "./admin-layout-client";

export default async function AdminLayout({ children }) {
  try {
    const headersList = await headers();
    const referer = headersList.get("referer") || "";
    const currentPath = referer.includes("/admin") ? new URL(referer).pathname : "/admin";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }

    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      redirect("/");
    }
  } catch {
    redirect("/auth/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

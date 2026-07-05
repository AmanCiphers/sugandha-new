"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/40 bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-muted-foreground md:block">
          {user?.email || "Admin"}
        </span>
        <Link href="/">
          <Button variant="outline" size="sm">
            View Store
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-red-500">
          Sign Out
        </Button>
      </div>
    </header>
  );
}

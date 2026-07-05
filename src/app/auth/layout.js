import Link from "next/link";
import { STORE_NAME } from "@/constants";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-warm-white via-background to-beige px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-3xl font-bold tracking-wide text-foreground">
            {STORE_NAME}
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            {STORE_NAME === "Sugandha" ? "Discover Your Signature Scent" : ""}
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

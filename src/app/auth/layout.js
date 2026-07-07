import Link from "next/link";
import { STORE_NAME } from "@/constants";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-warm-white via-background to-beige px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <img
              src="/sugandha_logo.svg"
              alt={STORE_NAME}
              className="mx-auto h-12 w-auto"
            />
          </Link>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

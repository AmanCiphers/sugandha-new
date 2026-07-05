"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock - replace with actual password reset later
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-serif text-xl font-bold text-foreground">Check Your Email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent password reset instructions to {email}
        </p>
        <Link href="/auth/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground text-center">Reset Password</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you reset instructions
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-full h-11 bg-foreground text-background hover:bg-foreground/90"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Instructions"}
        </Button>
      </form>

      <Link href="/auth/login" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Sign In
      </Link>
    </div>
  );
}

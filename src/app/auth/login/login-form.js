"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/auth-context";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push(redirectTo);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground text-center">Welcome Back</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to your account</p>

      {redirectTo !== "/" && (
        <p className="mt-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="h-3.5 w-3.5" />
          You&apos;ll be redirected back after signing in
        </p>
      )}

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
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full h-11 bg-foreground text-background hover:bg-foreground/90"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
          Forgot password?
        </Link>
        <Link href="/auth/register" className="font-medium text-foreground hover:text-muted-foreground transition-colors">
          Create account
        </Link>
      </div>
    </div>
  );
}

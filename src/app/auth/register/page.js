"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const check = await fetch("/api/account/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const checkData = await check.json();

      if (!check.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (checkData.duplicate) {
        setError(
          checkData.field === "email" ? "This email is already registered" :
          "This phone number is already registered"
        );
        setLoading(false);
        return;
      }

      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      });
      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setError(
          signupData.error && typeof signupData.error === "string"
            ? signupData.error : "Something went wrong"
        );
        setLoading(false);
        return;
      }

      if (signupData.needsConfirmation) {
        setNeedsConfirmation(true);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (needsConfirmation) {
    return (
      <div className="text-center">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-serif text-xl font-bold text-foreground">Check Your Email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Click the link to activate your account, then sign in.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground text-center">Create Account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Join the Sugandha family</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
          <Input
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
          <Input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
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
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-foreground hover:text-muted-foreground transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { User, Package, MapPin, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";

const links = [
  { href: "/account/orders", label: "My Orders", icon: Package, description: "View and track your orders" },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, description: "Manage your shipping addresses" },
];

export default function AccountPage() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <User className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">Sign In Required</h1>
        <p className="mt-2 text-muted-foreground">Please sign in to view your account.</p>
        <Link href="/auth/login">
          <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">My Account</h1>
        <p className="mt-2 text-muted-foreground">Welcome back, {user.email}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-lg border border-border/40 p-6 transition-all hover:shadow-lg hover:shadow-black/5"
            >
              <Icon className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                {link.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
              <ChevronRight className="mt-4 h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          );
        })}

        <button
          onClick={() => signOut()}
          className="group rounded-lg border border-border/40 p-6 text-left transition-all hover:shadow-lg hover:shadow-black/5"
        >
          <LogOut className="h-8 w-8 text-red-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-red-500">Sign Out</h3>
          <p className="mt-1 text-sm text-muted-foreground">Sign out of your account</p>
        </button>
      </div>
    </div>
  );
}

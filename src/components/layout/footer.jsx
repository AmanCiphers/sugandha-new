"use client";

import Link from "next/link";
import { STORE_NAME } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-wide"
            >
              {STORE_NAME}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Premium fragrances curated for those who appreciate the art of
              fine scent. Discover your signature fragrance with Sugandha.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/categories", label: "Categories" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/faqs", label: "FAQs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Policies
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/return-policy", label: "Return Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Stay Connected
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="h-10 rounded-full border-border bg-background px-4 text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="h-10 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

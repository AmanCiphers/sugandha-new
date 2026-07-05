"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/shared/section-header";
import { STORE_NAME } from "@/constants";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Contact Us" subtitle={`Get in touch with the ${STORE_NAME} team`} />

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          {submitted ? (
            <div className="rounded-lg border border-border/40 p-8 text-center">
              <h3 className="font-serif text-xl font-bold text-foreground">Thank You!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ve received your message and will get back to you within 24 hours.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                  <Input required placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <Input required type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Subject</label>
                <Input required placeholder="How can we help?" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  className="h-32 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm resize-y"
                />
              </div>
              <Button type="submit" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                Send Message
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          {[
            { icon: Mail, title: "Email", content: "hello@sugandha.com" },
            { icon: Phone, title: "Phone", content: "+91 98765 43210" },
            { icon: MapPin, title: "Address", content: "Mumbai, Maharashtra, India" },
            { icon: Clock, title: "Business Hours", content: "Mon - Sat: 10 AM - 7 PM" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

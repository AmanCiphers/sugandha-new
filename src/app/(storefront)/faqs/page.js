"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { classNames as cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/section-header";

const faqs = [
  { q: "What payment methods do you accept?", a: "We currently accept Cash on Delivery (COD) for all orders. UPI and card payments will be available soon." },
  { q: "How long does shipping take?", a: "Orders are processed within 24 hours. Delivery typically takes 3-7 business days depending on your location." },
  { q: "What is your return policy?", a: "We offer a 7-day return policy from the date of delivery. Products must be unused and in original packaging." },
  { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above ₹499." },
  { q: "Are your products authentic?", a: "Absolutely. We source directly from trusted fragrance houses and artisans. Every product is guaranteed authentic." },
  { q: "How do I track my order?", a: "Once your order is shipped, you will receive a tracking link via email and SMS." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 24 hours of placement. Please contact our support team." },
  { q: "Do you ship internationally?", a: "Currently, we only ship within India. International shipping will be available soon." },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="FAQs" subtitle="Find answers to common questions" />

      <div className="mt-12 space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-border/40 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50"
            >
              <span className="text-sm font-medium text-foreground">{faq.q}</span>
              <ChevronDown
                className={classNames(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>
            {openIndex === index && (
              <div className="border-t border-border/40 px-6 py-4">
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { SectionHeader } from "@/components/shared/section-header";

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Return Policy" />
      <div className="mt-12 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-base font-semibold text-foreground">Return Window</h3>
        <p>We offer a 7-day return policy from the date of delivery. Products must be unused and in their original packaging.</p>
        <h3 className="text-base font-semibold text-foreground">How to Initiate a Return</h3>
        <p>Contact our support team at hello@sugandha.com with your order number and reason for return. We will guide you through the process.</p>
        <h3 className="text-base font-semibold text-foreground">Refund Process</h3>
        <p>Once we receive and inspect the returned product, refunds are processed within 5-7 business days. Refunds are credited to the original payment method.</p>
        <h3 className="text-base font-semibold text-foreground">Non-Returnable Items</h3>
        <p>Due to hygiene reasons, we cannot accept returns on products that have been opened or used. Please ensure the product is sealed before returning.</p>
        <h3 className="text-base font-semibold text-foreground">Shipping for Returns</h3>
        <p>Return shipping costs are borne by the customer unless the product is defective or incorrect.</p>
      </div>
    </div>
  );
}

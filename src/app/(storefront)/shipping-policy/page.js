"use client";

import { SectionHeader } from "@/components/shared/section-header";

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Shipping Policy" />
      <div className="mt-12 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-base font-semibold text-foreground">Processing Time</h3>
        <p>Orders are processed within 24 hours of placement (excluding weekends and holidays).</p>
        <h3 className="text-base font-semibold text-foreground">Shipping Charges</h3>
        <p>Free shipping on all orders above ₹499. A flat ₹99 shipping fee applies to orders below ₹499.</p>
        <h3 className="text-base font-semibold text-foreground">Delivery Time</h3>
        <p>Standard delivery takes 3-7 business days depending on your location. Metro cities typically receive deliveries within 2-4 business days.</p>
        <h3 className="text-base font-semibold text-foreground">Order Tracking</h3>
        <p>Once shipped, you will receive a tracking link via email and SMS to track your order in real-time.</p>
        <h3 className="text-base font-semibold text-foreground">Shipping Areas</h3>
        <p>We currently ship to all pincodes across India. International shipping coming soon.</p>
      </div>
    </div>
  );
}

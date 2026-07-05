"use client";

import { SectionHeader } from "@/components/shared/section-header";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Privacy Policy" />
      <div className="mt-12 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>At Sugandha, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
        <h3 className="text-base font-semibold text-foreground">Information We Collect</h3>
        <p>We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, and shipping address.</p>
        <h3 className="text-base font-semibold text-foreground">How We Use Your Information</h3>
        <p>We use your information to process orders, provide customer support, and send order updates. We do not sell your personal information to third parties.</p>
        <h3 className="text-base font-semibold text-foreground">Data Security</h3>
        <p>We implement industry-standard security measures to protect your data. However, no online transaction is 100% secure.</p>
        <h3 className="text-base font-semibold text-foreground">Contact</h3>
        <p>For privacy-related inquiries, contact us at hello@sugandha.com.</p>
      </div>
    </div>
  );
}

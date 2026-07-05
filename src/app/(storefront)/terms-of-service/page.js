"use client";

import { SectionHeader } from "@/components/shared/section-header";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Terms of Service" />
      <div className="mt-12 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>By using the Sugandha website, you agree to these terms of service. Please read them carefully.</p>
        <h3 className="text-base font-semibold text-foreground">Account Registration</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
        <h3 className="text-base font-semibold text-foreground">Product Information</h3>
        <p>We strive to display accurate product information. However, we do not warrant that descriptions or images are error-free.</p>
        <h3 className="text-base font-semibold text-foreground">Pricing</h3>
        <p>All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices without notice.</p>
        <h3 className="text-base font-semibold text-foreground">Limitation of Liability</h3>
        <p>Sugandha shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
      </div>
    </div>
  );
}

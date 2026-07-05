"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultSettings = {
  storeName: "Sugandha",
  storeEmail: "hello@sugandha.com",
  storePhone: "+91 98765 43210",
  freeShippingThreshold: "499",
  deliveryCharge: "99",
  returnDays: "7",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("general");

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    alert("Settings saved! (Demo)");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex gap-4 border-b border-border/40">
        {["general", "shipping", "notifications"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors ${
              tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>{tab === "general" ? "General Settings" : tab === "shipping" ? "Shipping Settings" : "Notification Settings"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {tab === "general" && (
                <>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Store Name</label>
                    <Input value={settings.storeName} onChange={(e) => handleChange("storeName", e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Store Email</label>
                    <Input type="email" value={settings.storeEmail} onChange={(e) => handleChange("storeEmail", e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Store Phone</label>
                    <Input value={settings.storePhone} onChange={(e) => handleChange("storePhone", e.target.value)} />
                  </div>
                </>
              )}
              {tab === "shipping" && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Free Shipping Threshold (₹)</label>
                    <Input type="number" value={settings.freeShippingThreshold} onChange={(e) => handleChange("freeShippingThreshold", e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Delivery Charge (₹)</label>
                    <Input type="number" value={settings.deliveryCharge} onChange={(e) => handleChange("deliveryCharge", e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Return Period (Days)</label>
                    <Input type="number" value={settings.returnDays} onChange={(e) => handleChange("returnDays", e.target.value)} />
                  </div>
                </>
              )}
              {tab === "notifications" && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Notification settings coming soon.</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={saving} className="rounded-full">
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

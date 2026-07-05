"use client";

import { useState } from "react";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HOMEPAGE_SECTIONS } from "@/constants";

export default function AdminHomepagePage() {
  const [sections, setSections] = useState(
    HOMEPAGE_SECTIONS.map((s) => ({ ...s, visible: true }))
  );

  const toggleSection = (key) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Homepage Sections</h1>
      <p className="text-sm text-muted-foreground">Manage the visibility and order of homepage sections.</p>

      <Card>
        <CardHeader>
          <CardTitle>Section Order & Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.key}
                className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div>
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className="text-xs text-muted-foreground">Section {index + 1}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSection(section.key)}
                  className={section.visible ? "" : "text-muted-foreground"}
                >
                  {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              onClick={() => alert("Homepage layout saved! (Demo)")}
              className="rounded-full"
            >
              Save Layout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

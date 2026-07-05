"use client";

import { Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialList({ testimonials }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button className="rounded-full" onClick={() => alert("Add testimonial form coming soon")}>
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-6">
                <Star className="h-5 w-5 text-champagne-gold-dark mb-3" />
                <p className="text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium">{t.customerName}</p>
                  <Button variant="ghost" size="icon-sm" className="text-red-500" onClick={() => alert("Delete coming soon")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Sparkles, Brain, Zap, ArrowRight, Heart, MessageSquare, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ScentFinderCTA() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-foreground via-foreground/90 to-rose-600/80 p-8 sm:p-12 lg:p-16">
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-2 text-amber-100 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>NEW: AI-Powered Scent Discovery</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-6 leading-tight">
                Find Your Signature Scent in <span className="text-amber-200">60 Seconds</span>
              </h2>
              <p className="text-lg text-background/90 mb-8 max-w-xl">
                Not sure what you like? Chat with <strong>Arya</strong>, our AI fragrance consultant, or take our quick quiz. Get personalized recommendations from our curated collection of premium attars & car perfumes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/scent-finder">
                  <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 gap-2">
                    <Brain className="h-5 w-5" />
                    Take the Scent Quiz
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full border-background/50 text-background hover:bg-background/10 gap-2"
                  onClick={() => document.querySelector('[data-ai-chat]')?.click()}
                >
                  <MessageSquare className="h-5 w-5" />
                  Chat with Arya
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 to-rose-200/30 rounded-2xl blur-2xl" />
                <div className="relative h-full w-full rounded-2xl bg-background/20 backdrop-blur-sm border border-background/30 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center shadow-xl">
                      <Brain className="h-12 w-12 text-background" />
                    </div>
                    <p className="text-background/80 text-lg font-medium">Arya</p>
                    <p className="text-background/60 text-sm">Your AI Fragrance Consultant</p>
                    <div className="mt-6 flex justify-center gap-4 text-background/50 text-xs">
                      <div className="flex items-center gap-1"><Zap className="h-3 w-3" /> Instant</div>
                      <div className="flex items-center gap-1"><Heart className="h-3 w-3" /> Personal</div>
                      <div className="flex items-center gap-1"><Flower2 className="h-3 w-3" /> Accurate</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-amber-300/20 rounded-full blur-3xl" />
                <div className="absolute -top-4 -left-4 h-24 w-24 bg-rose-300/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 h-20 w-20 border-2 border-background/20 rounded-full animate-pulse-slow" />
            <div className="absolute bottom-20 right-10 h-16 w-16 border border-background/10 rounded-lg rotate-12" />
            <div className="absolute top-1/2 left-5 h-8 w-8 bg-amber-300/30 rounded-full blur-xl" />
            <div className="absolute bottom-10 left-20 h-12 w-12 bg-rose-300/30 rounded-full blur-xl" />
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Brain, label: "AI Personalized", desc: "Smart recommendations based on your unique preferences" },
            { icon: Zap, label: "60 Seconds", desc: "Quick quiz or chat — get matches instantly" },
            { icon: Heart, label: "Curated Catalog", desc: "Only from our premium attars & car perfumes" },
          ].map((feature, i) => (
            <Card key={i} className="border-border/40 hover:border-foreground/30 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-foreground/10 to-rose-500/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
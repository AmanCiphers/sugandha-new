"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Search, Heart, Gift, Sun, Moon, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/shared/product-card";
import { toast } from "sonner";

const QUESTIONS = [
  {
    id: "scentFamily",
    label: "What scent family appeals to you most?",
    icon: Sparkles,
    options: [
      { value: "woody", label: "Woody", desc: "Sandalwood, cedar, oud, vetiver", icon: "🌲" },
      { value: "floral", label: "Floral", desc: "Rose, jasmine, lavender, gardenia", icon: "🌸" },
      { value: "citrus", label: "Citrus", desc: "Bergamot, lemon, orange, grapefruit", icon: "🍋" },
      { value: "spicy", label: "Spicy", desc: "Cinnamon, cardamom, pepper, clove", icon: "🌶️" },
      { value: "fresh", label: "Fresh", desc: "Mint, marine, green tea, bamboo", icon: "💧" },
      { value: "sweet", label: "Sweet/Gourmand", desc: "Vanilla, caramel, honey, amber", icon: "🍯" },
      { value: "musky", label: "Musky", desc: "Musk, ambergris, labdanum", icon: "🤎" },
      { value: "fruity", label: "Fruity", desc: "Apple, peach, berry, mango", icon: "🍑" },
    ],
  },
  {
    id: "intensity",
    label: "How intense do you like your fragrance?",
    icon: Search,
    options: [
      { value: "light", label: "Light & Subtle", desc: "Close to skin, intimate" },
      { value: "moderate", label: "Moderate", desc: "Noticeable but not overwhelming" },
      { value: "strong", label: "Bold & Powerful", desc: "Long-lasting, room-filling" },
    ],
  },
  {
    id: "occasion",
    label: "When will you wear it most?",
    icon: Gift,
    options: [
      { value: "daily", label: "Daily Wear", desc: "Office, errands, casual" },
      { value: "evening", label: "Evening/Events", desc: "Dinners, parties, dates" },
      { value: "special", label: "Special Occasions", desc: "Weddings, celebrations" },
      { value: "car", label: "Car Perfume", desc: "For your vehicle" },
    ],
  },
  {
    id: "timeOfDay",
    label: "Preferred time of day?",
    icon: Sun,
    options: [
      { value: "morning", label: "Morning", desc: "Fresh, energizing scents" },
      { value: "afternoon", label: "Afternoon", desc: "Balanced, versatile" },
      { value: "night", label: "Night", desc: "Deep, sensual, warm" },
      { value: "anytime", label: "Anytime", desc: "All-day versatility" },
    ],
  },
  {
    id: "budget",
    label: "What's your budget per bottle?",
    icon: DollarSign,
    options: [
      { value: "under500", label: "Under ₹500", desc: "Budget-friendly" },
      { value: "500-1000", label: "₹500 - ₹1,000", desc: "Mid-range" },
      { value: "1000-2000", label: "₹1,000 - ₹2,000", desc: "Premium" },
      { value: "2000+", label: "₹2,000+", desc: "Luxury" },
    ],
  },
  {
    id: "longevity",
    label: "How long should it last?",
    icon: Clock,
    options: [
      { value: "short", label: "2-4 hours", desc: "Light, reapply often" },
      { value: "medium", label: "4-8 hours", desc: "Lasts through work/school" },
      { value: "long", label: "8+ hours", desc: "All-day without reapplying" },
    ],
  },
  {
    id: "gender",
    label: "Any gender preference?",
    icon: Heart,
    options: [
      { value: "masculine", label: "Masculine", desc: "Traditionally masculine notes" },
      { value: "feminine", label: "Feminine", desc: "Traditionally feminine notes" },
      { value: "unisex", label: "Unisex/Neutral", desc: "Works for everyone" },
    ],
  },
];

export default function ScentFinderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      getRecommendations();
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scent-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get recommendations");
      setRecommendations(data.recommendations || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations(null);
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  if (recommendations) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-foreground" />
          <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Your Perfect Scents</h1>
          <p className="mt-2 text-muted-foreground">AI-curated recommendations based on your preferences</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h2 className="mt-4 font-serif text-xl font-bold">No Matches Found</h2>
            <p className="mt-2 text-muted-foreground">Try adjusting your preferences or browse our full collection.</p>
            <Button className="mt-6 rounded-full" onClick={restart}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec, i) => (
              <Card key={rec.productId || i} className="overflow-hidden">
                {rec.imageUrl && (
                  <div className="aspect-square overflow-hidden">
                    <img src={rec.imageUrl} alt={rec.productName} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg font-semibold text-foreground">{rec.productName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{rec.reason}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Best for: {rec.bestFor}</span>
                    <span>Size: {rec.recommendedVariant}</span>
                  </div>
                  {rec.slug && (
                    <Link href={`/product/${rec.slug}`} className="mt-4 block">
                      <Button className="w-full rounded-full" variant="outline">View Details</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button className="rounded-full" variant="outline" onClick={restart}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Retake Quiz
          </Button>
          <Button className="ml-4 rounded-full" onClick={() => window.location.href = "/shop"}>
            Browse All Products <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentStep];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-foreground" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Find Your Signature Scent</h1>
        <p className="mt-2 text-muted-foreground">Answer a few questions and let our AI recommend the perfect fragrance for you</p>
      </div>

      <div className="mb-8 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="mb-8 text-center text-sm text-muted-foreground">Question {currentStep + 1} of {QUESTIONS.length}</p>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <question.icon className="h-6 w-6 text-foreground" />
          </div>
          <CardTitle className="text-xl">{question.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(question.id, opt.value)}
              disabled={loading}
              className="w-full relative rounded-lg border-2 border-border/40 p-4 text-left transition-all hover:border-foreground/50 hover:bg-muted/30 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              {opt.icon && <span className="text-2xl mr-3">{opt.icon}</span>}
              <div>
                <p className="font-medium text-foreground">{opt.label}</p>
                {opt.desc && <p className="text-xs text-muted-foreground">{opt.desc}</p>}
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {currentStep > 0 && (
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} disabled={loading}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      )}
    </div>
  );
}
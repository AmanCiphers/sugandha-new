import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama3-70b-8192";

// Predefined Sugandha Fragrance Catalog - AI will ONLY recommend from these
const FRAGRANCE_CATALOG = [
  // ATTARS (per_ml pricing)
  {
    id: "royal-oud-attar",
    name: "Royal Oud Attar",
    slug: "royal-oud-attar",
    category: "Attars",
    description: "Sweet warm Arabic fragrance with rich spicy notes and subtle sweetness. Perfect for evening wear.",
    shortDescription: "Sweet warm Arabic fragrance",
    pricingType: "per_ml",
    basePrice: 55,
    variants: [
      { size_ml: 3, price: 165, stock: 50 },
      { size_ml: 6, price: 330, stock: 50 },
      { size_ml: 12, price: 660, stock: 50 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["woody", "spicy", "musky"],
    intensity: "strong",
    occasions: ["evening", "special"],
    timeOfDay: ["night"],
    gender: "unisex",
    longevity: "long",
    tags: ["oud", "arabic", "warm", "spicy", "premium"]
  },
  {
    id: "creed-aventus-inspired",
    name: "Creed Aventus Inspired",
    slug: "creed-aventus-inspired",
    category: "Attars",
    description: "A masterful blend of fresh pineapple, smoky birch, and luxurious musk. Inspired by the iconic Creed Aventus.",
    shortDescription: "Fresh, smoky, luxurious masculine",
    pricingType: "per_ml",
    basePrice: 80,
    variants: [
      { size_ml: 3, price: 240, stock: 40 },
      { size_ml: 6, price: 480, stock: 40 },
      { size_ml: 12, price: 960, stock: 40 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["fruity", "woody", "musky"],
    intensity: "strong",
    occasions: ["evening", "special", "daily"],
    timeOfDay: ["afternoon", "night"],
    gender: "masculine",
    longevity: "long",
    tags: ["pineapple", "birch", "musk", "luxury", "aventus"]
  },
  {
    id: "musk-al-tahara",
    name: "Musk Al Tahara",
    slug: "musk-al-tahara",
    category: "Attars",
    description: "A pristine white musk fragrance that embodies purity and elegance. Long-lasting and versatile.",
    shortDescription: "Soft clean powdery musk",
    pricingType: "per_ml",
    basePrice: 70,
    variants: [
      { size_ml: 3, price: 210, stock: 60 },
      { size_ml: 6, price: 420, stock: 60 },
      { size_ml: 12, price: 840, stock: 60 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d39?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["musky", "fresh"],
    intensity: "moderate",
    occasions: ["daily", "evening", "special"],
    timeOfDay: ["anytime"],
    gender: "unisex",
    longevity: "long",
    tags: ["white musk", "clean", "pure", "elegant"]
  },
  {
    id: "rose-petal-attar",
    name: "Rose Petal Attar",
    slug: "rose-petal-attar",
    category: "Attars",
    description: "Handcrafted from the finest rose petals. A timeless floral attar that captures the essence of a blooming garden.",
    shortDescription: "Pure rose fragrance",
    pricingType: "per_ml",
    basePrice: 60,
    variants: [
      { size_ml: 3, price: 180, stock: 45 },
      { size_ml: 6, price: 360, stock: 45 },
      { size_ml: 12, price: 720, stock: 45 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["floral"],
    intensity: "moderate",
    occasions: ["daily", "evening", "special"],
    timeOfDay: ["morning", "afternoon"],
    gender: "feminine",
    longevity: "medium",
    tags: ["rose", "floral", "romantic", "garden"]
  },
  {
    id: "sandalwood-essence",
    name: "Sandalwood Essence",
    slug: "sandalwood-essence",
    category: "Attars",
    description: "Pure Mysore sandalwood oil. Grounding, meditative, and deeply aromatic.",
    shortDescription: "Rich woody sandalwood",
    pricingType: "per_ml",
    basePrice: 85,
    variants: [
      { size_ml: 3, price: 255, stock: 30 },
      { size_ml: 6, price: 510, stock: 30 },
      { size_ml: 12, price: 1020, stock: 30 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1608571423902-adc47d6cf5ef?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["woody"],
    intensity: "moderate",
    occasions: ["daily", "evening", "special"],
    timeOfDay: ["anytime"],
    gender: "unisex",
    longevity: "long",
    tags: ["sandalwood", "mysore", "meditative", "grounding"]
  },
  {
    id: "arabian-kasturi",
    name: "Arabian Kasturi",
    slug: "arabian-kasturi",
    category: "Attars",
    description: "A traditional Arabian musk blend with deep oriental notes. Warm and captivating.",
    shortDescription: "Rich musky oriental fragrance",
    pricingType: "per_ml",
    basePrice: 50,
    variants: [
      { size_ml: 3, price: 150, stock: 55 },
      { size_ml: 6, price: 300, stock: 55 },
      { size_ml: 12, price: 600, stock: 55 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["musky", "woody", "spicy"],
    intensity: "strong",
    occasions: ["evening", "special"],
    timeOfDay: ["night"],
    gender: "unisex",
    longevity: "long",
    tags: ["kasturi", "arabian", "oriental", "musk", "traditional"]
  },

  // CAR PERFUMES (per_unit pricing)
  {
    id: "ocean-breeze-car-perfume",
    name: "Ocean Breeze Car Perfume",
    slug: "ocean-breeze-car-perfume",
    category: "Car Perfumes",
    description: "Keep your car smelling like a coastal breeze. Long-lasting fragrance oil designed specifically for automotive use.",
    shortDescription: "Fresh oceanic fragrance for your car",
    pricingType: "per_unit",
    basePrice: 350,
    variants: [
      { size_ml: 10, price: 350, stock: 100 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b188993e22?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["fresh", "citrus"],
    intensity: "moderate",
    occasions: ["car"],
    timeOfDay: ["anytime"],
    gender: "unisex",
    longevity: "long",
    tags: ["ocean", "breeze", "car", "fresh", "automotive"]
  },
  {
    id: "leather-spice-car-perfume",
    name: "Leather & Spice Car Perfume",
    slug: "leather-spice-car-perfume",
    category: "Car Perfumes",
    description: "A sophisticated blend of leather and warm spices. Perfect for luxury car owners.",
    shortDescription: "Premium leather fragrance for cars",
    pricingType: "per_unit",
    basePrice: 350,
    variants: [
      { size_ml: 10, price: 350, stock: 80 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1549339171-58a0414e4f0c?w=600&h=600&fit=crop&auto=format",
    scentProfile: ["woody", "spicy", "musky"],
    intensity: "strong",
    occasions: ["car"],
    timeOfDay: ["anytime"],
    gender: "masculine",
    longevity: "long",
    tags: ["leather", "spice", "car", "luxury", "automotive"]
  }
];

function formatCatalogForPrompt(catalog) {
  return catalog.map(p => {
    const variants = p.variants.map(v => `${v.size_ml}ml@₹${v.price}`).join(", ");
    const priceInfo = p.pricingType === "per_ml" ? `₹${p.basePrice}/ml` : `₹${p.basePrice} (flat)`;
    return `- ${p.name} (${p.category}): ${p.description}. Pricing: ${priceInfo}. Variants: ${variants}. Scent: ${p.scentProfile.join(", ")}. Intensity: ${p.intensity}. Best for: ${p.occasions.join(", ")}. Time: ${p.timeOfDay.join(", ")}. Gender: ${p.gender}. Longevity: ${p.longevity}. Tags: ${p.tags.join(", ")}`;
  }).join("\n\n");
}

function buildPrompt(userAnswers) {
  const catalogList = formatCatalogForPrompt(FRAGRANCE_CATALOG);

  return `You are "Arya", Sugandha's warm, knowledgeable fragrance consultant. You're chatting with a customer who wants personalized scent recommendations.

CUSTOMER PREFERENCES:
- Preferred scent family: ${userAnswers.scentFamily || "Not specified"}
- Intensity preference: ${userAnswers.intensity || "Not specified"}
- Occasion: ${userAnswers.occasion || "Not specified"}
- Time of day: ${userAnswers.timeOfDay || "Not specified"}
- Budget: ${userAnswers.budget || "Not specified"}
- Longevity expectation: ${userAnswers.longevity || "Not specified"}
- Gender preference: ${userAnswers.gender || "Not specified"}

OUR COMPLETE FRAGRANCE CATALOG (you MUST ONLY recommend from these exact products):
${catalogList}

INSTRUCTIONS:
1. Pick 3-4 products that BEST match their preferences
2. For each, explain WHY it matches in a warm, conversational way (like a friend giving advice)
3. Suggest the best variant/size for their budget
4. Mention when/where to wear it

RESPOND WITH VALID JSON ONLY:
{
  "recommendations": [
    {
      "productName": "Exact product name from catalog",
      "reason": "Warm, conversational 2-3 sentence explanation of why this matches them",
      "recommendedVariant": "e.g., 6ml (₹330) - perfect for trying",
      "bestFor": "e.g., Evening dates and special occasions"
    }
  ]
}

Be conversational, warm, and knowledgeable. Like a fragrance-loving friend helping them discover their signature scent.`;
}

export async function POST(request) {
  try {
    const userAnswers = await request.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    const prompt = buildPrompt(userAnswers);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are Arya, Sugandha's warm fragrance consultant. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let recommendations;
    try {
      recommendations = JSON.parse(content);
      if (!Array.isArray(recommendations)) {
        recommendations = recommendations.recommendations || [];
      }
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    // Enrich with catalog data
    const enriched = recommendations.map(rec => {
      const product = FRAGRANCE_CATALOG.find(p => 
        p.name.toLowerCase() === rec.productName.toLowerCase()
      );
      if (!product) return null;
      return {
        ...rec,
        productId: product.id,
        slug: product.slug,
        imageUrl: product.imageUrl,
        actualPrice: product.basePrice,
        pricingType: product.pricingType,
        variants: product.variants,
        category: product.category,
      };
    }).filter(Boolean);

    return NextResponse.json({ recommendations: enriched });

  } catch (err) {
    console.error("Scent finder error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
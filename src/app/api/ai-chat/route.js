import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "openai/gpt-oss-120b";

const CATALOG = [
  {
    id: "royal-oud-attar",
    name: "Royal Oud Attar",
    slug: "royal-oud-attar",
    category: "Attars",
    description: "Sweet warm Arabic fragrance with rich spicy notes and subtle sweetness. Perfect for evening wear.",
    pricingType: "per_ml",
    basePrice: 55,
    variants: [{ size_ml: 3, price: 165 }, { size_ml: 6, price: 330 }, { size_ml: 12, price: 660 }],
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format",
    notes: "Oud, saffron, rose, amber, sandalwood, musk",
    intensity: "strong",
    occasions: ["evening", "special"],
    timeOfDay: ["night"],
    gender: "unisex",
    longevity: "long",
    stock: 50,
  },
  {
    id: "creed-aventus-inspired",
    name: "Creed Aventus Inspired",
    slug: "creed-aventus-inspired",
    category: "Attars",
    description: "A masterful blend of fresh pineapple, smoky birch, and luxurious musk. Inspired by the iconic Creed Aventus.",
    pricingType: "per_ml",
    basePrice: 80,
    variants: [{ size_ml: 3, price: 240 }, { size_ml: 6, price: 480 }, { size_ml: 12, price: 960 }],
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop&auto=format",
    notes: "Pineapple, blackcurrant, bergamot, apple, birch, patchouli, jasmine, rose, ambergris, musk, oakmoss, vanilla",
    intensity: "strong",
    occasions: ["evening", "special", "daily"],
    timeOfDay: ["afternoon", "night"],
    gender: "masculine",
    longevity: "long",
    stock: 40,
  },
  {
    id: "musk-al-tahara",
    name: "Musk Al Tahara",
    slug: "musk-al-tahara",
    category: "Attars",
    description: "A pristine white musk fragrance that embodies purity and elegance. Long-lasting and versatile.",
    pricingType: "per_ml",
    basePrice: 70,
    variants: [{ size_ml: 3, price: 210 }, { size_ml: 6, price: 420 }, { size_ml: 12, price: 840 }],
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d39?w=600&h=600&fit=crop&auto=format",
    notes: "White musk, amber, floral accords, clean cotton",
    intensity: "moderate",
    occasions: ["daily", "evening", "special"],
    timeOfDay: ["anytime"],
    gender: "unisex",
    longevity: "long",
    stock: 60,
  },
  {
    id: "rose-petal-attar",
    name: "Rose Petal Attar",
    slug: "rose-petal-attar",
    category: "Attars",
    description: "Handcrafted from the finest rose petals. A timeless floral attar that captures the essence of a blooming garden.",
    pricingType: "per_ml",
    basePrice: 60,
    variants: [{ size_ml: 3, price: 180 }, { size_ml: 6, price: 360 }, { size_ml: 12, price: 720 }],
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop&auto=format",
    notes: "Rose, geranium, violet leaf, honey",
    intensity: "moderate",
    occasions: ["daily", "evening", "special"],
    timeOfDay: ["morning", "afternoon"],
    gender: "feminine",
    longevity: "medium",
    stock: 45,
  },
  {
    id: "sandalwood-essence",
    name: "Sandalwood Essence",
    slug: "sandalwood-essence",
    category: "Attars",
    description: "Pure Mysore sandalwood oil. Grounding, meditative, and deeply aromatic.",
    pricingType: "per_ml",
    basePrice: 85,
    variants: [{ size_ml: 3, price: 255 }, { size_ml: 6, price: 510 }, { size_ml: 12, price: 1020 }],
    imageUrl: "https://images.unsplash.com/photo-1608571423902-adc47d6cf5ef?w=600&h=600&fit=crop&auto=format",
    notes: "Mysore sandalwood, cedar, vetiver",
    intensity: "moderate",
    occasions: ["daily", "evening", "special"],
    timeOfDay: ["anytime"],
    gender: "unisex",
    longevity: "long",
    stock: 30,
  },
  {
    id: "arabian-kasturi",
    name: "Arabian Kasturi",
    slug: "arabian-kasturi",
    category: "Attars",
    description: "A traditional Arabian musk blend with deep oriental notes. Warm and captivating.",
    pricingType: "per_ml",
    basePrice: 50,
    variants: [{ size_ml: 3, price: 150 }, { size_ml: 6, price: 300 }, { size_ml: 12, price: 600 }],
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format",
    notes: "Deer musk, amber, oud, saffron, rose, sandalwood",
    intensity: "strong",
    occasions: ["evening", "special"],
    timeOfDay: ["night"],
    gender: "unisex",
    longevity: "long",
    stock: 55,
  },
  {
    id: "ocean-breeze-car-perfume",
    name: "Ocean Breeze Car Perfume",
    slug: "ocean-breeze-car-perfume",
    category: "Car Perfumes",
    description: "Keep your car smelling like a coastal breeze. Long-lasting fragrance oil designed specifically for automotive use.",
    pricingType: "per_unit",
    basePrice: 350,
    variants: [{ size_ml: 10, price: 350 }],
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b188993e22?w=600&h=600&fit=crop&auto=format",
    notes: "Marine accord, bergamot, lemon, sea salt, driftwood",
    intensity: "moderate",
    occasions: ["car"],
    timeOfDay: ["anytime"],
    gender: "unisex",
    longevity: "long",
    stock: 100,
  },
  {
    id: "leather-spice-car-perfume",
    name: "Leather & Spice Car Perfume",
    slug: "leather-spice-car-perfume",
    category: "Car Perfumes",
    description: "A sophisticated blend of leather and warm spices. Perfect for luxury car owners.",
    pricingType: "per_unit",
    basePrice: 350,
    variants: [{ size_ml: 10, price: 350 }],
    imageUrl: "https://images.unsplash.com/photo-1549339171-58a0414e4f0c?w=600&h=600&fit=crop&auto=format",
    notes: "Leather, cinnamon, cardamom, clove, cedar, vanilla",
    intensity: "strong",
    occasions: ["car"],
    timeOfDay: ["anytime"],
    gender: "masculine",
    longevity: "long",
    stock: 80,
  }
];

function formatCatalogForPrompt() {
  return CATALOG.map(p => {
    const variants = p.variants.map(v => `${v.size_ml}ml @ ₹${v.price}`).join(", ");
    const priceInfo = p.pricingType === "per_ml" ? `₹${p.basePrice}/ml` : `₹${p.basePrice} (flat)`;
    return `${p.name} (${p.category}): ${p.description}. Pricing: ${priceInfo}. Variants: ${variants}. Notes: ${p.notes}. Intensity: ${p.intensity}. Best for: ${p.occasions.join(", ")}. Time: ${p.timeOfDay.join(", ")}. Gender: ${p.gender}. Longevity: ${p.longevity}. Stock: ${p.stock}.`;
  }).join("\n\n");
}

function getRecentRecommendations(history) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant") {
      const content = history[i].content.toLowerCase();
      const mentioned = CATALOG.filter(p => content.includes(p.name.toLowerCase()));
      if (mentioned.length) return mentioned.slice(0, 3);
    }
  }
  return [];
}

function buildPrompt(userMessage, history) {
  const catalogStr = formatCatalogForPrompt();
  const recentHistory = history.slice(-8).map(m => `${m.role}: ${m.content}`).join("\n");

  return `You are Arya, Sugandha's warm, knowledgeable fragrance consultant. Chat naturally like a friend helping someone find their perfect scent.

OUR CATALOG (8 products in stock):
${catalogStr}

RECENT CONVERSATION:
${recentHistory}

CUSTOMER: ${userMessage}

RESPOND AS ARYA:
- Warm, conversational, enthusiastic (use emojis naturally ✨ 🌸 🌿)
- 2-4 sentences max - be concise!
- Ask ONE follow-up question to understand them better
- Give specific recommendations with prices when relevant
- If asked about specific product details (notes, longevity, etc.), answer from catalog knowledge
- Mention free shipping over ₹499, COD, 7-day returns naturally
- NEVER sound robotic or like a catalog
- When recommending, always suggest the BEST variant for their need (e.g., "6ml is the sweet spot")

IMPORTANT RULES:
1. You can recommend ANY fragrance from the global market - not just our catalog
2. If the customer wants a fragrance we HAVE in stock, recommend it from our catalog with price
3. If the customer wants a fragrance we DON'T have, you can say: "We don't carry that exact fragrance, but our master perfumers can create a custom version for a fraction of the luxury price! 💫 Would you like me to connect you with our team?"
4. For custom creations, mention they can visit our contact page to request a custom fragrance

RESPONSE FORMAT:
- For in-stock products: Include [ADD_TO_CART: product_id=xxx, variant=6ml, quantity=1] tag
- For custom creations: Mention "Custom Creation Available" and they can visit /contact

If they ask for recommendations, suggest 1-3 specific products with variant suggestions.`;
}

async function callGroq(message, history) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const prompt = buildPrompt(message, history);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are Arya, a warm fragrance consultant. Be conversational, friendly, and helpful. Use emojis naturally. You know the global fragrance market and our catalog." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Groq API error:", error);
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I'm here to help! What are you looking for? ✨";
}

function findKeywordRecommendations(message) {
  const msg = message.toLowerCase();
  const recs = [];

  if (msg.includes("men") || msg.includes("male") || msg.includes("masculine")) {
    recs.push(...CATALOG.filter(p => p.gender === "masculine").slice(0, 2));
    recs.push(...CATALOG.filter(p => p.gender === "unisex" && p.intensity === "strong").slice(0, 1));
  }
  if (msg.includes("women") || msg.includes("female") || msg.includes("feminine")) {
    recs.push(...CATALOG.filter(p => p.gender === "feminine").slice(0, 2));
    recs.push(...CATALOG.filter(p => p.gender === "unisex" && p.notes.toLowerCase().includes("rose")).slice(0, 1));
  }
  if (msg.includes("car") || msg.includes("vehicle")) {
    recs.push(...CATALOG.filter(p => p.category === "Car Perfumes"));
  }
  if (msg.includes("long") && (msg.includes("last") || msg.includes("stay"))) {
    recs.push(...CATALOG.filter(p => p.longevity === "long").slice(0, 3));
  }
  if (msg.includes("gift") || msg.includes("present")) {
    recs.push(...CATALOG.filter(p => p.intensity === "moderate" && p.gender === "unisex").slice(0, 3));
  }
  if (msg.includes("rose") || msg.includes("floral")) {
    recs.push(...CATALOG.filter(p => p.notes.toLowerCase().includes("rose")));
  }
  if (msg.includes("oud") || msg.includes("woody")) {
    recs.push(...CATALOG.filter(p => p.notes.toLowerCase().includes("oud") || p.notes.toLowerCase().includes("sandalwood")).slice(0, 2));
  }
  if (msg.includes("musk")) {
    recs.push(...CATALOG.filter(p => p.notes.toLowerCase().includes("musk")).slice(0, 2));
  }
  if (msg.includes("sandalwood")) {
    recs.push(...CATALOG.filter(p => p.name.toLowerCase().includes("sandalwood")));
  }
  if (msg.includes("fresh") || msg.includes("clean") || msg.includes("light")) {
    recs.push(...CATALOG.filter(p => p.intensity === "light" || p.intensity === "moderate" || p.notes.toLowerCase().includes("marine") || p.notes.toLowerCase().includes("citrus")).slice(0, 2));
  }
  if (msg.includes("budget") || msg.includes("cheap") || msg.includes("affordable") || msg.includes("under")) {
    recs.push(...CATALOG.filter(p => p.basePrice <= 60).slice(0, 3));
  }
  if (msg.includes("premium") || msg.includes("luxury") || msg.includes("best")) {
    recs.push(...CATALOG.filter(p => p.basePrice >= 70).slice(0, 3));
  }
  if ((msg.includes("attar") || msg.includes("perfume") || msg.includes("fragrance") || msg.includes("scent")) && recs.length === 0) {
    recs.push(...CATALOG.filter(p => p.category === "Attars").slice(0, 3));
  }

  const unique = [...new Map(recs.map(p => [p.id, p])).values()];
  return unique.slice(0, 3);
}

function parseAddToCart(reply) {
  const matches = reply.match(/\[ADD_TO_CART:\s*product_id=([a-z-]+),\s*variant=([0-9]+ml),\s*quantity=([0-9]+)\]/g) || [];
  return matches.map(m => {
    const productId = m.match(/product_id=([a-z-]+)/)[1];
    const variant = m.match(/variant=([0-9]+ml)/)[1];
    const quantity = parseInt(m.match(/quantity=([0-9]+)/)[1], 10);
    return { productId, variant, quantity };
  });
}

function stripAddToCartTags(reply) {
  return reply.replace(/\[ADD_TO_CART:[^\]]+\]/g, '').trim();
}

export async function POST(request) {
  try {
    const { message, history = [], userId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const lowerMsg = message.toLowerCase().trim();
    const isConfirmation = /^(yes|yeah|sure|ok|okay|yep|yup|tell me more|more details|details|show me)$/.test(lowerMsg);
    
    let reply;
    let recommendations = [];
    let cartActions = [];

    if (isConfirmation && history.length > 0) {
      const lastRecs = getRecentRecommendations(history);
      if (lastRecs.length) {
        recommendations = lastRecs;
        reply = `Absolutely! Here's more detail:\n\n${lastRecs.map((r, i) => `${i + 1}. **${r.name}** — ${r.description}\n   🌿 Notes: ${r.notes}\n   💪 Intensity: ${r.intensity} | ⏱️ Longevity: ${r.longevity}\n   💰 Best value: ${r.variants[1]?.size_ml}ml @ ₹${r.variants[1]?.price} (or ${r.variants[0]?.size_ml}ml @ ₹${r.variants[0]?.price} to try)\n   🎯 Perfect for: ${r.occasions.join(", ")}`).join("\n\n")}\n\nWant me to add any to your cart? Just say "add the [name] 6ml" ✨`;
      } else {
        reply = "I'd love to tell you more! What specific fragrance were you curious about? ✨";
      }
    } else {
      try {
        reply = await callGroq(message, history);
      } catch (groqError) {
        console.error("Groq failed:", groqError);
        const keywordRecs = findKeywordRecommendations(message);
        if (keywordRecs.length) {
          recommendations = keywordRecs;
          reply = `Having a moment with the AI! 😅 But based on what you said:\n\n${keywordRecs.map((r, i) => `${i + 1}. **${r.name}** — ${r.description} (${r.variants[0]?.size_ml}ml @ ₹${r.variants[0]?.price})`).join("\n")}\n\nWant details on any?`;
        } else {
          reply = "I'm here to help! What kind of fragrance are you looking for? Tell me your vibe — woody, floral, fresh, spicy? ✨";
        }
      }
    }

    cartActions = parseAddToCart(reply);
    reply = stripAddToCartTags(reply);

    if (!recommendations.length) {
      const mentionedProducts = CATALOG.filter(p => 
        reply.toLowerCase().includes(p.name.toLowerCase())
      ).slice(0, 3);
      
      if (mentionedProducts.length) {
        recommendations = mentionedProducts;
      }
    }

    // Enrich cart actions with full product data
    const enrichedCartActions = cartActions.length > 0 ? cartActions.map(action => {
      const product = CATALOG.find(p => p.id === action.productId);
      return product ? { ...action, product } : action;
    }) : undefined;

    // Build recommendations with availability info
    const enrichedRecommendations = recommendations.map(r => {
      const inStock = r.stock > 0;
      return {
        productId: r.id,
        slug: r.slug,
        productName: r.name,
        reason: inStock ? "Perfect for you!" : "We don't stock this, but our perfumers can create a custom version!",
        recommendedVariant: inStock ? `${r.variants[1]?.size_ml}ml @ ₹${r.variants[1]?.price} (or ${r.variants[0]?.size_ml}ml @ ₹${r.variants[0]?.price})` : "Custom creation - price on request",
        bestFor: r.occasions.join(", "),
        imageUrl: r.imageUrl,
        variants: r.variants,
        productUrl: inStock ? `/product/${r.slug}` : "/contact",
        inStock,
        isCustomCreation: !inStock,
        contactUrl: "/contact",
      };
    });

    return NextResponse.json({ 
      reply,
      recommendations: enrichedRecommendations,
      cartActions: enrichedCartActions,
      userId,
    });

  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
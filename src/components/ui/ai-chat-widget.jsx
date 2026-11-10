"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatProductCard } from "@/components/ui/chat-product-card";
import { useCart } from "@/features/cart/context/cart-context";
import { toast } from "sonner";

const WELCOME_MESSAGES = [
  "Hey there! 👋 I'm Arya, your personal fragrance consultant at Sugandha. How can I help you find your perfect scent today?",
  "Welcome! ✨ I'm Arya — think of me as your fragrance-savvy bestie. What kind of vibe are you going for?",
  "Hi! 🌸 I'm Arya from Sugandha. Whether you're after a signature attar or a car perfume, I've got you covered. What are you in the mood for?",
];

const QUICK_REPLIES = [
  { label: "Find my signature scent", action: "quiz" },
  { label: "Best attars for men", query: "What are your best attars for men?" },
  { label: "Best attars for women", query: "What are your best attars for women?" },
  { label: "Car perfume recommendations", query: "Recommend me a car perfume" },
  { label: "Gifting ideas", query: "I need a fragrance gift for someone special" },
  { label: "Long-lasting options", query: "Which fragrances last the longest?" },
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesContainerRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        role: "assistant",
        content: WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleAddToCart = async (product, variantSize) => {
    const sizeNum = variantSize ? parseInt(variantSize.replace('ml', ''), 10) : null;
    const variant = product.variants?.find(v => sizeNum ? v.size_ml === sizeNum : true) || product.variants?.[0];
    if (variant && variant.stock > 0) {
      addItem(product.id, 1, {
        variantId: `${product.id}-${variant.size_ml}`,
        sizeMl: variant.size_ml,
        price: variant.price,
        productName: product.name,
      });
      toast.success(`${product.name} (${variant.size_ml}ml) added to cart! 🛒`);
    } else {
      toast.error("Sorry, that variant is out of stock");
    }
  };

  const handleCartAction = async (action) => {
    // Use enriched product from action if available, otherwise find from recommendations
    const product = action.product || messages.flatMap(m => m.recommendations || []).find(r => r.productId === action.productId);
    if (product) {
      await handleAddToCart(product, action.variant);
    } else {
      toast.error("Product not found");
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setShowQuickReplies(false);

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }]);

    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to get response");

      if (data.cartActions?.length) {
        for (const action of data.cartActions) {
          await handleCartAction(action);
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        recommendations: data.recommendations,
        timestamp: new Date(),
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: "Oops! I'm having trouble connecting right now. Could you try again in a moment? 🙏",
        timestamp: new Date(),
      }]);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    if (reply.action === "quiz") {
      window.location.href = "/scent-finder";
      return;
    }
    setInput(reply.query);
    handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-foreground text-background shadow-xl hover:scale-105 transition-transform duration-200 flex items-center justify-center"
        aria-label="Chat with Arya"
        data-ai-chat
      >
        <Sparkles className="h-7 w-7 text-background animate-bounce" />
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-bold">AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg">
      <div className="bg-background rounded-2xl shadow-2xl border border-border/40 overflow-hidden animate-in slide-up-fade-in duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-gradient-to-r from-foreground/5 to-foreground/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-background" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Arya</p>
              <p className="text-xs text-muted-foreground">Your Fragrance Consultant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div 
          ref={messagesContainerRef}
          className="h-[400px] overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                {msg.role === "assistant" ? (
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-background" />
                  </div>
                ) : (
                  <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block px-4 py-2 rounded-2xl ${msg.role === "user" 
                  ? "bg-foreground text-background rounded-tr-sm" 
                  : "bg-muted text-foreground rounded-tl-sm"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.recommendations?.length && (
                  <div className="mt-3 flex flex-col gap-3">
                    {msg.recommendations.map((rec, i) => (
                      <ChatProductCard
                        key={rec.productId || i}
                        product={rec}
                        onAddToCart={handleAddToCart}
                        compact={msg.recommendations.length > 1}
                      />
                    ))}
                  </div>
                )}
                <p className={`mt-1 text-[10px] ${msg.role === "user" ? "text-right" : ""} text-muted-foreground`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-background animate-spin" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {showQuickReplies && messages.length <= 2 && (
          <div className="p-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-3">Quick start:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.label}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1.5 text-xs rounded-full border border-border/40 bg-background hover:border-foreground/50 hover:bg-muted transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border/40">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about fragrances..."
              className="flex-1 h-10 rounded-full pl-4 pr-2"
              disabled={loading}
              maxLength={500}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90"
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
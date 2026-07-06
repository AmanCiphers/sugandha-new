import { createClient } from "./supabase/server";
import { PLACEHOLDER_IMAGE } from "@/constants";

function computeStockStatus(variants) {
  if (!variants?.length) return "out_of_stock";
  const hasStock = variants.some(v => v.stock > 0);
  if (!hasStock) return "out_of_stock";
  const allLow = variants.every(v => v.stock > 0 && v.stock <= v.low_stock_threshold);
  return allLow ? "low_stock" : "in_stock";
}

function transformProduct(product) {
  const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0];
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price || product.base_price;
  const firstVariantId = firstVariant?.id || null;
  const firstVariantSizeMl = firstVariant?.size_ml || null;
  const description = product.full_description || product.short_description || "";
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description,
    price,
    finalPrice: price,
    imageUrl: primaryImage?.url || PLACEHOLDER_IMAGE,
    images: product.images || [],
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: product.reviews?.length || 0,
    brand: product.brand || "Sugandha",
    isNew: product.is_new || false,
    discountType: null,
    discountValue: 0,
    stockStatus: computeStockStatus(product.variants),
    variants: product.variants || [],
    firstVariantId,
    firstVariantSizeMl,
    category: product.category || null,
    pricingType: product.pricing_type,
  };
}

function baseProductQuery(supabase) {
  return supabase
    .from("products")
    .select(`
      id, name, slug, sku, short_description, full_description, base_price, pricing_type,
      brand, is_new, is_featured, is_trending,
      created_at,
      category:categories(id, name, slug),
      variants:product_variants(id, size_ml, price, stock, low_stock_threshold, is_active),
      images:product_images(id, url, alt_text, is_primary),
      reviews:reviews(rating)
    `)
    .eq("is_active", true);
}

export async function getPublishedProducts(options = {}) {
  const supabase = await createClient();
  let query = baseProductQuery(supabase);

  if (options.categorySlug) {
    query = query.eq("category.slug", options.categorySlug);
  }
  if (options.featured) {
    query = query.eq("is_featured", true);
  }
  if (options.trending) {
    query = query.eq("is_trending", true);
  }
  if (options.excludeSlug) {
    query = query.neq("slug", options.excludeSlug);
  }
  if (options.sort === "price_asc") {
    query = query.order("base_price", { ascending: true });
  } else if (options.sort === "price_desc") {
    query = query.order("base_price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data?.map(transformProduct) || [];
}

export async function getProductBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await baseProductQuery(supabase)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return transformProduct(data);
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, parent_id, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function getCategoryBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, parent_id, sort_order")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
  return (data || []).map(t => ({
    id: t.id,
    customerName: t.customer_name,
    quote: t.quote,
  }));
}

export async function getOrdersByUserId(userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, subtotal, shipping_charge, discount_amount,
      total_amount, payment_method, notes, placed_at,
      items:order_items(id, product_name, variant_size, quantity, unit_price, total_price)
    `)
    .eq("user_id", userId)
    .order("placed_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data || [];
}

export async function getOrderByOrderNumber(orderNumber) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, subtotal, shipping_charge, discount_amount,
      total_amount, payment_method, notes, placed_at,
      shipping_address:addresses(id, label, full_name, phone, line1, line2, city, state, pincode),
      items:order_items(id, product_name, variant_size, quantity, unit_price, total_price)
    `)
    .eq("order_number", orderNumber)
    .single();

  if (error) return null;
  return data;
}

export async function getAddressesByUserId(userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
  return data || [];
}

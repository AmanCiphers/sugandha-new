import { createAdminClient } from "./supabase/admin";

export async function getAdminProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, sku, short_description, base_price, pricing_type, is_active, is_new, is_featured, created_at,
      category:categories(id, name, slug),
      variants:product_variants(id, size_ml, price, stock, low_stock_threshold, is_active),
      images:product_images(id, url, is_primary)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
  return (data || []).map(p => ({
    ...p,
    categoryName: p.category?.name || "Uncategorized",
    totalStock: p.variants?.reduce((s, v) => s + v.stock, 0) || 0,
    primaryPrice: p.variants?.[0]?.price || p.base_price,
  }));
}

export async function getAdminOrders() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, user_id, status, subtotal, shipping_charge, discount_amount,
      total_amount, payment_method, notes, placed_at,
      items:order_items(id, product_name, quantity, total_price),
      profile:profiles(id, email, full_name)
    `)
    .order("placed_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }
  return (data || []).map(o => ({
    ...o,
    customerName: o.profile?.full_name || o.profile?.email || "Unknown",
    itemCount: o.items?.length || 0,
  }));
}

export async function getAdminOrderById(orderId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, user_id, status, subtotal, shipping_charge, discount_amount,
      total_amount, payment_method, notes, placed_at,
      items:order_items(id, product_name, variant_size, quantity, unit_price, total_price),
      shipping_address:addresses(id, label, full_name, phone, line1, line2, city, state, pincode),
      profile:profiles(id, email, full_name)
    `)
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data;
}

export async function getAdminUsers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id, email, full_name, role, created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }

  // Enrich with order counts
  const enriched = await Promise.all(
    (data || []).map(async (u) => {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", u.id);

      return { ...u, orderCount: count || 0 };
    })
  );

  return enriched;
}

export async function getAdminUserById(userId) {
  const supabase = createAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`id, email, full_name, role, created_at`)
    .eq("id", userId)
    .single();

  if (error) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select(`id, order_number, status, total_amount, placed_at`)
    .eq("user_id", userId)
    .order("placed_at", { ascending: false })
    .limit(10);

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId);

  return {
    ...profile,
    orders: orders || [],
    addresses: addresses || [],
    totalOrders: orders?.length || 0,
    totalSpent: orders?.reduce((s, o) => s + Number(o.total_amount), 0) || 0,
  };
}

export async function getAdminCategories() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id, name, slug, description, parent_id, sort_order,
      product_count:products(count)
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching admin categories:", error);
    return [];
  }
  return (data || []).map(c => ({
    ...c,
    productCount: c.product_count?.[0]?.count || 0,
  }));
}

export async function getAdminCoupons() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin coupons:", error);
    return [];
  }
  return data || [];
}

export async function getAdminTestimonials() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching admin testimonials:", error);
    return [];
  }
  return (data || []).map(t => ({
    id: t.id,
    customerName: t.customer_name,
    quote: t.quote,
    isActive: t.is_active,
    sortOrder: t.sort_order,
  }));
}

export async function getAdminInventory() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select(`
      id, size_ml, price, stock, low_stock_threshold, is_active, created_at,
      product:products(id, name, slug)
    `)
    .order("stock", { ascending: true });

  if (error) {
    console.error("Error fetching admin inventory:", error);
    return [];
  }
  return (data || []).map(v => {
    const available = v.stock;
    let status = "out_of_stock";
    if (available > 0 && available <= v.low_stock_threshold) status = "low_stock";
    else if (available > 0) status = "in_stock";
    return {
      id: v.id,
      productName: v.product?.name || "Unknown",
      productSlug: v.product?.slug || "",
      sku: v.product?.slug || "",
      sizeMl: v.size_ml,
      stock: v.stock,
      available,
      lowStockThreshold: v.low_stock_threshold,
      status,
    };
  });
}

export async function getAdminDashboard() {
  const supabase = createAdminClient();

  const [{ count: totalOrders }, { data: recentOrders }, { count: totalCustomers }, { data: lowStock }] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id, order_number, status, total_amount, placed_at, profile:profiles(full_name)").order("placed_at", { ascending: false }).limit(5),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
      supabase.from("product_variants").select("id, stock, low_stock_threshold, product:products(name)").lte("stock", "low_stock_threshold").gt("stock", 0),
    ]);

  const { data: allOrders } = await supabase
    .from("orders")
    .select("total_amount, status");

  const totalRevenue = allOrders?.reduce((s, o) => s + Number(o.total_amount), 0) || 0;
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const pendingOrders = allOrders?.filter(o => o.status === "pending").length || 0;

  return {
    totalRevenue,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    avgOrderValue,
    pendingOrders,
    lowStockItems: lowStock?.length || 0,
    recentOrders: (recentOrders || []).map(o => ({
      id: o.id,
      order_number: o.order_number,
      customer_name: o.profile?.full_name || "Unknown",
      status: o.status,
      total_amount: Number(o.total_amount),
    })),
  };
}

export async function getAdminSettings() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  if (error) {
    return {
      store_name: "Sugandha",
      store_email: "",
      store_phone: "",
      free_shipping_threshold: 499,
      delivery_charge: 99,
      return_period_days: 7,
    };
  }
  return data;
}

export async function getAdminHomepageSections() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching homepage sections:", error);
    return [];
  }
  return data || [];
}

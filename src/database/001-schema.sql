-- ============================================================
-- SUGANDHA E-COMMERCE — COMPLETE DATABASE SCHEMA
-- ============================================================
-- Run this entire file in your Supabase SQL editor.
-- It creates everything: tables, enums, constraints, indexes,
-- triggers, RLS policies, and seed data.
-- ============================================================

-- ################################################################
-- SECTION 1: ENUMS
-- ################################################################
-- PostgreSQL enums restrict column values to a fixed set.
-- Better than strings because invalid values are rejected
-- at the database level.

CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'packed', 'shipped',
  'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'
);
CREATE TYPE pricing_type AS ENUM ('per_ml', 'per_unit');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- ################################################################
-- SECTION 2: TABLES
-- ################################################################

-- -----------------------------------
-- 2.1 PROFILES
-- -----------------------------------
-- Extends Supabase Auth's built-in auth.users table.
-- Every user who signs up automatically gets a row here
-- via the trigger at the bottom of this file.
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.2 CATEGORIES
-- -----------------------------------
-- Self-referencing: parent_id creates a hierarchy.
-- E.g. "Attars" is a child of "Perfumes" (parent_id = perfumes.id).
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.3 PRODUCTS
-- -----------------------------------
-- pricing_type determines how price is calculated:
--   'per_ml'  → final price = base_price × selected size in ml
--   'per_unit' → final price = base_price (flat, for car perfumes)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT,
  short_description TEXT,
  full_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  pricing_type pricing_type NOT NULL DEFAULT 'per_ml',
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.4 PRODUCT VARIANTS
-- -----------------------------------
-- Each product has multiple size options.
-- An attar with price_per_ml=55 gets 3 variants:
--   (3ml, price=165), (6ml, price=330), (12ml, price=660)
-- A car perfume gets 1 variant with flat price.
-- stock tracks how many units of this size are available.
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_ml NUMERIC(5, 1) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- A product can't have two variants with the same size
  UNIQUE(product_id, size_ml)
);

-- -----------------------------------
-- 2.5 PRODUCT IMAGES
-- -----------------------------------
-- Supports multiple images per product (gallery view).
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.6 COUPONS
-- -----------------------------------
-- Discount codes with usage limits and expiry.
-- Defined BEFORE orders since orders reference coupons.
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
  max_discount_amount NUMERIC(10, 2) CHECK (max_discount_amount >= 0),
  usage_limit INTEGER CHECK (usage_limit > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.7 ADDRESSES
-- -----------------------------------
-- Each user can have multiple saved addresses.
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.8 ORDERS
-- -----------------------------------
-- Each order has one status at a time. Status changes
-- are tracked in order_status_history.
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_charge NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_charge >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL DEFAULT 'cod',
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  notes TEXT,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.9 ORDER ITEMS
-- -----------------------------------
-- Snapshots the product name, size, and price at time of purchase.
-- This is critical — if you change a product's price later,
-- existing orders must still show what the customer actually paid.
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,        -- snapshot: product name at time of order
  variant_size NUMERIC(5, 1) NOT NULL, -- snapshot: size in ml
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0), -- snapshot: price per unit
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- -----------------------------------
-- 2.10 ORDER STATUS HISTORY
-- -----------------------------------
-- Every time an order status changes, a row is inserted here.
-- This creates an audit trail: who changed it, when, and why.
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.11 REVIEWS
-- -----------------------------------
-- Customers can review products they've purchased.
-- is_approved must be set to TRUE by an admin before the
-- review appears on the public site.
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One review per user per product
  UNIQUE(product_id, user_id)
);

-- -----------------------------------
-- 2.12 TESTIMONIALS
-- -----------------------------------
-- Shown on the homepage. Managed by admin.
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.13 HOMEPAGE SECTIONS
-- -----------------------------------
-- Controls which sections appear on the homepage and in what order.
-- The section_key values match the keys in your frontend constants.
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.14 STORE SETTINGS
-- -----------------------------------
-- A single-row table. Only one row ever exists.
-- Contains all configurable store settings.
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'Sugandha',
  store_email TEXT,
  store_phone TEXT,
  free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 499,
  delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 99,
  return_period_days INTEGER NOT NULL DEFAULT 7,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.15 NEWSLETTER SUBSCRIBERS
-- -----------------------------------
-- People who subscribed via the footer form.
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.16 CONTACT MESSAGES
-- -----------------------------------
-- Messages submitted through the contact form.
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------
-- 2.17 AUDIT LOGS
-- -----------------------------------
-- Logs every admin action for accountability.
-- old_values and new_values are JSON snapshots showing
-- exactly what changed.
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ################################################################
-- SECTION 3: INDEXES
-- ################################################################
-- Indexes make queries faster. Without them, PostgreSQL has to
-- scan the entire table (slow on large datasets).

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_best_seller ON products(is_best_seller) WHERE is_best_seller = TRUE;
CREATE INDEX idx_products_trending ON products(is_trending) WHERE is_trending = TRUE;

-- Variants
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_active ON product_variants(is_active, stock) WHERE is_active = TRUE;

-- Images
CREATE INDEX idx_images_product ON product_images(product_id);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_placed ON orders(placed_at DESC);

-- Order items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

-- Status history
CREATE INDEX idx_status_history_order ON order_status_history(order_id);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;

-- Addresses
CREATE INDEX idx_addresses_user ON addresses(user_id);

-- Coupons
CREATE INDEX idx_coupons_code ON coupons(code) WHERE is_active = TRUE;

-- Search
-- Full-text search for product names and descriptions.
-- GIN indexes make text searches (ILIKE, to_tsquery) much faster.
CREATE INDEX idx_products_search ON products
  USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(full_description, '')));

-- ################################################################
-- SECTION 4: AUTO-UPDATE TIMESTAMPS
-- ################################################################
-- This function automatically sets updated_at whenever a row changes.
-- Without this, you'd have to manually set updated_at in every UPDATE query.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to every table that has an updated_at column
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ################################################################
-- SECTION 5: AUTO-CREATE PROFILE ON SIGNUP
-- ################################################################
-- When a user signs up via Supabase Auth, a new row is inserted
-- into auth.users. This trigger automatically creates a matching
-- row in public.profiles so you don't have to do it manually.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ################################################################
-- SECTION 6: GENERATE ORDER NUMBER
-- ################################################################
-- Produces a human-readable order number like SGD-ABC123-XYZ.
-- Called automatically when a new order is inserted.

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  timestamp_part := upper(substr(md5(extract(epoch from now())::text), 1, 6));
  random_part := upper(substr(md5(random()::text), 1, 4));
  RETURN 'SGD-' || timestamp_part || '-' || random_part;
END;
$$;

-- ################################################################
-- SECTION 7: ROW LEVEL SECURITY (RLS)
-- ################################################################
-- RLS ensures users can only see/modify their own data at the
-- database level. Even if someone calls the API with a valid
-- anon key, RLS blocks unauthorized access.

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------
-- PUBLIC READ POLICIES
-- Anyone (even anonymous) can read storefront data.
-- These are products, categories, etc. — public information.

CREATE POLICY "Categories: public read" ON categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Products: public read" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Product variants: public read" ON product_variants
  FOR SELECT USING (is_active = TRUE AND stock > 0);

CREATE POLICY "Product images: public read" ON product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Testimonials: public read" ON testimonials
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Homepage sections: public read" ON homepage_sections
  FOR SELECT USING (TRUE);

CREATE POLICY "Store settings: public read" ON store_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Reviews: public read approved" ON reviews
  FOR SELECT USING (is_approved = TRUE);

-- -----------------------
-- CUSTOMER POLICIES
-- Logged-in customers can manage their own data.

CREATE POLICY "Profiles: own read" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Profiles: own update" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Addresses: own all" ON addresses
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Orders: own read" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Order items: own read" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Order status history: own read" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Reviews: own insert" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Registered users can insert contact messages
CREATE POLICY "Contact messages: insert" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

-- Newsletter anyone can subscribe
CREATE POLICY "Newsletter: insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

-- -----------------------
-- ADMIN POLICIES
-- Admins (role = 'admin') can do everything on all tables.
-- This is intentionally broad because admin operations go
-- through the service-role client anyway, but RLS still
-- protects it if someone calls with only the anon key.

CREATE POLICY "Admins: full access" ON profiles
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON categories
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON products
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON product_variants
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON product_images
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON orders
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON order_items
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON order_status_history
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON reviews
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON testimonials
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON coupons
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON homepage_sections
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON store_settings
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON newsletter_subscribers
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON contact_messages
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins: full access" ON audit_logs
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- ################################################################
-- SECTION 8: SEED DATA
-- ################################################################
-- Populates the database with initial data so the storefront
-- has content from day one.

-- Categories (with hierarchy)
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
  ('Perfumes', 'perfumes', 'Premium alcohol-based fragrances', NULL, 1),
  ('Attars', 'attars', 'Traditional oil-based perfumes', NULL, 2),
  ('Car Perfumes', 'car-perfumes', 'Freshen up your ride', NULL, 3),
  ('Incense', 'incense', 'Aromatic spiritual fragrances', NULL, 4),
  ('Gift Sets', 'gift-sets', 'Curated fragrance bundles', NULL, 5);

-- Homepage sections (matches the constants in your frontend)
INSERT INTO homepage_sections (section_key, is_visible, sort_order) VALUES
  ('hero', TRUE, 1),
  ('best_sellers', TRUE, 2),
  ('categories', TRUE, 3),
  ('featured', TRUE, 4),
  ('trending', TRUE, 5),
  ('why_choose_us', TRUE, 6),
  ('testimonials', TRUE, 7),
  ('newsletter', TRUE, 8);

-- Store settings (single row)
INSERT INTO store_settings (store_name, store_email, store_phone, free_shipping_threshold, delivery_charge, return_period_days)
VALUES ('Sugandha', 'hello@sugandha.com', '+91 98765 43210', 499, 99, 7);

-- Sample products (Attars)
INSERT INTO products (name, slug, brand, short_description, full_description, category_id, pricing_type, base_price, is_featured, is_best_seller, is_trending, is_new)
VALUES
  ('Royal Oud Attar', 'royal-oud-attar', 'Sugandha', 'Sweet warm Arabic fragrance', 'An exquisite Arabic fragrance with warm spicy notes and subtle sweetness. Perfect for evening wear.', (SELECT id FROM categories WHERE slug = 'attars'), 'per_ml', 55, TRUE, TRUE, TRUE, FALSE),
  ('Creed Aventus Inspired', 'creed-aventus-inspired', 'Sugandha', 'Fresh, smoky, luxurious masculine', 'A masterful blend of fresh pineapple, smoky birch, and luxurious musk. Inspired by the iconic Creed Aventus.', (SELECT id FROM categories WHERE slug = 'attars'), 'per_ml', 80, TRUE, TRUE, FALSE, FALSE),
  ('Musk Al Tahara', 'musk-al-tahara', 'Sugandha', 'Soft clean powdery musk', 'A pristine white musk fragrance that embodies purity and elegance. Long-lasting and versatile.', (SELECT id FROM categories WHERE slug = 'attars'), 'per_ml', 70, FALSE, TRUE, FALSE, FALSE),
  ('Rose Petal Attar', 'rose-petal-attar', 'Sugandha', 'Pure rose fragrance', 'Handcrafted from the finest rose petals. A timeless floral attar that captures the essence of a blooming garden.', (SELECT id FROM categories WHERE slug = 'attars'), 'per_ml', 60, TRUE, FALSE, FALSE, TRUE),
  ('Sandalwood Essence', 'sandalwood-essence', 'Sugandha', 'Rich woody sandalwood', 'Pure Mysore sandalwood oil. Grounding, meditative, and deeply aromatic.', (SELECT id FROM categories WHERE slug = 'attars'), 'per_ml', 85, FALSE, FALSE, TRUE, FALSE),
  ('Arabian Kasturi', 'arabian-kasturi', 'Sugandha', 'Rich musky oriental fragrance', 'A traditional Arabian musk blend with deep oriental notes. Warm and captivating.', (SELECT id FROM categories WHERE slug = 'attars'), 'per_ml', 50, FALSE, FALSE, FALSE, FALSE),

  -- Sample products (Car Perfumes)
  ('Ocean Breeze Car Perfume', 'ocean-breeze-car-perfume', 'Sugandha', 'Fresh oceanic fragrance for your car', 'Keep your car smelling like a coastal breeze. Long-lasting fragrance oil designed specifically for automotive use.', (SELECT id FROM categories WHERE slug = 'car-perfumes'), 'per_unit', 350, TRUE, TRUE, TRUE, FALSE),
  ('Leather & Spice Car Perfume', 'leather-spice-car-perfume', 'Sugandha', 'Premium leather fragrance for cars', 'A sophisticated blend of leather and warm spices. Perfect for luxury car owners.', (SELECT id FROM categories WHERE slug = 'car-perfumes'), 'per_unit', 350, FALSE, FALSE, FALSE, TRUE);

-- Product variants for attars (3ml, 6ml, 12ml)
-- Each product gets 3 variants with prices calculated as base_price × size
INSERT INTO product_variants (product_id, size_ml, price, stock, low_stock_threshold)
SELECT id, 3, ROUND(base_price * 3, 0), 50, 5 FROM products WHERE pricing_type = 'per_ml' AND is_active = TRUE
UNION ALL
SELECT id, 6, ROUND(base_price * 6, 0), 50, 5 FROM products WHERE pricing_type = 'per_ml' AND is_active = TRUE
UNION ALL
SELECT id, 12, ROUND(base_price * 12, 0), 50, 5 FROM products WHERE pricing_type = 'per_ml' AND is_active = TRUE;

-- Product variants for car perfumes (single 10ml variant at flat price)
INSERT INTO product_variants (product_id, size_ml, price, stock, low_stock_threshold)
SELECT p.id, 10, p.base_price, 100, 10
FROM products p
WHERE p.pricing_type = 'per_unit' AND p.is_active = TRUE;

-- Sample testimonials
INSERT INTO testimonials (customer_name, quote, is_active, sort_order) VALUES
  ('Priya Sharma', 'Absolutely love the Royal Oud Attar. The scent lasts all day and everyone compliments me on it!', TRUE, 1),
  ('Rahul Verma', 'The car perfumes are amazing. My car smells like a luxury showroom now.', TRUE, 2),
  ('Ananya Patel', 'Best attars I have ever bought. Pure, authentic, and long-lasting. Highly recommended!', TRUE, 3),
  ('Vikram Singh', 'Fast delivery and beautiful packaging. The gift set was perfect for my wife''s birthday.', TRUE, 4);

-- Sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active, expires_at) VALUES
  ('WELCOME10', '10% off for first-time customers', 'percentage', 10, 499, 100, TRUE, NOW() + INTERVAL '1 year'),
  ('FLAT200', 'Flat ₹200 off on orders above ₹999', 'fixed', 200, 999, 50, TRUE, NOW() + INTERVAL '6 months'),
  ('FREESHIP', 'Free shipping on any order', 'fixed', 99, 0, 200, TRUE, NOW() + INTERVAL '3 months');

-- ################################################################
-- SECTION 9: CREATE FIRST ADMIN USER
-- ################################################################
-- After running this schema, go to your Supabase dashboard:
-- 1. Authentication → Users → Invite user
-- 2. Enter your email and a password
-- 3. Then run the query below REPLACING the email with yours:
--
--    UPDATE profiles SET role = 'admin'
--    WHERE email = 'your-email@example.com';

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================

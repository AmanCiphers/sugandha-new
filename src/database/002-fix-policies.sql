-- Create a security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
$$;

-- Fix categories public read policy
DROP POLICY IF EXISTS "Categories: public read" ON categories;
CREATE POLICY "Categories: public read" ON categories
  FOR SELECT USING (TRUE);

-- Fix products public read policy (remove short_description from USING)
DROP POLICY IF EXISTS "Products: public read" ON products;
CREATE POLICY "Products: public read" ON products
  FOR SELECT USING (is_active = TRUE);

-- Drop all old admin policies that cause infinite recursion
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['profiles','categories','products','product_variants','product_images','orders','order_items','order_status_history','reviews','testimonials','coupons','homepage_sections','store_settings','newsletter_subscribers','contact_messages','audit_logs'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admins: full access" ON %I', tbl);
    EXECUTE format('CREATE POLICY "Admins: full access" ON %I FOR ALL USING (public.is_admin())', tbl);
  END LOOP;
END;
$$;

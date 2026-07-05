-- Add SKU column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Create a sequence per category prefix
CREATE SEQUENCE IF NOT EXISTS sku_attars START 1;
CREATE SEQUENCE IF NOT EXISTS sku_perfumes START 1;
CREATE SEQUENCE IF NOT EXISTS sku_car_perfumes START 1;
CREATE SEQUENCE IF NOT EXISTS sku_incense START 1;
CREATE SEQUENCE IF NOT EXISTS sku_gift_sets START 1;

-- Function to generate SKU based on category slug
CREATE OR REPLACE FUNCTION public.generate_sku()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cat_slug TEXT;
  prefix TEXT;
  seq_name TEXT;
  next_num INTEGER;
BEGIN
  -- Get category slug
  SELECT slug INTO cat_slug FROM public.categories WHERE id = NEW.category_id;
  
  -- Determine prefix
  prefix := CASE cat_slug
    WHEN 'attars' THEN 'A'
    WHEN 'perfumes' THEN 'P'
    WHEN 'car-perfumes' THEN 'CP'
    WHEN 'incense' THEN 'I'
    WHEN 'gift-sets' THEN 'GS'
    ELSE 'PRD'
  END;
  
  -- Build sequence name
  seq_name := 'sku_' || replace(cat_slug, '-', '_');
  
  -- Get next value
  EXECUTE format('SELECT nextval(%L)', seq_name) INTO next_num;
  
  NEW.sku := prefix || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate SKU on insert
DROP TRIGGER IF EXISTS trg_generate_sku ON products;
CREATE TRIGGER trg_generate_sku
  BEFORE INSERT ON products
  FOR EACH ROW
  WHEN (NEW.sku IS NULL)
  EXECUTE FUNCTION public.generate_sku();

-- Generate SKUs for existing products
DO $$
DECLARE
  p RECORD;
  cat_slug TEXT;
  prefix TEXT;
  seq_name TEXT;
  next_num INTEGER;
BEGIN
  FOR p IN SELECT id, category_id FROM public.products WHERE sku IS NULL ORDER BY created_at
  LOOP
    SELECT slug INTO cat_slug FROM public.categories WHERE id = p.category_id;
    prefix := CASE cat_slug
      WHEN 'attars' THEN 'A'
      WHEN 'perfumes' THEN 'P'
      WHEN 'car-perfumes' THEN 'CP'
      WHEN 'incense' THEN 'I'
      WHEN 'gift-sets' THEN 'GS'
      ELSE 'PRD'
    END;
    seq_name := 'sku_' || replace(cat_slug, '-', '_');
    EXECUTE format('SELECT nextval(%s)', quote_literal(seq_name)) INTO next_num;
    UPDATE public.products SET sku = prefix || '-' || LPAD(next_num::TEXT, 3, '0') WHERE id = p.id;
  END LOOP;
END;
$$;

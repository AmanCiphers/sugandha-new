-- Fix: qualify sequence names with public schema
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
  SELECT slug INTO cat_slug FROM public.categories WHERE id = NEW.category_id;

  prefix := CASE cat_slug
    WHEN 'attars' THEN 'A'
    WHEN 'perfumes' THEN 'P'
    WHEN 'car-perfumes' THEN 'CP'
    WHEN 'incense' THEN 'I'
    WHEN 'gift-sets' THEN 'GS'
    ELSE 'PRD'
  END;

  seq_name := 'sku_' || replace(cat_slug, '-', '_');

  EXECUTE format('SELECT nextval(%L)', 'public.' || seq_name) INTO next_num;

  NEW.sku := prefix || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

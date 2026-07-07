-- Add image_url column to categories for hero/banner images

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing categories with placeholder images
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop&auto=format' WHERE image_url IS NULL;

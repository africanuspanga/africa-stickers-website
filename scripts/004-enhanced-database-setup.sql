-- Enhanced database setup with proper constraints and triggers
-- This script enhances the existing database with better functionality

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add additional useful columns if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT;

ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create admin users table for authentication (optional)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users
CREATE POLICY "Allow authenticated admin access" ON admin_users
  FOR ALL USING (true);

-- Create image uploads tracking table
CREATE TABLE IF NOT EXISTS image_uploads (
  id SERIAL PRIMARY KEY,
  public_id VARCHAR(255) NOT NULL,
  secure_url TEXT NOT NULL,
  original_filename VARCHAR(255),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  format VARCHAR(10),
  resource_type VARCHAR(20) DEFAULT 'image',
  folder VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on image_uploads
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for image uploads
CREATE POLICY "Allow public read access on image_uploads" ON image_uploads
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage image_uploads" ON image_uploads
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_price ON product_variants(price);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_active ON product_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_image_uploads_public_id ON image_uploads(public_id);

-- Update existing products with some sample pricing and stock
UPDATE products SET 
  price = CASE 
    WHEN id = 1 THEN 25.00  -- Color Vinyl Stickers
    WHEN id = 2 THEN 45.00  -- Wrapping Stickers
    WHEN id = 3 THEN 35.00  -- Reflective Sheeting
    WHEN id = 4 THEN 55.00  -- EGP Reflective Sheeting
    WHEN id = 5 THEN 30.00  -- Wood & Marble Stickers
    WHEN id = 6 THEN 28.00  -- Self-Adhesive Vinyl
    WHEN id = 7 THEN 15.00  -- Sticker Tools
    WHEN id = 8 THEN 20.00  -- Headlight Stickers
    WHEN id = 9 THEN 40.00  -- 3M Reflective Tapes
    WHEN id = 10 THEN 35.00 -- Gold & Chrome Mirror
    WHEN id = 11 THEN 25.00 -- Tinted Stickers
    WHEN id = 12 THEN 22.00 -- Frost Stickers
    ELSE 25.00
  END,
  stock_quantity = 100,
  is_active = true,
  meta_title = name,
  meta_description = description
WHERE price IS NULL;

-- Update product variants with pricing
UPDATE product_variants SET 
  price = CASE 
    WHEN product_id = 1 THEN 25.00
    WHEN product_id = 2 THEN 45.00
    WHEN product_id = 3 THEN 35.00
    WHEN product_id = 9 THEN 40.00
    ELSE 25.00
  END,
  stock_quantity = 50,
  is_active = true
WHERE price IS NULL;

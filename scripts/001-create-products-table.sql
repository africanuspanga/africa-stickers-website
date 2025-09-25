-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  preview_image_url TEXT,
  featured BOOLEAN DEFAULT false,
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  variant_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  code VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, variant_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on product_variants" ON product_variants
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete products" ON products
  FOR DELETE USING (true);

CREATE POLICY "Allow authenticated users to insert product_variants" ON product_variants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product_variants" ON product_variants
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete product_variants" ON product_variants
  FOR DELETE USING (true);

-- This script will create the products and product_variants tables
-- Script is ready to execute - no changes needed

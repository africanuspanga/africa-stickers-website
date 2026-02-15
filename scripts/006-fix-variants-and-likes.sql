-- 006-fix-variants-and-likes.sql
-- Purpose:
-- 1) Make product likes available with sensible defaults
-- 2) Align product_variants schema with current app code
-- 3) Keep policies/indexes/triggers consistent so variant upload/display works

-- ----------------------------
-- PRODUCTS: likes_count
-- ----------------------------
ALTER TABLE products
ADD COLUMN IF NOT EXISTS likes_count INTEGER;

UPDATE products
SET likes_count = (FLOOR(RANDOM() * 16) + 10)::INTEGER
WHERE likes_count IS NULL;

ALTER TABLE products
ALTER COLUMN likes_count SET DEFAULT ((FLOOR(RANDOM() * 16) + 10)::INTEGER);

ALTER TABLE products
ALTER COLUMN likes_count SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_likes_count ON products(likes_count);

-- ----------------------------
-- PRODUCT_VARIANTS: schema compatibility
-- ----------------------------
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS variant_name TEXT,
ADD COLUMN IF NOT EXISTS variant_name_sw TEXT,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'product_variants'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'UPDATE product_variants SET variant_name = COALESCE(variant_name, name) WHERE variant_name IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'product_variants'
      AND column_name = 'variant_id'
  ) THEN
    EXECUTE 'UPDATE product_variants SET variant_name = COALESCE(variant_name, variant_id) WHERE variant_name IS NULL';
  END IF;
END $$;

UPDATE product_variants
SET variant_name = CONCAT('Variant ', id)
WHERE variant_name IS NULL;

UPDATE product_variants
SET quantity = 0
WHERE quantity IS NULL;

UPDATE product_variants
SET display_order = 0
WHERE display_order IS NULL;

ALTER TABLE product_variants
ALTER COLUMN variant_name SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_product_variants_product_display_order
  ON product_variants(product_id, display_order, id);

-- Keep updated_at in sync automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------
-- RLS policies (idempotent)
-- ----------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Allow public read access on products'
  ) THEN
    CREATE POLICY "Allow public read access on products" ON products
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Allow authenticated users to insert products'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert products" ON products
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Allow authenticated users to update products'
  ) THEN
    CREATE POLICY "Allow authenticated users to update products" ON products
      FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Allow authenticated users to delete products'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete products" ON products
      FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_variants'
      AND policyname = 'Allow public read access on product_variants'
  ) THEN
    CREATE POLICY "Allow public read access on product_variants" ON product_variants
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_variants'
      AND policyname = 'Allow authenticated users to insert product_variants'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert product_variants" ON product_variants
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_variants'
      AND policyname = 'Allow authenticated users to update product_variants'
  ) THEN
    CREATE POLICY "Allow authenticated users to update product_variants" ON product_variants
      FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_variants'
      AND policyname = 'Allow authenticated users to delete product_variants'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete product_variants" ON product_variants
      FOR DELETE USING (true);
  END IF;
END $$;

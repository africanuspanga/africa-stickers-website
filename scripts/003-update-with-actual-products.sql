-- Clear existing products and reset with actual products
DELETE FROM product_variants;
DELETE FROM products;

-- Insert the actual 12 products from the user's screenshots
INSERT INTO products (id, name, description, category, slug, featured, specifications) VALUES
(1, 'Color Vinyl Stickers', 'Stika za vinyl zenye rangi mbalimbali', 'vinyl', 'color-vinyl-stickers', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(2, 'Wrapping Stickers', 'Stika za kufunika magari au vifaa kwa mwonekano wa kisasa', 'wrapping', 'wrapping-stickers', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(3, 'Reflective Sheeting', 'Soft and Hard Materials (kwa barabara, Mabango, Magari n.k.)', 'reflective', 'reflective-sheeting', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(4, 'EGP Reflective Sheeting', 'Sheeting za EGP zenye mwanga mkali na uimara kwa alama za barabarani na matumizi ya usalama', 'reflective', 'egp-reflective-sheeting', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(5, 'Wood & Marble Stickers', 'Stika zenye muonekano au muundo wa mbao na marumaru', 'decorative', 'wood-marble-stickers', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(6, 'Self-Adhesive Vinyl', 'Vinyl yenye gundi tayari kwa matumizi mbalimbali ya Kuprint', 'vinyl', 'self-adhesive-vinyl', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(7, 'Sticker Tools', 'Vifaa vya kubandikia au kufanya kazi na stika', 'tools', 'sticker-tools', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(8, 'Headlight Stickers', 'Stika za kufunika au kulinda taa za magari na pikipiki', 'automotive', 'headlight-stickers', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(9, '3M Reflective Tapes', 'Tepu maalumu zinazotumika katika magari kwa lengo la usalama', 'reflective', '3m-reflective-tapes', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(10, 'Gold & Chrome Mirror', 'Stika zenye mwonekano wa kioo', 'decorative', 'gold-chrome-mirror', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(11, 'Tinted Stickers', 'Stika za tint (kivuli kwa madirisha na vioo)', 'automotive', 'tinted-stickers', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(12, 'Frost Stickers', 'Stika za kutoa mwonekano wa ukungu/frost kwenye vioo', 'decorative', 'frost-stickers', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  slug = EXCLUDED.slug,
  featured = EXCLUDED.featured,
  specifications = EXCLUDED.specifications;

-- Insert some basic product variants for the main products
INSERT INTO product_variants (product_id, variant_id, name, code) VALUES
(1, '1', 'Red Vinyl', 'CVS-001'),
(1, '2', 'Blue Vinyl', 'CVS-002'),
(1, '3', 'Gold Vinyl', 'CVS-003'),
(2, '4', 'Carbon Fiber', 'WS-001'),
(2, '5', 'Matte Black', 'WS-002'),
(3, '6', 'White Reflective', 'RS-001'),
(3, '7', 'Yellow Reflective', 'RS-002'),
(9, '8', '3M White Tape', '3M-001'),
(9, '9', '3M Red Tape', '3M-002')
ON CONFLICT (product_id, variant_id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code;

-- Reset sequence to continue from the highest ID
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));

-- Insert initial products from the static data
INSERT INTO products (id, name, description, category, slug, featured, specifications) VALUES
(1, 'Color Vinyl Stickers', 'Stika za vinyl zenye rangi mbalimbali', 'vinyl', 'color-vinyl-stickers', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(2, 'Wrapping Stickers', 'Stika za kufunika magari au vifaa kwa mwonekano wa kisasa', 'wrapping', 'wrapping-stickers', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(3, 'Reflective Sheeting', 'Soft and Hard Materials (kwa barabara, Mabango, Magari n.k.)', 'reflective', 'reflective-sheeting', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(4, 'EGP Reflective Sheeting', 'Sheeting za EGP zenye mwanga mkali na uimara kwa alama za barabarani na matumizi ya usalama', 'reflective', 'egp-reflective-sheeting', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(5, 'Decorative Stickers', 'Stika za mapambo kwa nyumba, ofisi na mazingira mbalimbali', 'decorative', 'decorative-stickers', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(6, 'Automotive Stickers', 'Stika maalum za magari zenye uimara na mwonekano wa kisasa', 'automotive', 'automotive-stickers', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(7, 'Transfer Stickers', 'Stika za kuhamishia kwa matumizi ya kibinafsi na kibiashara', 'transfer', 'transfer-stickers', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(8, 'Custom Design Stickers', 'Stika za kawaida kulingana na mahitaji yako maalum', 'custom', 'custom-design-stickers', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(9, 'Installation Tools', 'Vifaa vya uongezaji wa stika kwa matokeo bora', 'tools', 'installation-tools', false, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}'),
(10, 'Maintenance Kit', 'Kifurushi cha kudumisha na kusafisha stika', 'tools', 'maintenance-kit', true, '{"material": "Premium Quality", "thickness": "Standard", "adhesive": "Permanent"}')
ON CONFLICT (id) DO NOTHING;

-- Insert product variants
INSERT INTO product_variants (product_id, variant_id, name, code) VALUES
(1, '1', 'Red Vinyl', 'CVS-001'),
(1, '2', 'Blue Vinyl', 'CVS-002'),
(1, '3', 'Gold Vinyl', 'CVS-003'),
(2, '4', 'Carbon Fiber', 'WS-001'),
(2, '5', 'Matte Black', 'WS-002'),
(3, '6', 'White Reflective', 'RS-001'),
(3, '7', 'Yellow Reflective', 'RS-002')
ON CONFLICT (product_id, variant_id) DO NOTHING;

-- Reset sequence to continue from the highest ID
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));

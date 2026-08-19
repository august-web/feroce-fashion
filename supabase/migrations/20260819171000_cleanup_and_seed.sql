-- Drop leftover tables from old schema
drop table if exists wishlist_items cascade;
drop table if exists product_collections cascade;

-- Seed categories
insert into categories (id, name, slug, sort_order) values
  ('a0000001-0000-0000-0000-000000000001', 'Women''s', 'womens', 1),
  ('a0000001-0000-0000-0000-000000000002', 'Men''s', 'mens', 2),
  ('a0000001-0000-0000-0000-000000000003', 'Quilted', 'quilted', 3),
  ('a0000001-0000-0000-0000-000000000004', 'Crossbody', 'crossbody', 4)
on conflict (slug) do nothing;

-- Seed products
insert into products (id, category_id, name, slug, description, price, image_urls, color, stock, active, is_new) values
  ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001',
   'Féroce Cream Quilted Mini', 'feroce-cream-quilted-mini',
   'Cream quilted leather with gold F monogram and chain strap. The signature mini — delicate structure, fierce attitude.',
   32500,
   ARRAY['/images/products/quilted-cream/product-1.jpg'],
   'Cream', 30, true, true),

  ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004',
   'Féroce Denim Monogram Mini', 'feroce-denim-monogram-mini',
   'Blue denim monogram quilted mini with gold chain. Street-luxury, Féroce style.',
   29500,
   ARRAY['/images/products/quilted-blue/product-1.jpg', '/images/products/quilted-blue/product-2.jpg'],
   'Denim Blue', 25, true, true),

  ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001',
   'Féroce Burgundy Satchel', 'feroce-burgundy-satchel',
   'Structured burgundy leather with gold F clasp. Bold color, timeless shape.',
   38500,
   ARRAY['/images/products/burgundy-structured/product-1.jpg', '/images/products/burgundy-structured/product-2.jpg', '/images/products/burgundy-structured/product-3.jpg'],
   'Burgundy', 20, true, false),

  ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001',
   'Féroce Navy Satchel', 'feroce-navy-satchel',
   'Navy structured satchel with gold-plated F logo hardware. The dark essential.',
   35500,
   ARRAY['/images/products/navy-structured/product-1.jpg', '/images/products/navy-structured/product-2.jpg', '/images/products/navy-structured/product-3.jpg', '/images/products/navy-structured/product-4.jpg'],
   'Navy', 35, true, true),

  ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002',
   'Féroce Denim Satchel', 'feroce-denim-satchel',
   'Dark denim with gold F monogram and brass buckles. Rugged luxury for men.',
   42500,
   ARRAY['/images/products/denim-satchel/product-1.jpg', '/images/products/denim-satchel/product-2.jpg', '/images/products/denim-satchel/product-3.jpg', '/images/products/denim-satchel/product-4.jpg', '/images/products/denim-satchel/product-5.jpg'],
   'Denim Blue', 20, true, true)
on conflict (slug) do nothing;

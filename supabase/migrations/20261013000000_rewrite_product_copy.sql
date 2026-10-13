-- Rewrite storefront product copy in brand voice.
-- Replaces supplier-jargon materials text, fills the three empty entries,
-- and standardizes care instructions across the catalog.
-- Apply in the Supabase dashboard: SQL Editor -> paste -> Run.

UPDATE products SET
  materials = 'Exterior: structured body in smooth black, finished with polished gold-tone hardware. Interior: organized compartment sized for phone, card holder, keys, and lip balm. Adjustable strap — wear at the waist, across the chest, or over the shoulder.',
  care_instructions = 'Wipe clean with a soft, damp cloth and dry promptly. Keep away from prolonged moisture and direct sunlight. Store in the dust bag when not in use.'
WHERE slug = 'feroce-fanny-pack-black';

UPDATE products SET
  materials = 'Exterior: structured body in muted grey, finished with polished gold-tone hardware. Interior: organized compartment sized for phone, card holder, keys, and lip balm. Adjustable strap — wear at the waist, across the chest, or over the shoulder.',
  care_instructions = 'Wipe clean with a soft, damp cloth and dry promptly. Keep away from prolonged moisture and direct sunlight. Store in the dust bag when not in use.'
WHERE slug = 'feroce-fanny-pack-grey';

UPDATE products SET
  materials = 'Exterior: crisp architectural body with a structured top handle, shoulder strap, and gold-tone hardware. Interior: organized compartments for a full day — phone, wallet, keys, and the small emergencies. Holds its shape whether full or not.',
  care_instructions = 'Wipe clean with a soft, damp cloth and dry promptly. Keep away from prolonged moisture and direct sunlight. Store in the dust bag when not in use.'
WHERE slug = 'feroce-satchel-bag';

UPDATE products SET
  materials = 'Exterior: plush premium gold fur with a black flap and polished gold-tone hardware. Interior: red satin lining. Oversized XL silhouette — carries phone, wallet, keys, and makeup, and still closes clean.',
  care_instructions = 'Store in the dust bag. Brush the fur gently, following the direction of the pile. Keep away from moisture and direct heat.'
WHERE slug = 'naji-gold-fur-xl';

UPDATE products SET
  materials = 'Exterior: plush premium fur in deep maroon red with a black flap and polished gold-tone hardware. Interior: golden satin lining. Oversized XL silhouette — carries phone, wallet, keys, and makeup, and still closes clean.',
  care_instructions = 'Store in the dust bag. Brush the fur gently, following the direction of the pile. Keep away from moisture and direct heat.'
WHERE slug = 'naji-maroon-red-fur-xl';

UPDATE products SET
  materials = 'Exterior: premium cream denim quilted with the signature gold F monogram, trimmed with gold-tone hardware. Gold chain strap converts from crossbody to shoulder carry. Mini silhouette sized for phone, card holder, keys, and lipstick.',
  care_instructions = 'Spot clean with mild soap and cold water; air dry. Do not machine wash, bleach, or tumble dry.'
WHERE slug = 'denim-de-ville-cream-gold';

UPDATE products SET
  materials = 'Exterior: premium deep indigo denim quilted with the signature gold F monogram, trimmed with gold-tone hardware. Gold chain strap converts from crossbody to shoulder carry. Compact mini silhouette sized for phone, card holder, keys, and lipstick.',
  care_instructions = 'Spot clean with mild soap and cold water; air dry. Do not machine wash, bleach, or tumble dry.'
WHERE slug = 'denim-de-ville-blue-gold';

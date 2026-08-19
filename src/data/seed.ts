import type { Category, Product } from '@/lib/types'

/** Extended product type for the product page — adds color/size variants */
export interface ProductVariant {
  color: string
  colorHex: string
  inStock: boolean
}

export interface ProductSize {
  label: string
  available: boolean
}

export interface ExtendedProduct extends Product {
  variants: ProductVariant[]
  sizes: ProductSize[]
  materials: string
  careInstructions: string
}

export const SEED_CATEGORIES: Category[] = [
  { id: '1', name: 'Tote', slug: 'tote', sort_order: 1 },
  { id: '2', name: 'Crossbody', slug: 'crossbody', sort_order: 2 },
  { id: '3', name: 'Quilted', slug: 'quilted', sort_order: 3 },
  { id: '4', name: 'Structured', slug: 'structured', sort_order: 4 },
]

/**
 * Real Féroce product photos from the studio shoot.
 *
 * Image convention:
 *  - image_urls[]       → product-only shots (shop grid default + product gallery)
 *  - model_image_urls[] → lifestyle/model shots (hover reveal on shop grid ONLY)
 *
 * Product-to-image mapping (verified from studio shoot):
 *  - quilted-cream/   → Cream/white quilted mini with gold F monogram + chain
 *  - quilted-blue/    → Blue denim monogram quilted mini with chain
 *  - burgundy-structured/ → Burgundy/red structured satchel with gold F clasp
 *  - navy-structured/     → Navy structured bags (satchel, bucket, mini) — most model shots
 *  - denim-satchel/       → Men's dark denim satchel with gold monogram + brass buckles
 */
export const SEED_PRODUCTS: ExtendedProduct[] = [
  {
    id: '1',
    category_id: '3',
    name: 'Féroce Cream Quilted Mini',
    slug: 'feroce-cream-quilted-mini',
    description:
      'Cream quilted leather with gold F monogram and chain strap. The signature mini — delicate structure, fierce attitude.',
    price: 32500,
    image_urls: [
      '/images/products/quilted-cream/product-1.jpg',
    ],
    model_image_urls: [],
    color: 'Cream',
    stock: 30,
    active: true,
    is_new: true,
    created_at: '2026-08-01',
    variants: [
      { color: 'Cream', colorHex: '#F5F0E8', inStock: true },
      { color: 'Black', colorHex: '#1a1a1a', inStock: true },
    ],
    sizes: [{ label: 'One Size', available: true }],
    materials:
      'Diamond-quilted Italian calfskin in ivory cream with gold F monogram embossing. Gold-plated chain-link strap and F clasp. Satin-lined interior.',
    careInstructions:
      'Store in dust bag. Avoid prolonged sun exposure to maintain cream color. Clean with a soft, dry cloth. Polish gold hardware regularly.',
  },
  {
    id: '2',
    category_id: '4',
    name: 'Féroce Denim Monogram Mini',
    slug: 'feroce-denim-monogram-mini',
    description:
      'Blue denim monogram quilted mini with gold chain. Street-luxury, Féroce style.',
    price: 29500,
    image_urls: [
      '/images/products/quilted-blue/product-1.jpg',
      '/images/products/quilted-blue/product-2.jpg',
    ],
    model_image_urls: [
      '/images/products/quilted-blue/model/lifestyle-1.jpg',
    ],
    color: 'Denim Blue',
    stock: 25,
    active: true,
    is_new: true,
    created_at: '2026-08-05',
    variants: [
      { color: 'Denim Blue', colorHex: '#2C4A6E', inStock: true },
      { color: 'Cream', colorHex: '#F5F0E8', inStock: true },
    ],
    sizes: [{ label: 'One Size', available: true }],
    materials:
      'Quilted denim with gold F monogram print. Gold-plated chain strap and magnetic snap closure. Interior card slots.',
    careInstructions:
      'Spot clean denim with mild soap. Avoid machine washing. Air dry. Store flat to maintain quilted shape.',
  },
  {
    id: '3',
    category_id: '4',
    name: 'Féroce Burgundy Satchel',
    slug: 'feroce-burgundy-satchel',
    description:
      'Structured burgundy leather with gold F clasp. Bold color, timeless shape.',
    price: 38500,
    image_urls: [
      '/images/products/burgundy-structured/product-1.jpg',
      '/images/products/burgundy-structured/product-2.jpg',
      '/images/products/burgundy-structured/product-3.jpg',
    ],
    model_image_urls: [
      '/images/products/burgundy-structured/model/lifestyle-1.jpg',
    ],
    color: 'Burgundy',
    stock: 20,
    active: true,
    is_new: false,
    created_at: '2026-07-20',
    variants: [
      { color: 'Burgundy', colorHex: '#722F37', inStock: true },
      { color: 'Navy', colorHex: '#0A1128', inStock: true },
    ],
    sizes: [{ label: 'One Size', available: true }],
    materials:
      'Smooth burgundy calfskin with structured silhouette. Gold-plated F logo hardware and top handles. Magnetic flap closure. Suede-lined interior.',
    careInstructions:
      'Condition leather every 3-6 months. Store stuffed to maintain shape. Keep away from heat sources. Wipe with a damp cloth.',
  },
  {
    id: '4',
    category_id: '4',
    name: 'Féroce Navy Satchel',
    slug: 'feroce-navy-satchel',
    description:
      'Navy structured satchel with gold-plated F logo hardware. The dark essential.',
    price: 35500,
    image_urls: [
      '/images/products/navy-structured/product-1.jpg',
      '/images/products/navy-structured/product-2.jpg',
      '/images/products/navy-structured/product-3.jpg',
      '/images/products/navy-structured/product-4.jpg',
    ],
    model_image_urls: [
      '/images/products/navy-structured/model/lifestyle-1.jpg',
      '/images/products/navy-structured/model/lifestyle-2.jpg',
      '/images/products/navy-structured/model/lifestyle-3.jpg',
      '/images/products/navy-structured/model/lifestyle-4.jpg',
      '/images/products/navy-structured/model/lifestyle-5.jpg',
    ],
    color: 'Navy',
    stock: 35,
    active: true,
    is_new: true,
    created_at: '2026-08-10',
    variants: [
      { color: 'Navy', colorHex: '#0A1128', inStock: true },
      { color: 'Black', colorHex: '#1a1a1a', inStock: true },
    ],
    sizes: [{ label: 'One Size', available: true }],
    materials:
      'Smooth navy calfskin with gold-plated F logo hardware. Structured silhouette with top handle. Available as mini satchel or drawstring bucket bag.',
    careInstructions:
      'Wipe clean with a damp cloth. Condition leather every 3-6 months. Store stuffed to maintain shape. Keep away from direct sunlight.',
  },
  {
    id: '5',
    category_id: '1',
    name: 'Féroce Denim Satchel',
    slug: 'feroce-denim-satchel',
    description:
      'Dark denim with gold F monogram and brass buckles. Rugged luxury for men.',
    price: 42500,
    image_urls: [
      '/images/products/denim-satchel/product-1.jpg',
      '/images/products/denim-satchel/product-2.jpg',
      '/images/products/denim-satchel/product-3.jpg',
      '/images/products/denim-satchel/product-4.jpg',
      '/images/products/denim-satchel/product-5.jpg',
    ],
    model_image_urls: [],
    color: 'Denim Blue',
    stock: 20,
    active: true,
    is_new: true,
    created_at: '2026-08-12',
    variants: [
      { color: 'Denim Blue', colorHex: '#1B3A5C', inStock: true },
      { color: 'Black', colorHex: '#1a1a1a', inStock: true },
    ],
    sizes: [{ label: 'One Size', available: true }],
    materials:
      'Premium dark denim with gold F monogram print. Antique brass buckles and hardware. Reinforced leather shoulder strap. Canvas-lined interior with padded laptop sleeve.',
    careInstructions:
      'Spot clean denim with mild soap. Condition leather strap regularly. Brass hardware will develop natural patina over time.',
  },
]

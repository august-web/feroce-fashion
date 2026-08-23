import type { Category, Product } from '@/lib/types'

export interface ProductVariant {
  color: string
  colorHex: string
  images: string[]
  modelImages: string[]
  stripe_checkout_url: string
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
  { id: '1', name: 'Womens', slug: 'womens', sort_order: 1 },
  { id: '2', name: 'Mens', slug: 'mens', sort_order: 2 },
]

export const SEED_PRODUCTS: ExtendedProduct[] = [
  {
    id: '1', category_id: '1', collection: 'Denim De Ville',
    name: 'Denim De Ville - Blue & Gold', slug: 'denim-de-ville-blue-gold',
    description: 'Handcrafted denim handbag with gold-plated hardware. Blue monogram quilted leather meets street-luxury.',
    price: 35000, compare_at_price: 38000,
    image_urls: ['/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg'],
    model_image_urls: ['/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg', '/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_5.jpg'],
    color: 'Blue & Gold', stock: 20, active: true, is_new: true, preorder: true, created_at: '2026-08-20',
    variants: [{ color: 'Blue & Gold', colorHex: '#2C4A6E', images: ['/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg'], modelImages: ['/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg', '/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_5.jpg'], stripe_checkout_url: 'https://buy.stripe.com/3cIaEZ3HL19A3Nf0V2bV603', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Premium denim with gold F monogram print. Gold-plated chain strap.',
    careInstructions: 'Spot clean with mild soap. Air dry.'
  },
  {
    id: '1b', category_id: '1', collection: 'Denim De Ville',
    name: 'Denim De Ville - Cream & Gold', slug: 'denim-de-ville-cream-gold',
    description: 'Handcrafted cream denim handbag with gold-plated hardware. Ivory monogram quilted leather.',
    price: 35000, compare_at_price: 38000,
    image_urls: ['/images/products/Denim De Ville Collection/Cream & Gold/Denim De Ville Collection -- Cream & Gold.jpg'],
    model_image_urls: ['/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg', '/images/products/Denim De Ville Collection/Cream & Gold/Preview 2.jpg'],
    color: 'Cream & Gold', stock: 20, active: true, is_new: true, preorder: true, created_at: '2026-08-20',
    variants: [{ color: 'Cream & Gold', colorHex: '#F5F0E8', images: ['/images/products/Denim De Ville Collection/Cream & Gold/Denim De Ville Collection -- Cream & Gold.jpg'], modelImages: ['/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg', '/images/products/Denim De Ville Collection/Cream & Gold/Preview 2.jpg'], stripe_checkout_url: 'https://buy.stripe.com/9B6cN7bad9G6gA10V2bV601', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Premium cream denim with gold F monogram print. Gold-plated chain strap.',
    careInstructions: 'Spot clean with mild soap. Air dry.'
  },
  {
    id: '2', category_id: '1', collection: 'Naji',
    name: 'Naji - Gold Fur (XL)', slug: 'naji-gold-fur-xl',
    description: 'Luxurious gold fur-textured handbag with gold hardware. Bold statement, fierce elegance. Size XL',
    price: 44300, compare_at_price: 47800,
    image_urls: ['/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg'],
    model_image_urls: ['/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg', '/images/products/Naji Collection/Gold Fur Bag/Preview 2.jpg', '/images/products/Naji Collection/Gold Fur Bag/Preview 3.jpg'],
    color: 'Gold Fur', stock: 20, active: true, is_new: true, preorder: false, created_at: '2026-08-20',
    variants: [{ color: 'Gold Fur', colorHex: '#D4AF37', images: ['/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg'], modelImages: ['/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg', '/images/products/Naji Collection/Gold Fur Bag/Preview 2.jpg', '/images/products/Naji Collection/Gold Fur Bag/Preview 3.jpg'], stripe_checkout_url: 'https://buy.stripe.com/9B6cN7bad9G6gA10V2bV601', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Luxurious fur-textured exterior with gold-plated F logo hardware.',
    careInstructions: 'Store in dust bag. Brush fur gently.'
  },
  {
    id: '2b', category_id: '1', collection: 'Naji',
    name: 'Naji - Maroon Red Fur (XL)', slug: 'naji-maroon-red-fur-xl',
    description: 'Luxurious maroon red fur-textured handbag with gold hardware. Deep rich tones, fierce elegance. Size: XL',
    price: 44300, compare_at_price: 47800,
    image_urls: ['/images/products/Naji Collection/Maroon Fur Bag/Naji Collection -- Maroon Red Fur.jpg'],
    model_image_urls: ['/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg', '/images/products/Naji Collection/Maroon Fur Bag/Preview 2.jpg', '/images/products/Naji Collection/Maroon Fur Bag/Preview 3.jpg', '/images/products/Naji Collection/Maroon Fur Bag/Preview 4.jpg'],
    color: 'Maroon Red Fur', stock: 20, active: true, is_new: true, preorder: false, created_at: '2026-08-20',
    variants: [{ color: 'Maroon Red Fur', colorHex: '#722F37', images: ['/images/products/Naji Collection/Maroon Fur Bag/Naji Collection -- Maroon Red Fur.jpg'], modelImages: ['/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg', '/images/products/Naji Collection/Maroon Fur Bag/Preview 2.jpg', '/images/products/Naji Collection/Maroon Fur Bag/Preview 3.jpg', '/images/products/Naji Collection/Maroon Fur Bag/Preview 4.jpg'], stripe_checkout_url: 'https://buy.stripe.com/cNi28tgux8C23NfgU0bV600', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Luxurious maroon fur-textured exterior with gold-plated F logo hardware.',
    careInstructions: 'Store in dust bag. Brush fur gently.'
  },
  {
    id: '3', category_id: '2', collection: undefined,
    name: 'Feroce Satchel Bag', slug: 'feroce-satchel-bag',
    description: 'This is a high quality satchel bag for Men. Comes with a smell proof compartment',
    price: 30000, compare_at_price: 35000,
    image_urls: ['https://edbfoszmspjlnihmhlsa.supabase.co/storage/v1/object/public/products/products/1787363840422-3kvb8m.jpg'],
    model_image_urls: [],
    color: 'Black', stock: 20, active: true, is_new: true, preorder: true, created_at: '2026-08-20',
    variants: [{ color: 'Black', colorHex: '#1a1a1a', images: ['https://edbfoszmspjlnihmhlsa.supabase.co/storage/v1/object/public/products/products/1787363840422-3kvb8m.jpg'], modelImages: [], stripe_checkout_url: '', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Premium leather with smell-proof compartment.',
    careInstructions: 'Store in dust bag. Clean with soft cloth.'
  },
  {
    id: '3b', category_id: '2', collection: undefined,
    name: 'Feroce Fanny Pack', slug: 'feroce-fanny-pack',
    description: 'High quality Feroce crossbody bag. Comes with a USB port and a smell proof compartment',
    price: 25000, compare_at_price: 28010,
    image_urls: ['https://edbfoszmspjlnihmhlsa.supabase.co/storage/v1/object/public/products/products/1787363840422-3kvb8m.jpg'],
    model_image_urls: [],
    color: 'Black', stock: 20, active: true, is_new: true, preorder: true, created_at: '2026-08-20',
    variants: [{ color: 'Black', colorHex: '#1a1a1a', images: ['https://edbfoszmspjlnihmhlsa.supabase.co/storage/v1/object/public/products/products/1787363840422-3kvb8m.jpg'], modelImages: [], stripe_checkout_url: '', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Premium leather with USB port and smell-proof compartment.',
    careInstructions: 'Store in dust bag. Clean with soft cloth.'
  },
  {
    id: '3c', category_id: '2', collection: undefined,
    name: 'Feroce Fanny Pack (Without USB port)', slug: 'feroce-fanny-pack-without-usb-port',
    description: "High quality men's crossbody bag.",
    price: 25000, compare_at_price: 28000,
    image_urls: ['https://edbfoszmspjlnihmhlsa.supabase.co/storage/v1/object/public/products/products/1787363840422-3kvb8m.jpg'],
    model_image_urls: [],
    color: 'Black', stock: 20, active: true, is_new: true, preorder: true, created_at: '2026-08-20',
    variants: [{ color: 'Black', colorHex: '#1a1a1a', images: ['https://edbfoszmspjlnihmhlsa.supabase.co/storage/v1/object/public/products/products/1787363840422-3kvb8m.jpg'], modelImages: [], stripe_checkout_url: '', inStock: true }],
    sizes: [{ label: 'One Size', available: true }],
    materials: 'Premium leather crossbody bag.',
    careInstructions: 'Store in dust bag. Clean with soft cloth.'
  },
]

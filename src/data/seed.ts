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
  { id: "1", name: "Womens", slug: "womens", sort_order: 1 },
  { id: "2", name: "Mens", slug: "mens", sort_order: 2 },
]

export const SEED_PRODUCTS: ExtendedProduct[] = [
  { id: "1", category_id: "1", collection: "Denim De Ville", name: "Denim De Ville - Blue & Gold", slug: "denim-de-ville-blue-gold", description: "Handcrafted denim handbag with gold-plated hardware. Blue monogram quilted leather meets street-luxury.", price: 38500, image_urls: ["/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg"], model_image_urls: ["/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg", "/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_5.jpg"], color: "Blue & Gold", stock: 30, active: true, is_new: true, created_at: "2026-08-15", variants: [{ color: "Blue & Gold", colorHex: "#2C4A6E", images: ["/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg"], modelImages: ["/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg", "/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_5.jpg"], stripe_checkout_url: "", inStock: true }], sizes: [{ label: "One Size", available: true }], materials: "Premium denim with gold F monogram print. Gold-plated chain strap.", careInstructions: "Spot clean with mild soap. Air dry." },
  { id: "1b", category_id: "1", collection: "Denim De Ville", name: "Denim De Ville - Cream & Gold", slug: "denim-de-ville-cream-gold", description: "Handcrafted cream denim handbag with gold-plated hardware. Ivory monogram quilted leather.", price: 38500, image_urls: ["/images/products/Denim De Ville Collection/Cream & Gold/Denim De Ville Collection -- Cream & Gold.jpg"], model_image_urls: ["/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg", "/images/products/Denim De Ville Collection/Cream & Gold/Preview 2.jpg"], color: "Cream & Gold", stock: 30, active: true, is_new: true, created_at: "2026-08-16", variants: [{ color: "Cream & Gold", colorHex: "#F5F0E8", images: ["/images/products/Denim De Ville Collection/Cream & Gold/Denim De Ville Collection -- Cream & Gold.jpg"], modelImages: ["/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg", "/images/products/Denim De Ville Collection/Cream & Gold/Preview 2.jpg"], stripe_checkout_url: "", inStock: true }], sizes: [{ label: "One Size", available: true }], materials: "Premium cream denim with gold F monogram print. Gold-plated chain strap.", careInstructions: "Spot clean with mild soap. Air dry." },
  { id: "2", category_id: "1", collection: "Naji", name: "Naji - Gold Fur", slug: "naji-gold-fur", description: "Luxurious gold fur-textured handbag with gold hardware. Bold statement, fierce elegance.", price: 45000, image_urls: ["/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg"], model_image_urls: ["/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg", "/images/products/Naji Collection/Gold Fur Bag/Preview 2.jpg", "/images/products/Naji Collection/Gold Fur Bag/Preview 3.jpg"], color: "Gold Fur", stock: 25, active: true, is_new: true, created_at: "2026-08-18", variants: [{ color: "Gold Fur", colorHex: "#D4AF37", images: ["/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg"], modelImages: ["/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg", "/images/products/Naji Collection/Gold Fur Bag/Preview 2.jpg", "/images/products/Naji Collection/Gold Fur Bag/Preview 3.jpg"], stripe_checkout_url: "", inStock: true }], sizes: [{ label: "One Size", available: true }], materials: "Luxurious fur-textured exterior with gold-plated F logo hardware.", careInstructions: "Store in dust bag. Brush fur gently." },
  { id: "2b", category_id: "1", collection: "Naji", name: "Naji - Maroon Red Fur", slug: "naji-maroon-red-fur", description: "Luxurious maroon red fur-textured handbag with gold hardware. Deep rich tones, fierce elegance.", price: 45000, image_urls: ["/images/products/Naji Collection/Maroon Fur Bag/Naji Collection -- Maroon Red Fur.jpg"], model_image_urls: ["/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg", "/images/products/Naji Collection/Maroon Fur Bag/Preview 2.jpg", "/images/products/Naji Collection/Maroon Fur Bag/Preview 3.jpg", "/images/products/Naji Collection/Maroon Fur Bag/Preview 4.jpg"], color: "Maroon Red Fur", stock: 25, active: true, is_new: true, created_at: "2026-08-19", variants: [{ color: "Maroon Red Fur", colorHex: "#722F37", images: ["/images/products/Naji Collection/Maroon Fur Bag/Naji Collection -- Maroon Red Fur.jpg"], modelImages: ["/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg", "/images/products/Naji Collection/Maroon Fur Bag/Preview 2.jpg", "/images/products/Naji Collection/Maroon Fur Bag/Preview 3.jpg", "/images/products/Naji Collection/Maroon Fur Bag/Preview 4.jpg"], stripe_checkout_url: "", inStock: true }], sizes: [{ label: "One Size", available: true }], materials: "Luxurious maroon fur-textured exterior with gold-plated F logo hardware.", careInstructions: "Store in dust bag. Brush fur gently." },
]

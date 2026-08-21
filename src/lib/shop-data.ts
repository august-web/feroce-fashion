import type { Category } from '@/lib/types'
import { SEED_CATEGORIES } from '@/data/seed'
import { createAdminClient } from '@/lib/supabase/admin'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name'

type SupabaseProduct = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  price: number
  image_urls: string[]
  model_image_urls: string[]
  color: string
  color_hex: string
  collection: string
  materials: string
  care_instructions: string
  careInstructions: string
  stripe_checkout_url: string
  stock: number
  active: boolean
  is_new: boolean
  created_at: string
}

export type ShopProduct = {
  id: string
  category_id: string
  collection: string
  name: string
  slug: string
  description: string
  price: number
  image_urls: string[]
  model_image_urls: string[]
  color: string
  color_hex: string
  materials: string
  care_instructions: string
  careInstructions: string
  stripe_checkout_url: string
  stock: number
  active: boolean
  is_new: boolean
  created_at: string
  variants: Array<{
    color: string
    colorHex: string
    images: string[]
    modelImages: string[]
    stripe_checkout_url: string
    inStock: boolean
  }>
  sizes: Array<{ label: string; available: boolean }>
}

export async function fetchCategories(): Promise<Category[]> {
  return SEED_CATEGORIES
}

export async function fetchProducts(categorySlug?: string): Promise<ShopProduct[]> {
  const supabase = createAdminClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (categorySlug) {
    const cat = SEED_CATEGORIES.find((c) => c.slug === categorySlug)
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  const { data } = await query as { data: SupabaseProduct[] | null }
  if (!data) return []

  return data.map((p) => ({
    ...p,
    model_image_urls: p.model_image_urls || [],
    collection: p.collection || '',
    materials: p.materials || '',
    care_instructions: p.care_instructions || '',
    careInstructions: p.care_instructions || '',
    stripe_checkout_url: p.stripe_checkout_url || '',
    color_hex: p.color_hex || '#0A1128',
    variants: [{
      color: p.color,
      colorHex: p.color_hex || '#0A1128',
      images: p.image_urls || [],
      modelImages: p.model_image_urls || [],
      stripe_checkout_url: p.stripe_checkout_url || '',
      inStock: p.stock > 0,
    }],
    sizes: [{ label: 'One Size', available: p.stock > 0 }],
  }))
}

export function sortProducts(products: ShopProduct[], sort: SortOption): ShopProduct[] {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
    default:
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
}

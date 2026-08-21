import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type ShopProduct = {
  id: string
  category_id: string
  collection: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  preorder?: boolean
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
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  return (data as Category[]) || []
}

export type SortOption = 'newest' | 'price-low' | 'price-high'

export async function fetchProducts(categorySlug?: string): Promise<ShopProduct[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (categorySlug) {
    const { data: cats } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cats) {
      query = query.eq('category_id', cats.id)
    }
  }

  const { data } = await query
  if (!data) return []

  return data.map((p: Record<string, unknown>) => ({
    id: p.id as string,
    category_id: p.category_id as string,
    collection: (p.collection as string) || '',
    name: p.name as string,
    slug: p.slug as string,
    description: (p.description as string) || '',
    price: p.price as number,
    compare_at_price: (p.compare_at_price as number) || undefined,
    preorder: (p.preorder as boolean) || false,
    image_urls: (p.image_urls as string[]) || [],
    model_image_urls: (p.model_image_urls as string[]) || [],
    color: (p.color as string) || '',
    color_hex: (p.color_hex as string) || '#0A1128',
    materials: (p.materials as string) || '',
    care_instructions: (p.care_instructions as string) || '',
    careInstructions: (p.care_instructions as string) || '',
    stripe_checkout_url: (p.stripe_checkout_url as string) || '',
    stock: (p.stock as number) || 0,
    active: p.active as boolean,
    is_new: p.is_new as boolean,
    created_at: p.created_at as string,
    variants: [],
    sizes: [{ label: 'One Size', available: true }],
  }))
}

export function sortProducts(products: ShopProduct[], sort: SortOption): ShopProduct[] {
  const sorted = [...products]
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted
  }
}

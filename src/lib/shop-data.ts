import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/types'
import { SEED_CATEGORIES, SEED_PRODUCTS, type ExtendedProduct } from '@/data/seed'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name'

// ── Fetch functions (Supabase → fallback to seed) ──

export async function fetchCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    if (error || !data?.length) return SEED_CATEGORIES
    return data
  } catch {
    return SEED_CATEGORIES
  }
}

export async function fetchProducts(categorySlug?: string): Promise<ExtendedProduct[]> {
  try {
    const supabase = await createClient()
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

    const result = await query
    const data = result.data as Record<string, unknown>[] | null
    if (result.error || !data?.length) {
      return getSeedProducts(categorySlug)
    }
    // Merge with seed variant data
    return data.map((row) => {
      const seed = SEED_PRODUCTS.find((s) => s.slug === row.slug)
      return {
        id: row.id as string,
        category_id: row.category_id as string,
        name: row.name as string,
        slug: row.slug as string,
        description: row.description as string,
        price: row.price as number,
        image_urls: row.image_urls as string[],
        color: row.color as string,
        stock: row.stock as number,
        active: row.active as boolean,
        is_new: row.is_new as boolean,
        created_at: row.created_at as string,
        variants: seed?.variants || [],
        sizes: seed?.sizes || [],
        materials: seed?.materials || '',
        careInstructions: seed?.careInstructions || '',
      }
    })
  } catch {
    return getSeedProducts(categorySlug)
  }
}

function getSeedProducts(categorySlug?: string): ExtendedProduct[] {
  let filtered = SEED_PRODUCTS.filter((p) => p.active)
  if (categorySlug) {
    const cat = SEED_CATEGORIES.find((c) => c.slug === categorySlug)
    if (cat) {
      filtered = filtered.filter((p) => p.category_id === cat.id)
    }
  }
  return filtered
}

// ── Sort logic ──

export function sortProducts(products: ExtendedProduct[], sort: SortOption): ExtendedProduct[] {
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

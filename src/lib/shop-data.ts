import type { Category } from '@/lib/types'
import { SEED_CATEGORIES, SEED_PRODUCTS, type ExtendedProduct } from '@/data/seed'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name'

// ── Fetch functions (Supabase → fallback to seed) ──

export async function fetchCategories(): Promise<Category[]> {
  // Use seed categories directly — Supabase IDs may not match seed IDs
  return SEED_CATEGORIES
}

export async function fetchProducts(categorySlug?: string): Promise<ExtendedProduct[]> {
  // Use seed products directly — Supabase products were cleared during restructure
  return getSeedProducts(categorySlug)
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

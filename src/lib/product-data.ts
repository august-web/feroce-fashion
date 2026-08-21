import { SEED_PRODUCTS, type ExtendedProduct } from '@/data/seed'

export async function fetchProductBySlug(slug: string): Promise<ExtendedProduct | null> {
  // Use seed data directly
  return SEED_PRODUCTS.find((p) => p.slug === slug) || null
}

export async function fetchRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<ExtendedProduct[]> {
  // Use seed data directly
  return SEED_PRODUCTS
    .filter((p) => p.category_id === categoryId && p.id !== excludeId)
    .slice(0, limit)
}

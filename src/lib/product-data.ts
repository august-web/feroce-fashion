import { createClient } from '@/lib/supabase/server'
import { SEED_PRODUCTS, type ExtendedProduct } from '@/data/seed'

export async function fetchProductBySlug(slug: string): Promise<ExtendedProduct | null> {
  // Try Supabase first
  try {
    const supabase = await createClient()
    const result = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    const data = result.data as Record<string, unknown> | null
    if (!result.error && data) {
      const seed = SEED_PRODUCTS.find((p) => p.slug === slug)
      return {
        id: data.id as string,
        category_id: data.category_id as string,
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string,
        price: data.price as number,
        image_urls: data.image_urls as string[],
        color: data.color as string,
        stock: data.stock as number,
        active: data.active as boolean,
        is_new: data.is_new as boolean,
        created_at: data.created_at as string,
        model_image_urls: seed?.model_image_urls || [],
        variants: seed?.variants || [{ color: data.color as string, colorHex: '#333', inStock: (data.stock as number) > 0 }],
        sizes: seed?.sizes || [{ label: 'One Size', available: true }],
        materials: seed?.materials || 'Premium leather construction.',
        careInstructions: seed?.careInstructions || 'Store in dust bag when not in use.',
      }
    }
  } catch {
    // Fall through to seed
  }

  // Fallback to seed data
  return SEED_PRODUCTS.find((p) => p.slug === slug) || null
}

export async function fetchRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<ExtendedProduct[]> {
  // Try Supabase first
  try {
    const supabase = await createClient()
    const result = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('active', true)
      .neq('id', excludeId)
      .limit(limit)

    const data = result.data as Record<string, unknown>[] | null
    if (!result.error && data?.length) {
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
          model_image_urls: seed?.model_image_urls || [],
          variants: seed?.variants || [],
          sizes: seed?.sizes || [],
          materials: seed?.materials || '',
          careInstructions: seed?.careInstructions || '',
        }
      })
    }
  } catch {
    // Fall through to seed
  }

  // Fallback: filter from seed data
  return SEED_PRODUCTS
    .filter((p) => p.category_id === categoryId && p.id !== excludeId)
    .slice(0, limit)
}

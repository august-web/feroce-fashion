import { createAdminClient } from '@/lib/supabase/admin'
import type { ShopProduct } from '@/lib/shop-data'

type DBRow = Record<string, unknown>

function toShopProduct(p: DBRow): ShopProduct {
  return {
    id: p.id as string,
    category_id: p.category_id as string,
    collection: (p.collection as string) || '',
    name: p.name as string,
    slug: p.slug as string,
    description: (p.description as string) || '',
    price: p.price as number,
    image_urls: (p.image_urls as string[]) || [],
    model_image_urls: (p.model_image_urls as string[]) || [],
    color: p.color as string,
    color_hex: (p.color_hex as string) || '#0A1128',
    materials: (p.materials as string) || '',
    care_instructions: (p.care_instructions as string) || '',
    careInstructions: (p.care_instructions as string) || '',
    stripe_checkout_url: (p.stripe_checkout_url as string) || '',
    stock: p.stock as number,
    active: p.active as boolean,
    is_new: p.is_new as boolean,
    created_at: (p.created_at as string) || '',
    variants: [{
      color: p.color as string,
      colorHex: (p.color_hex as string) || '#0A1128',
      images: (p.image_urls as string[]) || [],
      modelImages: (p.model_image_urls as string[]) || [],
      stripe_checkout_url: (p.stripe_checkout_url as string) || '',
      inStock: (p.stock as number) > 0,
    }],
    sizes: [{ label: 'One Size', available: (p.stock as number) > 0 }],
  }
}

export async function fetchProductBySlug(slug: string): Promise<ShopProduct | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) return null
  return toShopProduct(data as DBRow)
}

export async function fetchRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<ShopProduct[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .limit(limit)

  if (!data) return []
  return (data as DBRow[]).map(toShopProduct)
}

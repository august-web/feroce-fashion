import { supabase } from './supabase'
import { productImageUrl } from './images'
import type { Availability, Gender, Product } from '../types'

interface DbVariant { name: string; color_name: string | null; color_hex: string | null; price_minor: number | null; inventory: number; active: boolean }
interface DbImage { storage_path: string; sort_order: number; is_primary: boolean }
interface DbProductRow {
  id: string; slug: string; name: string; subtitle: string | null; description: string | null
  materials: string | null; dimensions: string | null
  gender: Gender; status: string; base_price_minor: number
  preorder: boolean; preorder_delivery_note: string | null
  new_arrival: boolean; best_seller: boolean; featured: boolean
  search_keywords: string[] | null
  categories: { name: string } | null
  product_collections: { collections: { name: string } | null }[] | null
  product_variants: DbVariant[] | null
  product_images: DbImage[] | null
}

const PRODUCT_SELECT =
  'id,slug,name,subtitle,description,materials,dimensions,gender,status,base_price_minor,preorder,preorder_delivery_note,new_arrival,best_seller,featured,search_keywords,categories(name),product_collections(collections(name)),product_variants(name,color_name,color_hex,price_minor,inventory,active),product_images(storage_path,sort_order,is_primary)'

/** Query the active catalog (RLS: anonymous/authenticated may read active products + their children). */
export async function fetchLiveProducts(): Promise<Product[]> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as unknown as DbProductRow[] | null)?.map(toProduct) ?? []
}

// ---------------------------------------------------------------------------
// Server-side shop query (search / filters / sort stay on the database so the
// shop scales past a handful of products). No PostgREST embed filters are used:
// on this project they filter the embedded rows, not the parent, so every
// relation filter resolves to a small child lookup + `id=in.(…)` on products.
// ---------------------------------------------------------------------------

export interface ShopFilters {
  q?: string
  gender?: Gender
  category?: string
  collection?: string
  color?: string
  availability?: string
  badge?: string
  maxPriceMinor?: number
  sort?: 'featured' | 'newest' | 'price-low' | 'price-high'
}

const BADGE_FLAG: Record<string, string> = {
  NEW: 'new_arrival',
  'BEST SELLER': 'best_seller',
  'PRE-ORDER': 'preorder',
  LIMITED: 'featured',
}

type QueryBuilder = any

/** Fetch the shop's product list with all filters/search/sort applied server-side. */
export async function fetchShopProducts(f: ShopFilters = {}): Promise<Product[]> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const db = supabase

  // Resolve relation filters to id sets via child lookups (small, indexed).
  const [categoryIds, collectionIds, colorIds] = await Promise.all([
    f.category ? lookupCategoryIds(f.category, false) : Promise.resolve<string[]>([]),
    f.collection ? lookupCollectionProductIds(f.collection, false) : Promise.resolve<string[]>([]),
    f.color ? lookupVariantProductIds(f.color) : Promise.resolve<string[]>([]),
  ])
  if ((f.category && categoryIds.length === 0) || (f.collection && collectionIds.length === 0) || (f.color && colorIds.length === 0)) return []

  // Inventory bands (In stock / Low stock / Made to order) need per-product sums:
  // computed server-side via the product_inventory() RPC, then intersected.
  const availabilityIds =
    f.availability && f.availability !== 'Pre-order'
      ? await lookupInventoryIds(f.availability)
      : null
  if (availabilityIds && availabilityIds.length === 0) return []

  const q = f.q?.trim()
  const qActive = q && q.length >= 2 ? q.replace(/[%,]/g, '') : ''

  const build = (extra?: (qb: QueryBuilder) => QueryBuilder): QueryBuilder => {
    let qb = db.from('products').select(PRODUCT_SELECT).eq('status', 'active')
    if (f.gender) qb = qb.in('gender', [f.gender, 'Unisex'])
    if (categoryIds.length) qb = qb.in('category_id', categoryIds)
    if (collectionIds.length) qb = qb.in('id', collectionIds)
    if (colorIds.length) qb = qb.in('id', colorIds)
    if (f.availability === 'Pre-order') qb = qb.eq('preorder', true)
    if (availabilityIds) {
      // Pre-order products are never an inventory band; exclude them explicitly.
      qb = qb.eq('preorder', false).in('id', availabilityIds)
    }
    const flag = f.badge ? BADGE_FLAG[f.badge] : undefined
    if (flag) qb = qb.eq(flag, true)
    if (f.maxPriceMinor != null) qb = qb.lte('base_price_minor', f.maxPriceMinor)
    if (f.sort === 'newest') qb = qb.order('new_arrival', { ascending: false }).order('created_at', { ascending: false })
    else if (f.sort === 'price-low') qb = qb.order('base_price_minor', { ascending: true })
    else if (f.sort === 'price-high') qb = qb.order('base_price_minor', { ascending: false })
    else qb = qb.order('created_at', { ascending: true })
    return extra ? extra(qb) : qb
  }

  let rows: DbProductRow[] = []
  if (qActive) {
    rows = await run(build(b => b.or(`name.ilike.%${qActive}%,subtitle.ilike.%${qActive}%,description.ilike.%${qActive}%`)))
    // Match collection and category names too (or() rejects embedded paths, so
    // those matches come from small child lookups and are unioned in).
    const collectionMatches = await lookupCollectionProductIds(qActive, true)
    const categoryMatches = await lookupCategoryIds(qActive, true)
    const merged: DbProductRow[] = [...rows]
    if (collectionMatches.length) merged.push(...(await run(build(b => b.in('id', collectionMatches)))))
    if (categoryMatches.length) merged.push(...(await run(build(b => b.in('category_id', categoryMatches)))))
    const seen = new Set<string>()
    rows = merged.filter(r => (seen.has(r.id) ? false : (seen.add(r.id), true)))
  } else {
    rows = await run(build())
  }

  return rows.map(toProduct)
}

async function run(qb: QueryBuilder): Promise<DbProductRow[]> {
  const { data, error } = await qb
  if (error) throw error
  return (data as unknown as DbProductRow[] | null) ?? []
}

async function lookupCategoryIds(name: string, like: boolean): Promise<string[]> {
  const query = supabase!.from('categories').select('id')
  const { data, error } = like ? await query.ilike('name', `%${name}%`) : await query.eq('name', name)
  if (error) throw error
  return (data ?? []).map(r => r.id as string)
}

async function lookupCollectionProductIds(name: string, like: boolean): Promise<string[]> {
  const colQuery = supabase!.from('collections').select('id')
  const { data: cols, error: colErr } = like
    ? await colQuery.ilike('name', `%${name}%`)
    : await colQuery.eq('name', name)
  if (colErr) throw colErr
  if (!cols || cols.length === 0) return []
  const { data: links, error: linkErr } = await supabase!
    .from('product_collections')
    .select('product_id')
    .in('collection_id', cols.map(c => c.id as string))
  if (linkErr) throw linkErr
  return [...new Set((links ?? []).map(r => r.product_id as string))]
}

async function lookupVariantProductIds(color: string): Promise<string[]> {
  const { data, error } = await supabase!
    .from('product_variants')
    .select('product_id')
    .eq('color_name', color)
  if (error) throw error
  return [...new Set((data ?? []).map(r => r.product_id as string))]
}

async function lookupInventoryIds(band: string): Promise<string[]> {
  const { data, error } = await supabase!.rpc('product_inventory')
  if (error) throw error
  const rows = (data ?? []) as { product_id: string; inventory: number }[]
  return rows
    .filter(({ inventory }) =>
      band === 'In stock' ? inventory > 5 : band === 'Low stock' ? inventory >= 1 && inventory <= 5 : inventory <= 0,
    )
    .map(r => r.product_id)
}

// ---------------------------------------------------------------------------
// Row → Product mapping (shared by the catalog context and the shop query)
// ---------------------------------------------------------------------------

function toProduct(row: DbProductRow): Product {
  const variants = row.product_variants ?? []
  const images = [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const inventory = variants.filter(v => v.active).reduce((n, v) => n + v.inventory, 0)

  const colors: { name: string; hex: string }[] = []
  for (const v of variants) {
    if (v.color_name && !colors.some(c => c.name === v.color_name)) {
      colors.push({ name: v.color_name, hex: v.color_hex ?? '#151515' })
    }
  }
  const variantNames = [...new Set(variants.map(v => v.name).filter(Boolean))]

  const badge: Product['badge'] = row.new_arrival ? 'NEW' : row.best_seller ? 'BEST SELLER' : row.preorder ? 'PRE-ORDER' : row.featured ? 'LIMITED' : undefined
  const availability: Availability = row.preorder ? 'Pre-order' : inventory === 0 ? 'Made to order' : inventory <= 5 ? 'Low stock' : 'In stock'

  const primary = images.find(i => i.is_primary) ?? images[0]
  const alternate = images.find(i => !i.is_primary)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle ?? '',
    price: row.base_price_minor / 100,
    priceIsPlaceholder: true,
    category: row.categories?.name ?? '',
    gender: row.gender,
    collection: row.product_collections?.[0]?.collections?.name ?? '',
    image: productImageUrl(primary?.storage_path),
    alternateImage: alternate ? productImageUrl(alternate.storage_path) : undefined,
    colors: colors.length ? colors : [{ name: 'Noir', hex: '#151515' }],
    badge,
    availability,
    inventory,
    description: row.description ?? '',
    materials: row.materials ?? '',
    dimensions: row.dimensions ?? '',
    variants: variantNames.length ? variantNames : ['Classic'],
    preorderEstimate: row.preorder_delivery_note ?? undefined,
    keywords: row.search_keywords ?? [],
  }
}

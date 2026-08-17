/**
 * Catalog seed for the FÉROCE FASHION_FF Supabase project.
 *
 * Run (project root):
 *   npx esbuild supabase/seed.ts --bundle --platform=node --format=esm --outfile=supabase/.seed.mjs
 *   node supabase/.seed.mjs
 *
 * Reads VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
 * Idempotent: upserts categories/collections/products by slug, replaces variants/images/links per product.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import { products } from '../src/data/products'

function loadEnv() {
  const raw = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].trim()
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const db: SupabaseClient = createClient(url, serviceKey, { auth: { persistSession: false } })

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Bundled product photography lives in public/images (the offline fallback). In the
// live project the same files are uploaded to the public `products` bucket, so records
// resolve to real public URLs. `catalog/` groups the sample set apart from future
// admin uploads (which use `<product-slug>/…` paths).
const imagePathToStorage = (p: string) => (p.startsWith('/images/') ? `catalog/${p.slice('/images/'.length)}` : p)

async function upsertBySlug(table: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const { error } = await db.from(table).upsert(rows, { onConflict: 'slug' })
  if (error) throw new Error(`upsert ${table}: ${error.message}`)
  const { data } = await db.from(table).select('id,slug').in('slug', rows.map(r => r.slug as string))
  const map = new Map<string, string>()
  for (const row of data ?? []) map.set(row.slug as string, row.id as string)
  return map
}

async function uploadBundledImages(): Promise<number> {
  const bundled = [...new Set(products.flatMap(p => [p.image, p.alternateImage].filter(Boolean) as string[]))]
  console.log(`Uploading ${bundled.length} bundled images to the products bucket…`)
  for (const local of bundled) {
    const storagePath = imagePathToStorage(local)
    const data = fs.readFileSync(`public${local}`)
    const { error } = await db.storage.from('products').upload(
      storagePath,
      new Blob([data], { type: 'image/jpeg' }),
      { upsert: true },
    )
    if (error) throw new Error(`image upload ${storagePath}: ${error.message}`)
  }
  return bundled.length
}

async function main() {
  const bundledCount = await uploadBundledImages()

  const categoryNames = [...new Set(products.map(p => p.category))]

  const categories = categoryNames.map(name => ({
    name, slug: slugify(name),
    description: `Sample category: ${name}. Replace with approved brand copy before launch.`,
  }))
  const categoryIds = await upsertBySlug('categories', categories)
  if (!categoryIds) throw new Error('categories upsert failed')

  // Real collections (De Ville, Naji) always exist with brand descriptions from the feed,
  // even before their SKUs are uploaded; any other product-derived collection name gets a
  // clearly marked sample description as a stopgap.
  const realCollections: Record<string, string> = {
    'De Ville': 'The house signature — structured flap bags in denim-textured coated canvas with an all-over gold monogram. Colorways: Cream Gold, Navy & Gold, plus the convertible fanny pack & satchel line (cream, brown, grey, black, red).',
    'Naji': 'The soft-fur handbag line in red maroon & golden — high quality fur, bobby-shiney and satin. Pieces arriving; SKUs being confirmed with the founder.',
  }
  const collectionNames = [...new Set([...products.map(p => p.collection), ...Object.keys(realCollections)])]
  const collections = collectionNames.map(name => ({
    name, slug: slugify(name), status: 'active',
    description: realCollections[name] ?? `Sample collection: ${name}. Replace with approved brand copy before launch.`,
  }))
  const collectionIds = await upsertBySlug('collections', collections)
  if (!collectionIds) throw new Error('collections upsert failed')

  const productRows = products.map(p => ({
    slug: p.slug,
    category_id: categoryIds.get(slugify(p.category)),
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    gender: p.gender,
    status: 'active',
    base_price_minor: Math.round(p.price * 100),
    currency: 'GHS',
    materials: p.materials,
    dimensions: p.dimensions,
    featured: p.badge === 'LIMITED',
    best_seller: p.badge === 'BEST SELLER',
    new_arrival: p.badge === 'NEW',
    preorder: p.badge === 'PRE-ORDER' || p.availability === 'Pre-order',
    preorder_delivery_note: p.preorderEstimate ?? null,
    seo_title: `${p.name} — FÉROCE FASHION_FF`,
    seo_description: p.subtitle,
    search_keywords: p.keywords,
  }))
  const productIds = await upsertBySlug('products', productRows)
  if (!productIds) throw new Error('products upsert failed')

  // Replace per-product children so re-seeding never duplicates.
  for (const p of products) {
    const productId = productIds.get(p.slug)!
    await db.from('product_variants').delete().eq('product_id', productId)
    await db.from('product_images').delete().eq('product_id', productId)
    await db.from('product_collections').delete().eq('product_id', productId)

    const colorSlug = (s: string) => slugify(s)
    const totalSlots = Math.max(1, p.variants.length * p.colors.length)
    const base = Math.floor(p.inventory / totalSlots)
    const remainder = p.inventory - base * totalSlots
    const variants = p.variants.flatMap(variant =>
      p.colors.map((color, i) => ({
        product_id: productId,
        sku: `${p.slug}-${slugify(variant)}-${colorSlug(color.name)}`.slice(0, 60),
        name: variant,
        color_name: color.name,
        color_hex: color.hex,
        price_minor: Math.round(p.price * 100),
        inventory: i < remainder ? base + 1 : base,
        active: true,
      })),
    )
    const { error: vErr } = await db.from('product_variants').insert(variants)
    if (vErr) throw new Error(`variants ${p.slug}: ${vErr.message}`)

    const images = [p.image, p.alternateImage].filter(Boolean).map((path, i) => ({
      product_id: productId,
      storage_path: imagePathToStorage(path as string),
      alt_text: `${p.name} — FÉROCE FASHION_FF`,
      sort_order: i,
      is_primary: i === 0,
    }))
    const { error: iErr } = await db.from('product_images').insert(images)
    if (iErr) throw new Error(`images ${p.slug}: ${iErr.message}`)

    const collectionId = collectionIds.get(slugify(p.collection))
    if (collectionId) {
      const { error: cErr } = await db.from('product_collections').insert({ product_id: productId, collection_id: collectionId })
      if (cErr) throw new Error(`collections link ${p.slug}: ${cErr.message}`)
    }
  }

  console.log(`Seeded ${products.length} products, ${categories.length} categories, ${collections.length} collections with ${bundledCount} bundled images.`)
}

main().catch(e => { console.error(e); process.exit(1) })

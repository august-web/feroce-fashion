/** Resolve a product image path to a displayable URL.
 *  Seeded catalog images live in the public `products` storage bucket (object paths like
 *  `catalog/…` or `product-slug/…` for admin uploads); the offline fallback catalog uses
 *  local `/images` paths, which are passed through untouched. */
export function productImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/product-noir.jpg'
  if (path.startsWith('http') || path.startsWith('/images') || path.startsWith('data:') || path.startsWith('blob:')) return path
  const base = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? ''
  return `${base}/storage/v1/object/public/products/${path}`
}

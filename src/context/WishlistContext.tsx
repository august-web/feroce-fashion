import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { readStorage, writeStorage } from '../lib/storage'
import type { Product } from '../types'

interface WishlistValue {
  /** Product slugs — the wishlist is slug-keyed so it can sync to Supabase product rows. */
  ids: string[]
  has: (slug: string) => boolean
  toggle: (product: Product) => void
  /** True when the list is backed by the authenticated user's Supabase wishlist. */
  synced: boolean
}
const WishlistContext = createContext<WishlistValue | null>(null)
const KEY = 'feroce-wishlist-v2'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readStorage(KEY, []))
  const [synced, setSynced] = useState(false)
  const slugToId = useRef<Record<string, string>>({})

  useEffect(() => {
    if (!supabase) return

    const loadDb = async () => {
      if (!supabase) return
      try {
        const { data } = await supabase.auth.getSession()
        const uid = data.session?.user?.id
        if (!uid) return setSynced(false)

        const [productsRes, wishlistRes] = await Promise.all([
          supabase.from('products').select('id,slug'),
          // Idempotent upsert: on conflict the existing wishlist row is kept, so repeated
          // mounts (StrictMode double-effect, auth refreshes) never 409 on the unique key.
          supabase.from('wishlists').upsert({ user_id: uid }, { onConflict: 'user_id' }).select('id').maybeSingle(),
        ])
        const map: Record<string, string> = {}
        for (const p of productsRes.data ?? []) map[p.slug] = p.id
        slugToId.current = map

        const wishlistId = wishlistRes.data?.id ?? null
        if (wishlistId) {
          const { data: items } = await supabase.from('wishlist_items').select('product_id').eq('wishlist_id', wishlistId)
          const slugs = new Set<string>()
          for (const item of items ?? []) {
            const match = Object.entries(map).find(([, id]) => id === item.product_id)
            if (match) slugs.add(match[0])
          }
          setIds([...slugs])
        }
        setSynced(true)
      } catch { /* Keep local state; the next auth event re-hydrates. */ }
    }

    loadDb()
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) loadDb()
      else { setSynced(false); setIds(readStorage(KEY, [])) }
    })
    return () => data.subscription.unsubscribe()
  }, [])

  async function syncToDb(slug: string, adding: boolean) {
    if (!supabase) return
    const productId = slugToId.current[slug]
    if (!productId) return
    try {
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id
      if (!uid) return
      const { data: wishlist } = await supabase.from('wishlists').select('id').eq('user_id', uid).maybeSingle()
      const wishlistId = wishlist?.id
      if (!wishlistId) return
      if (adding) {
        await supabase.from('wishlist_items').upsert(
          { wishlist_id: wishlistId, product_id: productId },
          { onConflict: 'wishlist_id,product_id' },
        )
      } else {
        await supabase.from('wishlist_items').delete().eq('wishlist_id', wishlistId).eq('product_id', productId)
      }
    } catch { /* Local state stays; the next auth event re-hydrates from the database. */ }
  }

  const value = useMemo<WishlistValue>(() => ({
    ids,
    has: slug => ids.includes(slug),
    toggle(product) {
      const slug = product.slug
      const adding = !ids.includes(slug)
      const next = adding ? [...ids, slug] : ids.filter(s => s !== slug)
      setIds(next)
      writeStorage(KEY, next)
      if (synced) syncToDb(slug, adding)
    },
    synced,
  }), [ids, synced])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

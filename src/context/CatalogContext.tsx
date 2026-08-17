import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products as staticProducts } from '../data/products'
import { fetchLiveProducts } from '../lib/catalog'
import type { Product } from '../types'

export interface CollectionSummary { name: string; count: number }

interface CatalogValue {
  /** Products shown across the storefront. Static sample catalog renders instantly,
   *  then is replaced by the live Supabase catalog when the query resolves. */
  products: Product[]
  collections: CollectionSummary[]
  /** 'static' = sample fallback in use (unconfigured or query error); 'live' = Supabase data. */
  source: 'static' | 'live'
  loading: boolean
}

const CatalogContext = createContext<CatalogValue | null>(null)

function deriveCollections(products: Product[]): CollectionSummary[] {
  const counts = new Map<string, number>()
  for (const p of products) if (p.collection) counts.set(p.collection, (counts.get(p.collection) ?? 0) + 1)
  return [...counts.entries()].map(([name, count]) => ({ name, count }))
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<CatalogValue>(() => ({
    products: staticProducts,
    collections: deriveCollections(staticProducts),
    source: 'static',
    loading: true,
  }))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const live = await fetchLiveProducts()
        if (cancelled) return
        setValue({ products: live, collections: deriveCollections(live), source: 'live', loading: false })
      } catch {
        // Query failed or Supabase unconfigured — keep the static sample catalog as fallback.
        if (!cancelled) setValue(v => ({ ...v, loading: false }))
      }
    })()
    return () => { cancelled = true }
  }, [])

  const memo = useMemo(() => value, [value])
  return <CatalogContext.Provider value={memo}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog must be used within CatalogProvider')
  return context
}

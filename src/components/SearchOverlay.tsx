import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { fetchShopProducts } from '../lib/catalog'
import { formatMoney } from '../data/products'
import type { Product } from '../types'

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [found, setFound] = useState<Product[]>([])
  const ref = useRef<HTMLInputElement>(null)
  const { products: catalogProducts } = useCatalog()
  useEffect(() => { if (open) window.setTimeout(() => ref.current?.focus(), 100) }, [open])
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query), 200)
    return () => window.clearTimeout(t)
  }, [query])
  useEffect(() => {
    const q = debounced.trim()
    if (q.length < 2) { setFound([]); return }
    let cancelled = false
    ;(async () => {
      try {
        const rows = await fetchShopProducts({ q })
        if (!cancelled) setFound(rows.slice(0, 4))
      } catch {
        // Unconfigured Supabase or a failed query: search the catalog client-side.
        if (!cancelled) setFound(catalogProducts.filter(p => `${p.name} ${p.collection} ${p.category} ${p.keywords.join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0, 4))
      }
    })()
    return () => { cancelled = true }
  }, [debounced, catalogProducts])
  if (!open) return null
  return <div className="fixed inset-0 z-[80] bg-ivory animate-fade-up" role="dialog" aria-modal="true" aria-label="Search products">
    <div className="mx-auto flex h-full max-w-6xl flex-col px-5 py-6 md:px-10 md:py-10">
      <div className="flex items-center justify-between border-b border-black/15 pb-5">
        <span className="text-[10px] tracking-luxury">SEARCH FÉROCE</span>
        <button onClick={onClose} aria-label="Close search" className="p-2"><X size={22}/></button>
      </div>
      <div className="relative mt-12 md:mt-20">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2" size={26} strokeWidth={1.3}/>
        <input ref={ref} value={query} onChange={e => setQuery(e.target.value)} placeholder="What are you looking for?" className="w-full border-b border-ink bg-transparent py-5 pl-11 pr-4 font-display text-3xl outline-none placeholder:text-black/25 md:text-6xl"/>
      </div>
      <div className="mt-8 flex-1 overflow-auto">
        {!query && <div><p className="text-[10px] uppercase tracking-luxury text-black/50">Suggested</p><div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">{[['New arrivals','/shop?badge=NEW'],['Women','/women'],['Men','/men'],['Pre-order','/shop?badge=PRE-ORDER']].map(([label,path]) => <Link key={label} onClick={onClose} to={path} className="border-b border-black/30 pb-1 hover:border-black">{label}</Link>)}</div></div>}
        {query.length > 1 && found.length === 0 && <div className="py-14 text-center"><p className="font-display text-3xl">No pieces found.</p><p className="mt-3 text-sm text-black/55">Try another name, collection, category or color.</p></div>}
        {found.length > 0 && <div className="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">{found.map(p => <Link onClick={onClose} to={`/product/${p.slug}`} key={p.id} className="group bg-ivory p-3"><img src={p.image} alt={p.name} className="aspect-square w-full object-cover"/><div className="flex items-end justify-between pt-4"><div><h3 className="font-display text-lg">{p.name}</h3><p className="mt-1 text-xs text-black/55">{formatMoney(p.price)}</p></div><ArrowRight size={17} className="transition group-hover:translate-x-1"/></div></Link>)}</div>}
      </div>
    </div>
  </div>
}

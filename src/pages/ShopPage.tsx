import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../context/CatalogContext'
import { fetchShopProducts, type ShopFilters } from '../lib/catalog'
import type { Gender, Product } from '../types'
import { useSeo } from '../lib/seo'

const colors = ['Noir','Oxblood','Sable','Espresso','Forest']
const availability = ['In stock','Low stock','Pre-order','Made to order']

type Props = { forcedGender?: Gender; title?: string; intro?: string }
export function ShopPage({ forcedGender, title = 'All pieces', intro = 'The new designer bags — high quality, sturdy and luxury, made to be worn every day.' }: Props) {
  useSeo(title, `Shop ${title.toLowerCase()} from FÉROCE. The new designer bags — high quality, sturdy and luxury, made for everyday wear.`)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [search, setSearch] = useState(params.get('q') || '')
  // /shop, /women and /men render the same ShopPage, so React keeps this component
  // mounted across those routes. Without this, a search typed on one route silently
  // carries over and filters the next route to zero (e.g. "Nothing matched" on /men).
  useEffect(() => { setSearch(params.get('q') || '') }, [location.key]) // eslint-disable-line react-hooks/exhaustive-deps
  const selectedCategory = params.get('category') || ''
  const selectedCollection = params.get('collection') || ''
  const selectedColor = params.get('color') || ''
  const selectedAvailability = params.get('availability') || ''
  const badge = params.get('badge') || ''
  const sort = params.get('sort') || 'featured'

  // Server-side results; null while pending/errored means "fall back to client filtering".
  const { products: catalogProducts } = useCatalog()
  // Price bounds derive from the live catalog so the slider and its labels always
  // reflect the actual price range (min = cheapest piece, max = priciest rounded up).
  // Both bounds are multiples of 100 so the range's step grid (100) lands exactly on
  // the max — otherwise the browser clamps the thumb to the nearest valid step.
  const [minBound, maxBound] = useMemo(() => {
    const prices = catalogProducts.map(p => p.price)
    if (!prices.length) return [1800, 4000]
    const min = Math.floor(Math.min(...prices) / 100) * 100
    const max = Math.ceil(Math.max(...prices) / 100) * 100
    return [min, Math.max(max, min + 100)]
  }, [catalogProducts])
  const maxPrice = Number(params.get('max') || maxBound)
  const [serverResult, setServerResult] = useState<Product[] | null>(null)
  const [debounced, setDebounced] = useState({ q: search, max: maxPrice })
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced({ q: search, max: maxPrice }), 250)
    return () => window.clearTimeout(t)
  }, [search, maxPrice])

  useEffect(() => {
    let cancelled = false
    // Drop the previous route's server rows immediately: keeping them would let the
    // stale gender-filtered set from /women get client-filtered against /men and
    // briefly render "Nothing matched / 0 pieces" until the new query resolves.
    setServerResult(null)
    const q = debounced.q.trim()
    ;(async () => {
      try {
        const rows = await fetchShopProducts({
          q: q.length >= 2 ? q : undefined,
          gender: forcedGender,
          category: selectedCategory || undefined,
          collection: selectedCollection || undefined,
          color: selectedColor || undefined,
          availability: selectedAvailability || undefined,
          badge: badge || undefined,
          maxPriceMinor: Math.round(debounced.max * 100),
          sort: (sort || 'featured') as ShopFilters['sort'],
        })
        if (!cancelled) setServerResult(rows)
      } catch {
        // Unconfigured Supabase or a failed query: filter the catalog client-side.
        if (!cancelled) setServerResult(null)
      }
    })()
    return () => { cancelled = true }
  }, [forcedGender, selectedCategory, selectedCollection, selectedColor, selectedAvailability, badge, sort, debounced])

  const categories = useMemo(() => [...new Set(catalogProducts.map(p => p.category).filter(Boolean))].sort(), [catalogProducts])
  const collections = useMemo(() => [...new Set(catalogProducts.map(p => p.collection).filter(Boolean))].sort(), [catalogProducts])
  function set(key: string, value: string) { const next = new URLSearchParams(params); value ? next.set(key,value) : next.delete(key); setParams(next) }
  function reset() { setParams(forcedGender ? {} : {}) ; setSearch('') }

  const filtered = useMemo(() => {
    const items = serverResult ?? catalogProducts
    return filterProducts(items, { q: search, forcedGender, category: selectedCategory, collection: selectedCollection, color: selectedColor, availability: selectedAvailability, badge, maxPrice, sort })
  }, [serverResult, catalogProducts, search, forcedGender, selectedCategory, selectedCollection, selectedColor, selectedAvailability, badge, maxPrice, sort])
  const activeCount = [selectedCategory,selectedCollection,selectedColor,selectedAvailability,badge,maxPrice<maxBound].filter(Boolean).length

  const Filters = () => <div className="space-y-8">
    <FilterGroup title="Category">{categories.map(c=><FilterOption key={c} label={c} selected={selectedCategory===c} onClick={()=>set('category',selectedCategory===c?'':c)}/>)}</FilterGroup>
    <FilterGroup title="Collection">{collections.map(c=><FilterOption key={c} label={c} selected={selectedCollection===c} onClick={()=>set('collection',selectedCollection===c?'':c)}/>)}</FilterGroup>
    <FilterGroup title="Color"><div className="flex flex-wrap gap-2">{colors.map(c=><button key={c} onClick={()=>set('color',selectedColor===c?'':c)} className={`border px-3 py-2 text-[9px] uppercase tracking-[.12em] transition ${selectedColor===c?'border-ink bg-ink text-white':'border-black/15 hover:border-black/60'}`}>{c}</button>)}</div></FilterGroup>
    <FilterGroup title="Availability">{availability.map(c=><FilterOption key={c} label={c} selected={selectedAvailability===c} onClick={()=>set('availability',selectedAvailability===c?'':c)}/>)}</FilterGroup>
    <FilterGroup title="Price"><div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-black/50"><span>GHS {minBound.toLocaleString()}</span><span>Up to {maxPrice.toLocaleString()}</span></div><input aria-label="Maximum price" type="range" min={minBound} max={maxBound} step="100" value={Math.min(Math.max(maxPrice, minBound), maxBound)} onChange={e=>set('max',e.target.value)} className="mt-3 w-full accent-ink"/><p className="mt-2 text-[8px] uppercase tracking-widest text-black/40">All prices in GHS</p></FilterGroup>
  </div>

  return <main className="min-h-screen bg-ivory">
    <section className="border-b border-black/10 px-5 pb-12 pt-14 text-center sm:px-8 md:pb-16 md:pt-20"><p className="text-[9px] uppercase tracking-luxury text-black/45">FÉROCE collections</p><h1 className="mt-5 font-display text-6xl sm:text-7xl md:text-8xl">{title}</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/55">{intro}</p></section>
    <div className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-7">
      <div className="flex flex-col gap-4 border-b border-black/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={e=>e.preventDefault()} className="flex min-w-0 max-w-md flex-1 items-center border-b border-black/30"><Search size={15} strokeWidth={1.4}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, collection or color" className="w-full bg-transparent px-3 py-3 text-xs outline-none placeholder:text-black/35"/></form>
        <div className="flex items-center justify-between gap-3"><span className="text-[9px] uppercase tracking-luxury text-black/45">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</span><button onClick={()=>setMobileFilters(true)} className="flex items-center gap-2 border border-black/20 px-3 py-2.5 text-[9px] uppercase tracking-[.15em] lg:hidden"><Filter size={14}/> Filters {activeCount>0&&`(${activeCount})`}</button><label className="relative flex items-center gap-2 border border-black/20 px-3"><span className="hidden text-[9px] uppercase tracking-[.15em] sm:inline">Sort</span><select value={sort} onChange={e=>set('sort',e.target.value)} className="appearance-none bg-transparent py-2.5 pl-1 pr-6 text-[9px] uppercase tracking-[.12em] outline-none"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: low</option><option value="price-high">Price: high</option></select><ChevronDown size={12} className="pointer-events-none absolute right-3"/></label></div>
      </div>
      <div className="grid gap-8 pt-8 lg:grid-cols-[220px_1fr] xl:grid-cols-[250px_1fr]">
        <aside className="hidden pr-5 lg:block"><div className="sticky top-24"><div className="mb-7 flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-luxury"><SlidersHorizontal size={15}/> Filters</span>{activeCount>0&&<button onClick={reset} className="text-[9px] uppercase tracking-widest underline">Clear</button>}</div><Filters/></div></aside>
        <section aria-label="Product results">{filtered.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:gap-x-7 xl:gap-y-14">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="flex min-h-96 flex-col items-center justify-center text-center"><h2 className="font-display text-4xl">Nothing matched.</h2><p className="mt-3 text-sm text-black/50">Try removing a filter or searching another phrase.</p><button onClick={reset} className="mt-7 border-b border-black pb-1 text-[9px] uppercase tracking-luxury">Reset all filters</button></div>}</section>
      </div>
    </div>
    {mobileFilters&&<div className="fixed inset-0 z-[80] bg-ivory lg:hidden"><div className="flex items-center justify-between border-b border-black/10 px-5 py-5"><span className="text-[10px] uppercase tracking-luxury">Filters {activeCount>0&&`(${activeCount})`}</span><button onClick={()=>setMobileFilters(false)}><X size={21}/></button></div><div className="h-[calc(100%-144px)] overflow-y-auto px-5 py-7"><Filters/></div>{/* Primary/secondary: viewing the results commits the filters (solid ink); clearing resets them (bordered). */}<div className="absolute inset-x-0 bottom-0 flex gap-3 border-t border-black/10 bg-ivory p-4"><button onClick={reset} className="flex-1 border border-black/20 py-4 text-[9px] uppercase tracking-luxury">Clear all</button><button onClick={()=>setMobileFilters(false)} className="flex-[2] bg-ink py-4 text-[9px] uppercase tracking-luxury text-white">View {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</button></div></div>}
  </main>
}

/** Client-side filter used only as the fallback (unconfigured Supabase / query error)
 *  and as an instant re-filter of the latest server result while typing. */
function filterProducts(products: Product[], f: { q: string; forcedGender?: Gender; category: string; collection: string; color: string; availability: string; badge: string; maxPrice: number; sort: string }): Product[] {
  const q = f.q.trim().toLowerCase()
  let result = products.filter(p => {
    const searchBlob = `${p.name} ${p.collection} ${p.category} ${p.gender} ${p.keywords.join(' ')} ${p.badge || ''}`.toLowerCase()
    return (!f.forcedGender || p.gender === f.forcedGender || p.gender === 'Unisex') && (!f.category || p.category === f.category) && (!f.collection || p.collection === f.collection) && (!f.color || p.colors.some(c=>c.name===f.color)) && (!f.availability || p.availability === f.availability) && (!f.badge || p.badge === f.badge) && p.price <= f.maxPrice && (!q || searchBlob.includes(q))
  })
  return [...result].sort((a,b) => f.sort === 'price-low' ? a.price-b.price : f.sort === 'price-high' ? b.price-a.price : f.sort === 'newest' ? Number(b.badge==='NEW')-Number(a.badge==='NEW') : 0)
}

function FilterGroup({title,children}:{title:string;children:React.ReactNode}) { return <div><h3 className="mb-4 text-[9px] font-medium uppercase tracking-luxury">{title}</h3><div className="space-y-2.5">{children}</div></div> }
function FilterOption({label,selected,onClick}:{label:string;selected:boolean;onClick:()=>void}) { return <button onClick={onClick} className="flex w-full items-center gap-3 text-left text-xs text-black/65 hover:text-black"><span className={`grid h-3.5 w-3.5 place-items-center border ${selected?'border-ink bg-ink':'border-black/30'}`}>{selected&&<span className="h-1 w-1 bg-white"/>}</span>{label}</button> }

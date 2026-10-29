'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatPrice } from '@/lib/types'
import { Search, X, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react'

interface SearchProduct {
  id: string
  name: string
  slug: string
  price: number
  image_urls: string[]
  color: string
  collection: string | null
}

const QUICK_SUGGESTIONS = [
  'Naji Gold Fur',
  'Denim De Ville',
  'Satchel',
  'Fanny Pack',
  'Red Fur',
  'Cream & Gold',
]

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const urlQ = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') : null
      setQuery(urlQ || '')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, price, image_urls, color, collection')
          .eq('active', true)
          .or(
            'name.ilike.%' +
              query +
              '%,color.ilike.%' +
              query +
              '%,collection.ilike.%' +
              query +
              '%,description.ilike.%' +
              query +
              '%',
          )
          .limit(8)

        if (!error && data) {
          setResults(data as SearchProduct[])
        } else {
          setResults([])
        }
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-10 pt-16 sm:pt-24 bg-navy/40 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[32px] sm:rounded-[40px] border border-gray-200/80 shadow-[0_24px_70px_rgba(10,17,40,0.18)] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Atelier Search Input Bar ── */}
        <div className="p-4 sm:p-5 flex items-center gap-3.5 border-b border-gray-100 bg-white shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#F6F6F8] border border-gray-200/80 flex items-center justify-center text-navy shrink-0">
            <Search size={18} strokeWidth={2} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, materials, collections..."
            className="flex-1 font-sans text-base sm:text-lg font-medium text-navy placeholder:text-navy/35 focus:outline-none bg-transparent"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 rounded-full hover:bg-gray-100 text-navy/40 hover:text-navy transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 bg-[#F6F6F8] hover:bg-gray-200/80 border border-gray-200/80 text-[10px] font-semibold uppercase tracking-wider text-navy/60 hover:text-navy transition-colors shrink-0 cursor-pointer"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* ── Scrollable Body Area ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Case 1: Initial state (query is empty) */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Quick Suggestion Pills */}
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#F6F6F8] text-[10px] font-semibold tracking-wider uppercase text-navy/60 mb-3">
                  <Sparkles size={11} className="text-gold" />
                  Atelier Suggestions
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full px-4 py-2 bg-[#F6F6F8] hover:bg-navy hover:text-white border border-gray-200/70 text-xs font-medium text-navy/80 transition-all duration-200 cursor-pointer"
                    >
                      ✦ {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Archive Links */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-navy/40 mb-3 pl-1">
                  Featured Archives
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Link
                    href="/shop/womens"
                    onClick={onClose}
                    className="rounded-[22px] bg-[#F6F6F8] hover:bg-gray-100/90 border border-gray-200/70 p-4 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="font-sans font-bold text-xs uppercase tracking-wider text-navy">
                        Women&apos;s Collection
                      </p>
                      <p className="text-[11px] text-navy/55 mt-0.5">
                        Statement runway & fur bags
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-navy/40 group-hover:text-navy group-hover:translate-x-1 transition-all"
                    />
                  </Link>

                  <Link
                    href="/shop/mens"
                    onClick={onClose}
                    className="rounded-[22px] bg-[#F6F6F8] hover:bg-gray-100/90 border border-gray-200/70 p-4 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="font-sans font-bold text-xs uppercase tracking-wider text-navy">
                        Men&apos;s Archive
                      </p>
                      <p className="text-[11px] text-navy/55 mt-0.5">
                        Structured satchels & belt bags
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-navy/40 group-hover:text-navy group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Case 2: Loading State */}
          {query.trim() && loading && (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy/40 px-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                Searching Atelier Vault…
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-[22px] bg-[#F6F6F8] animate-pulse"
                >
                  <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-[18px] bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded-full bg-gray-200" />
                    <div className="h-3 w-1/3 rounded-full bg-gray-200" />
                  </div>
                  <div className="h-6 w-16 rounded-full bg-gray-200 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Case 3: Empty Results */}
          {query.trim() && !loading && results.length === 0 && (
            <div className="rounded-[28px] bg-[#F6F6F8] border border-gray-200/80 p-8 sm:p-10 text-center my-2">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-navy/40">
                <Search size={20} />
              </div>
              <h3 className="font-sans font-bold text-lg text-navy tracking-tight mb-1">
                No Creations Found
              </h3>
              <p className="text-xs sm:text-sm text-navy/60 max-w-sm mx-auto mb-6">
                No results matched &ldquo;{query}&rdquo;. Try searching for &ldquo;Naji&rdquo;, &ldquo;Denim&rdquo;, &ldquo;Satchel&rdquo;, or &ldquo;Fur&rdquo;.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
              >
                <span>Browse Full Collection</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Case 4: Results List */}
          {query.trim() && !loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-navy/50">
                  ✦ {results.length} {results.length === 1 ? 'Masterpiece' : 'Masterpieces'} Found
                </span>
                <span className="text-[10px] font-sans text-navy/40">
                  FÉROCE Fashion Archive
                </span>
              </div>

              <div className="space-y-1.5">
                {results.map((p) => {
                  const imageSrc =
                    p.image_urls && p.image_urls.length > 0
                      ? p.image_urls[0]
                      : '/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg'

                  return (
                    <Link
                      key={p.id}
                      href={'/product/' + p.slug}
                      onClick={onClose}
                      className="flex items-center justify-between gap-4 p-2.5 sm:p-3 rounded-[24px] hover:bg-[#F6F6F8] border border-transparent hover:border-gray-200/70 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-[18px] overflow-hidden bg-[#ECECEE] border border-gray-100 shrink-0">
                          <img
                            src={imageSrc}
                            alt={p.name}
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-navy/40 truncate">
                            {p.collection || 'Atelier Collection'}
                          </p>
                          <h4 className="font-sans font-bold text-sm sm:text-base text-navy group-hover:text-gold transition-colors truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs text-navy/55 font-sans truncate mt-0.5">
                            {p.color || 'Dallas Atelier'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-sans font-bold text-xs sm:text-sm text-navy">
                          {formatPrice(p.price)}
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 bg-[#4A4D52] group-hover:bg-navy text-white text-[10px] font-semibold uppercase tracking-wider transition-colors shadow-xs">
                          <span>View</span>
                          <ArrowRight size={11} />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Modal Footer Bar ── */}
        <div className="px-6 py-3.5 bg-[#F6F6F8] border-t border-gray-100 flex items-center justify-between text-[11px] text-navy/50 font-sans shrink-0">
          <span>FÉROCE Fashion · Dallas, TX</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  )
}

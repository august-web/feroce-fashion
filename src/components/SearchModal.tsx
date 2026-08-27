'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatPrice } from '@/lib/types'

interface Product { id: string; name: string; slug: string; price: number; image_urls: string[]; color: string; collection: string | null }

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, price, image_urls, color, collection')
        .eq('active', true)
        .or('name.ilike.%' + query + '%,color.ilike.%' + query + '%,collection.ilike.%' + query + '%,description.ilike.%' + query + '%')
        .limit(8)
      setResults(data || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-20 sm:pt-28" style={{ backgroundColor: 'rgba(10,17,40,0.5)' }} onClick={onClose}>
      <div className="bg-white w-full max-w-lg mx-4 border border-line shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-line px-4">
          <svg className="w-4 h-4 text-navy/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bags, colors, collections..."
            className="flex-1 px-3 py-4 text-[16px] font-sans text-navy placeholder:text-navy/40 focus:outline-none bg-transparent" />
          <button onClick={onClose} className="text-navy/40 hover:text-navy text-xs font-sans uppercase tracking-wider">ESC</button>
        </div>
        {query.trim() && (
          <div className="max-h-80 overflow-y-auto">
            {loading && <p className="px-4 py-6 text-xs text-navy/40 text-center">Searching...</p>}
            {!loading && results.length === 0 && (
              <p className="px-4 py-6 text-xs text-navy/40 text-center">No products found for &ldquo;{query}&rdquo;</p>
            )}
            {!loading && results.map((p) => (
              <Link key={p.id} href={'/product/' + p.slug} onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-cream/50 transition-colors border-b border-line/50 last:border-0">
                <div className="h-12 w-12 overflow-hidden border border-line bg-cream flex-shrink-0">
                  {p.image_urls?.[0] && <img src={p.image_urls[0]} alt={p.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{p.name}</p>
                  <p className="text-[10px] text-navy/40">{p.color}{p.collection ? ' · ' + p.collection : ''}</p>
                </div>
                <span className="text-sm font-medium text-navy whitespace-nowrap">{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/types'

interface StickyATCProps {
  product: {
    id: string
    name: string
    price: number
    preorder?: boolean
    image?: string
  }
  selectedColor?: string
  targetTriggerId: string
  onAddToCart: () => void
}

export function StickyATC({
  product,
  selectedColor,
  targetTriggerId,
  onAddToCart,
}: StickyATCProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetTriggerId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar once the primary CTA scrolls out of the viewport
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetTriggerId])

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-md bg-white/95 border-t border-gray-100 px-4 py-3 transition-transform duration-300 ease-out shadow-[0_-8px_30px_rgba(0,0,0,0.08)] ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-navy truncate tracking-tight">{product.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-navy">{formatPrice(product.price)}</span>
            {selectedColor && (
              <span className="text-[11px] text-navy/50 truncate">· {selectedColor}</span>
            )}
          </div>
        </div>
        <button
          onClick={onAddToCart}
          className="bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold rounded-full px-5 py-2.5 uppercase tracking-wider shadow-sm shrink-0 inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-gold" />
          <span>{product.preorder ? 'Pre-Order' : 'Add to Bag'}</span>
        </button>
      </div>
    </div>
  )
}

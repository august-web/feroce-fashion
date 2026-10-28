'use client'

import { useEffect, useState } from 'react'
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

export function StickyATC({ product, selectedColor, targetTriggerId, onAddToCart }: StickyATCProps) {
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
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-line px-4 py-3 transition-transform duration-300 ease-out shadow-[0_-4px_20px_rgba(10,17,40,0.08)] ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-serif text-navy truncate font-medium">{product.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold text-navy">{formatPrice(product.price)}</span>
            {selectedColor && (
              <span className="text-[10px] text-navy/40 truncate">/ {selectedColor}</span>
            )}
          </div>
        </div>
        <button
          onClick={onAddToCart}
          className="btn-primary min-h-[44px] px-5 text-[10px] uppercase tracking-luxury shrink-0"
        >
          {product.preorder ? 'Preorder Now' : 'Add to Bag'}
        </button>
      </div>
    </div>
  )
}

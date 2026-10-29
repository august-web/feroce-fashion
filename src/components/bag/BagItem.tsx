'use client'

import Link from 'next/link'
import type { CartItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'
import { Plus, Minus, Trash2, Sparkles, Check } from 'lucide-react'

interface BagItemProps {
  item: CartItem
}

export function BagItem({ item }: BagItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="rounded-[28px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:border-gray-300">
      <div className="flex gap-4 sm:gap-5 items-center min-w-0">
        {/* Product image */}
        <Link
          href={`/product/${item.slug}`}
          className="relative w-22 h-28 sm:w-28 sm:h-34 shrink-0 rounded-[22px] overflow-hidden bg-[#ECECEE] border border-gray-100 group"
        >
          <img
            src={item.image || '/images/hero-home.jpg'}
            alt={item.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Details */}
        <div className="min-w-0 space-y-1.5">
          <Link
            href={`/product/${item.slug}`}
            className="font-sans font-bold text-base sm:text-lg text-navy hover:text-gold transition-colors line-clamp-1 leading-snug"
          >
            {item.name}
          </Link>

          {item.color && (
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 bg-white border border-gray-200 text-[10px] font-semibold uppercase tracking-wider text-navy/70">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {item.color}
            </div>
          )}

          {/* Pre-Order vs In-Stock Luxury Atelier Status */}
          <div className="pt-0.5">
            {item.preorder ? (
              <div className="inline-flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-amber-50 border border-amber-200/80 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-2xs">
                  <Sparkles size={10} className="text-amber-600" />
                  Atelier Pre-Order · Est. 3–4 Wks
                </span>
                <span className="text-[10px] text-navy/45 font-medium hidden sm:inline">
                  $0 Due Today Reservation Available
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-2xs">
                <Check size={10} strokeWidth={2.5} className="text-emerald-600" />
                In Stock · Ready to Ship (24–48h)
              </span>
            )}
          </div>

          <div className="pt-1">
            <button
              onClick={() => removeItem(item.productId, item.color)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white hover:bg-red-50 text-navy/40 hover:text-red-500 border border-gray-200/60 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              <Trash2 size={12} strokeWidth={1.8} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper + Line Price */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
        {/* Modern Rounded Pill Quantity Stepper */}
        <div className="inline-flex items-center rounded-full bg-white border border-gray-200/90 px-3 py-1.5 shadow-2xs">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus size={13} strokeWidth={2.5} />
          </button>
          <span className="w-8 text-center text-xs font-bold font-sans text-navy">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Total for item */}
        <p className="font-sans font-bold text-base sm:text-lg text-navy shrink-0 text-right">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  )
}

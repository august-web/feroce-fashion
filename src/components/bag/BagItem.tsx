'use client'

import Link from 'next/link'
import type { CartItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'

interface BagItemProps {
  item: CartItem
}

export function BagItem({ item }: BagItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 sm:gap-5 border border-line bg-white p-4 sm:p-5">
      {/* Product image */}
      <Link
        href={`/product/${item.slug}`}
        className="relative h-28 w-24 flex-shrink-0 overflow-hidden border border-line bg-cream sm:h-36 sm:w-28"
      >
        <img
          src={item.image || '/images/hero-home.jpg'}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/product/${item.slug}`}
            className="font-serif text-sm font-medium text-navy hover:text-gold transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-luxury text-navy/40">
            {item.color}
          </p>
          <button
            onClick={() => removeItem(item.productId)}
            className="mt-2 text-[10px] uppercase tracking-luxury text-navy/40 underline underline-offset-2 hover:text-navy transition-colors min-h-[36px] inline-flex items-center"
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center border border-line">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="flex h-11 w-11 items-center justify-center text-sm text-navy hover:bg-cream transition-colors disabled:text-navy/20"
            >
              −
            </button>
            <span className="flex h-11 w-11 items-center justify-center text-xs font-sans text-navy border-x border-line">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="flex h-11 w-11 items-center justify-center text-sm text-navy hover:bg-cream transition-colors"
            >
              +
            </button>
          </div>

          {/* Price */}
          <p className="text-sm font-sans font-medium text-navy">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}

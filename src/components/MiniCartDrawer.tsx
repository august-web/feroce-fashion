'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'

interface MiniCartDrawerProps {
  open: boolean
  onClose: () => void
}

export function MiniCartDrawer({ open, onClose }: MiniCartDrawerProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-navy/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[90] h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-base font-semibold text-navy">
            Your Bag ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-navy/50 hover:text-navy transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-navy/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 10a4 4 0 01-8 0" />
                <path d="M3.103 6.034h17.794" />
                <path d="M3.4 5.467a2 2 0 00-.4 1.2V20a2 2 0 002 2h14a2 2 0 002-2V6.667a2 2 0 00-.4-1.2l-2-2.667A2 2 0 0017 2H7a2 2 0 00-1.6.8z" />
              </svg>
            </div>
            <p className="text-sm text-navy/50 mb-1">Your bag is empty</p>
            <p className="text-[10px] text-navy/30">Add items to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100%-60px)]">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.productId + item.color} className="flex gap-3 border-b border-line/50 pb-4 last:border-0">
                  {/* Thumbnail */}
                  <div className="h-20 w-16 flex-shrink-0 bg-cream border border-line overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-navy truncate">{item.name}</p>
                    <p className="text-[10px] text-navy/40 mt-0.5">{item.color}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center text-navy/60 hover:text-navy text-xs transition-colors"
                        >
                          −
                        </button>
                        <span className="h-7 w-7 flex items-center justify-center text-[11px] font-medium text-navy border-x border-line">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center text-navy/60 hover:text-navy text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-medium text-navy">{formatPrice(item.price * item.quantity)}</span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-[10px] text-navy/40 hover:text-red-500 transition-colors mt-1.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-line px-5 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-navy/60">Subtotal</span>
                <span className="text-sm font-serif font-semibold text-navy">{formatPrice(subtotal())}</span>
              </div>

              <Link
                href="/bag"
                onClick={onClose}
                className="block w-full btn-primary py-3 text-center text-[11px] min-h-[44px]"
              >
                PROCEED TO CHECKOUT
              </Link>

              <button
                onClick={onClose}
                className="block w-full text-center text-[10px] uppercase tracking-[0.2em] text-navy/50 hover:text-navy transition-colors py-2"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

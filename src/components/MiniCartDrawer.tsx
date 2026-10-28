'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'

interface MiniCartDrawerProps {
  open?: boolean
  onClose?: () => void
}

const FREE_SHIPPING_THRESHOLD = 200

export function MiniCartDrawer({ open: propOpen, onClose: propOnClose }: MiniCartDrawerProps = {}) {
  const { items, subtotal, updateQuantity, removeItem, isMiniCartOpen, closeMiniCart } = useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  const open = propOpen !== undefined ? propOpen : isMiniCartOpen
  const onClose = propOnClose || closeMiniCart

  // Close on escape + lock body scroll
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
  const currentSubtotal = subtotal()
  const freeShippingDelta = FREE_SHIPPING_THRESHOLD - currentSubtotal
  const shippingProgress = Math.min(100, Math.max(0, (currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100))

  // Always render nothing when not mounted to avoid SSR issues
  if (typeof window === 'undefined') return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(10, 17, 40, 0.55)',
          backdropFilter: 'blur(6px)',
          transition: 'opacity 300ms ease',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 9999,
          height: '100dvh',
          width: 'min(90vw, 25rem)',
          maxWidth: '25rem',
          backgroundColor: '#fff',
          boxShadow: open ? '-8px 0 32px rgba(10,17,40,0.2)' : 'none',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 className="font-serif text-base font-semibold tracking-tight text-navy">
              Shopping Bag ({totalItems})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-navy/50 hover:text-navy transition-colors rounded-full hover:bg-cream"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator (Glamaholic style) */}
        <div className="px-5 py-3.5 bg-cream/50 border-b border-line flex-shrink-0">
          <p className="text-[11px] font-sans font-medium text-navy/80">
            {freeShippingDelta <= 0 ? (
              <span className="text-gold font-semibold">✨ You’ve unlocked Complimentary Shipping</span>
            ) : (
              <span>Add <strong className="text-navy">${freeShippingDelta.toFixed(2)}</strong> more for Complimentary Express Shipping</span>
            )}
          </p>
          <div className="mt-2 h-1.5 w-full bg-line/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-400 ease-out"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-navy/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 10a4 4 0 01-8 0" />
                <path d="M3.103 6.034h17.794" />
                <path d="M3.4 5.467a2 2 0 00-.4 1.2V20a2 2 0 002 2h14a2 2 0 002-2V6.667a2 2 0 00-.4-1.2l-2-2.667A2 2 0 0017 2H7a2 2 0 00-1.6.8z" />
              </svg>
            </div>
            <p className="font-serif text-base text-navy font-medium mb-1.5">Your bag is empty</p>
            <p className="text-xs text-navy/50 max-w-xs mb-6">Explore our latest Dallas-designed luxury handbag drops and signature pieces.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="btn-primary text-[10px] uppercase tracking-luxury px-6 py-3 min-h-[44px] inline-flex items-center justify-center"
            >
              Shop Handbags
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 divide-y divide-line/60">
              {items.map((item) => (
                <div key={item.productId + (item.color || '')} className="flex gap-3.5 pt-4 first:pt-0">
                  {/* Thumbnail */}
                  <div className="h-20 w-16 flex-shrink-0 bg-cream border border-line overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-xs font-serif font-medium text-navy truncate leading-snug">{item.name}</p>
                        <button
                          onClick={() => removeItem(item.productId, item.color)}
                          className="text-[10px] text-navy/40 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      {item.color && (
                        <p className="text-[10px] text-navy/50 uppercase tracking-luxury mt-0.5">{item.color}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Qty controls */}
                      <div className="flex items-center border border-line bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color)}
                          className="h-8 w-8 flex items-center justify-center text-navy/60 hover:text-navy text-xs hover:bg-cream transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="h-8 w-8 flex items-center justify-center text-[11px] font-medium text-navy border-x border-line">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color)}
                          className="h-8 w-8 flex items-center justify-center text-navy/60 hover:text-navy text-xs hover:bg-cream transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="text-xs font-semibold text-navy tracking-wide">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-line px-5 py-4 space-y-3 bg-white flex-shrink-0">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-luxury text-navy/60">Estimated Total</span>
                <span className="text-base font-serif font-semibold text-navy">{formatPrice(currentSubtotal)}</span>
              </div>
              <p className="text-[10px] text-navy/50">Taxes, pre-order reserves, and shipping calculated at checkout.</p>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full btn-primary py-3.5 text-center text-[11px] min-h-[48px] uppercase tracking-luxury flex items-center justify-center"
              >
                PROCEED TO CHECKOUT
              </Link>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/bag"
                  onClick={onClose}
                  className="text-[10px] uppercase tracking-luxury text-navy/50 hover:text-navy underline"
                >
                  View Full Bag
                </Link>
                <div className="flex items-center gap-1 text-[10px] text-navy/50">
                  <svg className="w-3 h-3 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <span>Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}

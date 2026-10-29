'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'

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

  if (typeof window === 'undefined') return null

  return createPortal(
    <>
      {/* ── Modern Frosted Backdrop ── */}
      <div
        className={`fixed inset-0 z-[9998] bg-navy/40 backdrop-blur-md transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer with Elegant Rounded Edge ── */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[9999] h-[100dvh] w-full max-w-[420px] bg-white rounded-l-[32px] sm:rounded-l-[40px] shadow-[-16px_0_48px_rgba(10,17,40,0.18)] flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Top Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 shrink-0 bg-white">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 bg-[#F6F6F8] text-[10px] font-semibold uppercase tracking-wider text-navy/60 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Dallas Atelier
            </div>
            <h2 className="font-sans font-bold text-lg text-navy tracking-tight flex items-center gap-2">
              <span>Shopping Bag</span>
              <span className="rounded-full px-2.5 py-0.5 bg-[#F6F6F8] text-xs font-semibold text-navy/70">
                {totalItems}
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F6F6F8] hover:bg-gray-200/80 flex items-center justify-center text-navy/60 hover:text-navy transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        <div className="px-6 py-3.5 bg-[#F6F6F8] border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-sans font-semibold mb-2">
            {freeShippingDelta <= 0 ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <Sparkles size={12} className="text-gold" />
                Complimentary Express Shipping Unlocked
              </span>
            ) : (
              <span className="text-navy/70">
                Add <strong className="text-navy">${freeShippingDelta.toFixed(2)}</strong> for Free Express Delivery
              </span>
            )}
            <span className="text-[10px] text-navy/40 font-mono">
              {Math.round(shippingProgress)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-500 ease-out rounded-full"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* ── Content: Empty State or Items List ── */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F6F6F8] border border-gray-200/80 flex items-center justify-center mb-5 shadow-xs">
              <ShoppingBag className="w-9 h-9 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans font-bold text-xl text-navy tracking-tight mb-2">
              Your Bag is Empty
            </h3>
            <p className="text-xs text-navy/60 max-w-xs mb-8 font-sans leading-relaxed">
              Explore our signature Dallas-crafted luxury handbag drops and limited silhouettes.
            </p>
            <Link
              href="/shop"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId + (item.color || '')}
                  className="rounded-[24px] bg-[#F6F6F8] border border-gray-200/70 p-3.5 flex gap-3.5 items-center transition-all hover:border-gray-300/80"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={onClose}
                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-[18px] overflow-hidden bg-[#ECECEE] border border-gray-100 shrink-0 block group"
                  >
                    <img
                      src={item.image || '/images/hero-home.jpg'}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="font-sans font-bold text-xs sm:text-sm text-navy hover:text-gold transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId, item.color)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-red-50 text-navy/40 hover:text-red-500 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} strokeWidth={1.8} />
                        </button>
                      </div>
                      {item.color && (
                        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-wider mt-0.5">
                          {item.color}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200/50">
                      {/* Qty Pill Stepper */}
                      <div className="inline-flex items-center rounded-full bg-white border border-gray-200/80 px-2 py-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} strokeWidth={2.5} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-sans text-navy">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="font-sans font-bold text-xs sm:text-sm text-navy">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer Bar ── */}
            <div className="border-t border-gray-100 px-6 py-5 space-y-3.5 bg-white shrink-0 shadow-[0_-8px_24px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-semibold text-navy/60">
                  Estimated Subtotal
                </span>
                <span className="font-sans font-bold text-lg text-navy">
                  {formatPrice(currentSubtotal)}
                </span>
              </div>
              <p className="text-[10px] text-navy/45 leading-relaxed font-sans">
                Taxes, atelier pre-order allocations, and express shipping calculated at checkout.
              </p>

              {/* Primary Checkout CTA */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>

              {/* View Full Bag & Encryption Tag */}
              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/bag"
                  onClick={onClose}
                  className="rounded-full px-3.5 py-1.5 bg-[#F6F6F8] hover:bg-gray-200/80 text-[10px] uppercase tracking-wider font-semibold text-navy/70 hover:text-navy transition-colors"
                >
                  View Full Bag →
                </Link>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-navy/50 uppercase tracking-wider">
                  <ShieldCheck size={13} className="text-gold" />
                  <span>Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body,
  )
}

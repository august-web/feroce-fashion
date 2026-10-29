'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'
import {
  Sparkles,
  CheckCircle2,
  PackageCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  Mail,
} from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isPreorder = searchParams.get('type') === 'preorder'
  const [isSplitPreorder, setIsSplitPreorder] = useState(searchParams.get('type') === 'split_preorder')
  const [preorderBalanceDue, setPreorderBalanceDue] = useState<number | null>(null)
  const customOrderId = searchParams.get('order_id')
  const customResNum = searchParams.get('res_num')

  const { clearCart } = useCartStore()
  const [cleared, setCleared] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(customResNum || customOrderId || null)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }

    // If Stripe session ID provided, retrieve order ID
    if (sessionId && !orderNumber) {
      fetch(`/api/checkout/stripe/session-status?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.orderId) setOrderNumber(data.orderId)
          if (data.splitPreorder) {
            setIsSplitPreorder(true)
            setPreorderBalanceDue(data.preorderBalanceDue)
          }
        })
        .catch(() => {})
    }
  }, [cleared, clearCart, sessionId, orderNumber])

  return (
    <section className="bg-white min-h-[85vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Container Card */}
        <div className="rounded-[36px] sm:rounded-[44px] bg-[#F6F6F8] border border-gray-200/80 p-8 sm:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.03)] space-y-6">
          {/* Emblem / Icon */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
              {isPreorder || isSplitPreorder ? (
                <Sparkles size={32} className="text-gold" />
              ) : (
                <CheckCircle2 size={32} className="text-emerald-700" />
              )}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>
          </div>

          {/* Subtitle Pill */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-white border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            {isPreorder
              ? '• DALLAS ATELIER ALLOCATION SECURED'
              : isSplitPreorder
              ? '• IN-STOCK PAYMENT CONFIRMED · ATELIER ALLOCATION RESERVED'
              : '• ORDER CONFIRMED · DALLAS, TX'}
          </div>

          {/* Headline */}
          <h1 className="font-sans font-bold text-3xl sm:text-5xl text-navy tracking-[-0.035em]">
            {isPreorder ? 'Allocation Confirmed' : isSplitPreorder ? 'In-Stock Payment Confirmed' : 'Thank You for Your Order'}
          </h1>

          {/* Main Description */}
          <p className="text-sm sm:text-base text-navy/70 font-sans max-w-lg mx-auto leading-relaxed">
            {isPreorder ? (
              <>
                Your limited Dallas atelier pre-order reservation is officially registered.{' '}
                <strong className="text-navy font-bold">$0 was billed today.</strong> You will receive email notifications as our craftspeople begin bench production.
              </>
            ) : isSplitPreorder ? (
              <>
                Payment for your ready-to-ship pieces has been processed. Your Dallas atelier pre-order allocation is reserved, with the remaining balance due when production is complete.
              </>
            ) : (
              <>
                Your payment has been processed and your order is being prepared for insured dispatch from our Dallas atelier.
              </>
            )}
          </p>

          {/* Order / Reservation Number Card */}
          {orderNumber && (
            <div className="inline-block rounded-full bg-white border border-gray-200/90 px-6 py-2.5 shadow-2xs">
              <p className="text-xs font-mono font-bold text-navy tracking-wide">
                {isPreorder ? 'RESERVATION ' : 'ORDER '}
                <span className="text-gold">
                  #{orderNumber.startsWith('RES-') ? orderNumber : orderNumber.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>
          )}

          {/* If Pre-Order: Dedicated Atelier Schedule Timeline */}
          {isSplitPreorder && preorderBalanceDue !== null && (
            <div className="inline-block rounded-full bg-amber-50 border border-amber-200 px-6 py-2.5">
              <p className="text-xs font-semibold text-amber-950">
                Estimated pre-order balance at dispatch: {formatPrice(preorderBalanceDue)}
              </p>
            </div>
          )}

          {(isPreorder || isSplitPreorder) && (
            <div className="rounded-[28px] bg-white border border-gray-200/80 p-6 sm:p-8 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-navy">
                  Dallas Atelier Production Schedule
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  Slot Reserved
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
                    <Clock size={13} className="text-gold" />
                    <span>Weeks 1–2</span>
                  </div>
                  <p className="text-[11px] text-navy/60 leading-snug">
                    Material sourcing, custom hardware plating, and pattern cutting.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
                    <Sparkles size={13} className="text-gold" />
                    <span>Weeks 2–3</span>
                  </div>
                  <p className="text-[11px] text-navy/60 leading-snug">
                    Hand-stitching, leather edge painting, and quality control inspection.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
                    <PackageCheck size={13} className="text-emerald-700" />
                    <span>Weeks 3–4</span>
                  </div>
                  <p className="text-[11px] text-navy/60 leading-snug">
                    Signature Dallas dust bag boxing and insured white-glove delivery.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-[11px] text-navy/55">
                <Mail size={13} className="text-gold shrink-0" />
                <span>
                  Prior to dispatch, you will receive a secure finalization link to complete dispatch payment.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>Explore Boutique</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-wider text-navy bg-white border border-gray-200 hover:border-navy transition-all duration-300 cursor-pointer shadow-xs"
            >
              Back to Home
            </Link>
          </div>

          {/* Trust Footer */}
          <div className="pt-4 border-t border-gray-200/70 flex flex-wrap items-center justify-center gap-6 text-[11px] text-navy/50 font-sans">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-gold" />
              <span>Complimentary Dallas Dust Bag Included</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-gold" />
              <span>Concierge Support: contact@ferocefashionff.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-white min-h-[85vh] flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-full animate-pulse mx-auto mb-6" />
            <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse mx-auto mb-4" />
            <div className="h-4 w-64 bg-gray-100 rounded-full animate-pulse mx-auto" />
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  Clock,
  PackageCheck,
  Truck,
  CreditCard,
  Gift,
  HelpCircle,
  Smartphone,
  ChevronDown,
} from 'lucide-react'
import type { CartItem } from '@/lib/types'

const US_STATES = [
  'TX', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
  'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'UT',
  'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const DEMO_ITEMS: CartItem[] = [
  {
    productId: 'demo-1',
    name: 'Naji Gold Fur Bag (XL)',
    slug: 'naji-gold-fur-xl',
    price: 443.0,
    image: '/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg',
    color: 'Gold Fur',
    quantity: 1,
    preorder: false,
  },
  {
    productId: 'demo-2',
    name: 'FÉROCE Satchel Bag',
    slug: 'feroce-satchel-bag',
    price: 300.0,
    image: '/images/products/Satchel/Mens -- Satchel bag.jpg',
    color: 'Classic Monogram',
    quantity: 1,
    preorder: true,
  },
]

export function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === '1'

  const { items: storeItems, clearCart } = useCartStore()
  const items = storeItems.length > 0 ? storeItems : (isDemo ? DEMO_ITEMS : [])

  // Form states
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [suite, setSuite] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('TX')
  const [zip, setZip] = useState('')
  const [saveInfo, setSaveInfo] = useState(true)

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'white_glove'>('standard')

  // Promo Code
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [discountCents, setDiscountCents] = useState(0)

  // Pre-order checkout options
  const hasPreorders = items.some((i) => i.preorder)
  const allPreorders = items.length > 0 && items.every((i) => i.preorder)
  const hasInStock = items.some((i) => !i.preorder)

  // Payment Option selection:
  // - zero_down: Reserve allocation today with $0 down (for pre-orders)
  // - pay_full: Authorize total balance now via Stripe
  const [paymentChoice, setPaymentChoice] = useState<'zero_down' | 'pay_full'>(
    hasPreorders ? 'zero_down' : 'pay_full',
  )

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Subtotal calculations
  const inStockSubtotal = items
    .filter((i) => !i.preorder)
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
  const preorderSubtotal = items
    .filter((i) => i.preorder)
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
  const fullSubtotal = inStockSubtotal + preorderSubtotal

  // Shipping cost
  const baseShippingCost = fullSubtotal >= 200 ? 0 : 15
  const shippingCost = shippingMethod === 'white_glove' ? 25 : baseShippingCost

  // Tax and Grand Total
  const estimatedTax = Math.round(fullSubtotal * 0.0825 * 100) / 100
  const fullOrderTotal = Math.max(0, fullSubtotal + shippingCost + estimatedTax - discountCents / 100)

  // Amount due today vs due upon dispatch
  let dueToday = fullOrderTotal
  let dueUponDispatch = 0

  if (hasPreorders && paymentChoice === 'zero_down') {
    if (allPreorders) {
      dueToday = 0
      dueUponDispatch = fullOrderTotal
    } else {
      // Mixed: Charge only in-stock today; defer pre-order until atelier completion
      const inStockTax = Math.round(inStockSubtotal * 0.0825 * 100) / 100
      dueToday = inStockSubtotal + shippingCost + inStockTax - discountCents / 100
      dueUponDispatch = Math.max(0, fullOrderTotal - dueToday)
    }
  }

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'FEROCE10' || promoCode.trim().toUpperCase() === 'ATELIER') {
      setPromoApplied(true)
      setDiscountCents(Math.round(fullSubtotal * 0.1 * 100))
    } else if (promoCode.trim()) {
      setPromoApplied(true)
      setDiscountCents(2500) // $25 courtesy credit
    }
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!items.length) {
      setErrorMsg('Your bag is empty.')
      return
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !address.trim() || !city.trim() || !zip.trim()) {
      setErrorMsg('Please complete all required dispatch and contact fields.')
      return
    }

    setLoading(true)
    const fullName = `${firstName.trim()} ${lastName.trim()}`

    try {
      // If customer chose $0 Pre-Order Reservation for an all-preorder cart:
      if (hasPreorders && paymentChoice === 'zero_down' && allPreorders) {
        const res = await fetch('/api/checkout/preorder/reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: {
              fullName,
              email,
              phone,
              address,
              suite,
              city,
              state,
              zip,
              country: 'US',
            },
            items: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              color: i.color,
            })),
            reservationOption: 'zero_down',
          }),
        })

        const data = await res.json()
        if (data.success && data.orderId) {
          clearCart()
          router.push(`/checkout/success?type=preorder&order_id=${data.orderId}&res_num=${data.reservationNumber}`)
          return
        } else {
          setErrorMsg(data.error || 'Failed to complete pre-order reservation. Please try again.')
          setLoading(false)
        }
      } else {
        // Stripe checkout session (in-stock, mixed, or full prepayment)
        const res = await fetch('/api/checkout/stripe/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              slug: i.slug,
              price: i.price,
              image: i.image,
              color: i.color,
              quantity: i.quantity,
            })),
            preorderPaymentChoice: paymentChoice,
            shippingMethod,
          }),
        })

        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setErrorMsg(data.error || 'Failed to connect to secure Stripe checkout. Please try again.')
          setLoading(false)
        }
      }
    } catch {
      setErrorMsg('A network error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-8 sm:p-12 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 text-navy">
            <Lock size={22} className="text-gold" />
          </div>
          <h1 className="font-sans font-bold text-2xl text-navy tracking-tight mb-2">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-navy/60 font-sans mb-6 leading-relaxed">
            Please select pieces from our Dallas atelier collection before accessing secure checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider rounded-full px-8 py-3.5 transition-all shadow-xs"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Atelier Subheader / Header ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                • ATELIER CHECKOUT · DALLAS, TX
              </div>
              <h1 className="font-sans font-bold text-navy text-3xl sm:text-5xl tracking-[-0.035em] leading-[1.05]">
                {hasPreorders && allPreorders
                  ? 'Pre-Order Allocation Checkout'
                  : 'Secure Atelier Checkout'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 rounded-full px-4 py-2">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <Link
                href="/bag"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy/60 hover:text-navy transition-colors py-2"
              >
                <ArrowLeft size={14} />
                <span>Return to Bag</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Checkout Form & Summary Grid ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleConfirmOrder}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
              {/* ── LEFT COLUMN: Client Information & Allocation Preferences ── */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                {/* Error Banner */}
                {errorMsg && (
                  <div className="rounded-[24px] bg-red-50 border border-red-200 p-4 text-xs font-medium text-red-700 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Express Checkout Indicator Bar */}
                <div className="rounded-[28px] bg-[#F6F6F8] border border-gray-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-navy/70">
                    <Smartphone size={15} className="text-navy" />
                    <span>Express Digital Wallet Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-navy shadow-2xs">
                       Apple Pay
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-navy shadow-2xs">
                      Google Pay
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-navy shadow-2xs">
                      Klarna
                    </span>
                  </div>
                </div>

                {/* 1. Contact Information Card */}
                <div className="rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-sans font-bold text-lg sm:text-xl text-navy tracking-tight flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold shadow-2xs">
                        1
                      </span>
                      <span>Client & Dispatch Notifications</span>
                    </h2>
                    <Link
                      href="/login"
                      className="text-[11px] font-semibold text-navy/60 hover:text-navy underline underline-offset-4"
                    >
                      Already a Member? Sign In
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                      <p className="text-[10px] text-navy/45 mt-1.5 pl-2">
                        Milestone Dallas crafting updates and real-time dispatch tracking will be sent here.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Zhanne'"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Lyles"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        Mobile Phone (For Dispatch Delivery Alerts)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (214) 555-0199"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-navy/70 select-none">
                      <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        className="w-4 h-4 rounded text-navy focus:ring-navy border-gray-300"
                      />
                      <span>Save my details for expedited Dallas Atelier private access and vault privileges</span>
                    </label>
                  </div>
                </div>

                {/* 2. Atelier Shipping Address Card */}
                <div className="rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-sans font-bold text-lg sm:text-xl text-navy tracking-tight flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold shadow-2xs">
                        2
                      </span>
                      <span>Delivery Destination</span>
                    </h2>
                    <span className="text-[10px] uppercase font-bold text-navy/50 tracking-wider">
                      United States
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="1900 Elm Street"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        Apartment, Suite, Unit, Penthouse (Optional)
                      </label>
                      <input
                        type="text"
                        value={suite}
                        onChange={(e) => setSuite(e.target.value)}
                        placeholder="Suite 400"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Dallas"
                        className="w-full rounded-full bg-white border border-gray-200/90 px-5 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                          State *
                        </label>
                        <div className="relative">
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full appearance-none rounded-full bg-white border border-gray-200/90 pl-5 pr-8 py-3.5 text-xs font-sans text-navy focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px] cursor-pointer"
                          >
                            {US_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/50 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-1.5 pl-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder="75201"
                          className="w-full rounded-full bg-white border border-gray-200/90 px-4 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[48px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Delivery Method Selection Card */}
                <div className="rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-sans font-bold text-lg sm:text-xl text-navy tracking-tight flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold shadow-2xs">
                        3
                      </span>
                      <span>Delivery Method</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Standard Insured */}
                    <div
                      onClick={() => setShippingMethod('standard')}
                      className={`cursor-pointer rounded-[24px] p-4.5 border transition-all duration-200 ${
                        shippingMethod === 'standard'
                          ? 'bg-white border-navy ring-1 ring-navy shadow-xs'
                          : 'bg-white/60 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            shippingMethod === 'standard'
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {shippingMethod === 'standard' && <Check size={11} strokeWidth={3} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-sans font-bold text-xs sm:text-sm text-navy">
                              Atelier Insured Ground
                            </span>
                            <span className="font-bold text-xs text-emerald-800">
                              {baseShippingCost === 0 ? 'Complimentary' : '$15.00'}
                            </span>
                          </div>
                          <p className="text-[11px] text-navy/60 font-sans mt-0.5 leading-snug">
                            3–5 business days dispatch for in-stock pieces. Dallas dust bag and rigid box included.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* White-Glove Priority */}
                    <div
                      onClick={() => setShippingMethod('white_glove')}
                      className={`cursor-pointer rounded-[24px] p-4.5 border transition-all duration-200 ${
                        shippingMethod === 'white_glove'
                          ? 'bg-white border-navy ring-1 ring-navy shadow-xs'
                          : 'bg-white/60 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            shippingMethod === 'white_glove'
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {shippingMethod === 'white_glove' && <Check size={11} strokeWidth={3} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-sans font-bold text-xs sm:text-sm text-navy flex items-center gap-1">
                              <Sparkles size={12} className="text-gold" />
                              White-Glove Express
                            </span>
                            <span className="font-bold text-xs text-navy">$25.00</span>
                          </div>
                          <p className="text-[11px] text-navy/60 font-sans mt-0.5 leading-snug">
                            Priority bench assembly, premium velvet pouch, and direct signature required on delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Pre-Order Allocation Preferences (For Pre-Order & Mixed Carts) */}
                {hasPreorders && (
                  <div className="rounded-[32px] sm:rounded-[40px] bg-amber-50/70 border border-amber-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-amber-100 border border-amber-200/80 text-[10px] font-bold tracking-wider uppercase text-amber-950 mb-2 shadow-2xs">
                          <Sparkles size={11} className="text-amber-700" />
                          Dallas Atelier Made-to-Order
                        </div>
                        <h2 className="font-sans font-bold text-lg sm:text-xl text-navy tracking-tight flex items-center gap-2.5">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold shadow-2xs">
                            4
                          </span>
                          <span>Pre-Order Allocation Preferences</span>
                        </h2>
                      </div>
                    </div>

                    {/* Dallas Crafting Timeline Bar */}
                    <div className="rounded-[24px] bg-white border border-amber-200/80 p-5 space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-navy">
                        Dallas Atelier Handcrafted Production Schedule
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="rounded-[18px] bg-[#F6F6F8] p-3 flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                            <Clock size={13} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-navy">Phase 1 · Sourcing & Cut</p>
                            <p className="text-[10px] text-navy/55">Premium denim & leather cut in Dallas</p>
                          </div>
                        </div>

                        <div className="rounded-[18px] bg-[#F6F6F8] p-3 flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                            <Sparkles size={13} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-navy">Phase 2 · Bench Assembly</p>
                            <p className="text-[10px] text-navy/55">Gold hardware & handcrafted stitching</p>
                          </div>
                        </div>

                        <div className="rounded-[18px] bg-[#F6F6F8] p-3 flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-800">
                            <PackageCheck size={13} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-navy">Phase 3 · White-Glove Dispatch</p>
                            <p className="text-[10px] text-navy/55">Insured delivery in 3–4 weeks</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pre-Order Payment Mode Choices */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 pl-1">
                        Choose Pre-Order Allocation Term:
                      </label>

                      {/* Choice 1: $0 Due Today Reservation (Recommended) */}
                      <div
                        onClick={() => setPaymentChoice('zero_down')}
                        className={`cursor-pointer rounded-[24px] p-5 border transition-all duration-200 ${
                          paymentChoice === 'zero_down'
                            ? 'bg-white border-navy ring-1 ring-navy shadow-xs'
                            : 'bg-white/60 border-amber-200/80 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              paymentChoice === 'zero_down'
                                ? 'border-navy bg-navy text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {paymentChoice === 'zero_down' && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-sans font-bold text-sm text-navy">
                                {allPreorders
                                  ? 'Reserve Atelier Allocation — $0 Due Today'
                                  : 'Smart Split: Pay In-Stock Now, Reserve Pre-Order ($0 Today)'}
                              </p>
                              <span className="rounded-full px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                                Recommended
                              </span>
                            </div>
                            <p className="text-xs text-navy/60 font-sans mt-1 leading-relaxed">
                              {allPreorders
                                ? 'Guarantees your numbered allocation slot in the Dallas workshop. No charge today. You will receive progress milestone notifications and will only be billed when your piece completes final atelier inspection.'
                                : 'Pay only for ready-to-ship piece(s) today for immediate 24–48h dispatch. Your made-to-order pre-order is reserved with $0 today and billed when handcrafted.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Choice 2: Pay in Full */}
                      <div
                        onClick={() => setPaymentChoice('pay_full')}
                        className={`cursor-pointer rounded-[24px] p-5 border transition-all duration-200 ${
                          paymentChoice === 'pay_full'
                            ? 'bg-white border-navy ring-1 ring-navy shadow-xs'
                            : 'bg-white/60 border-amber-200/80 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              paymentChoice === 'pay_full'
                                ? 'border-navy bg-navy text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {paymentChoice === 'pay_full' && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div className="flex-1">
                            <p className="font-sans font-bold text-sm text-navy">
                              Pay Entire Order Now via Stripe
                            </p>
                            <p className="text-xs text-navy/60 font-sans mt-1 leading-relaxed">
                              Authorize full payment upfront via credit card, Apple Pay, or Google Pay. Guarantees priority bench queue and unified billing.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Payment Details Card (When Paying Today) */}
                {(!hasPreorders || paymentChoice !== 'zero_down' || hasInStock) && (
                  <div className="rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-sans font-bold text-lg sm:text-xl text-navy tracking-tight flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold shadow-2xs">
                          {hasPreorders ? '5' : '4'}
                        </span>
                        <span>Payment Method</span>
                      </h2>
                      <span className="text-[10px] uppercase font-semibold text-navy/50 tracking-wider">
                        Stripe Secure Gateway
                      </span>
                    </div>

                    <div className="rounded-[24px] bg-white border border-gray-200/80 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-navy" />
                          <span className="font-sans font-bold text-sm text-navy">
                            Credit / Debit Card or Digital Wallet
                          </span>
                        </div>
                        <span className="rounded-full px-2.5 py-0.5 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-navy/70">
                          Encrypted
                        </span>
                      </div>
                      <p className="text-xs text-navy/60 font-sans leading-relaxed">
                        Card details and digital wallet options (Apple Pay, Google Pay) will be securely finalized in Stripe’s hosted gateway upon clicking the action button.
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-navy/50 font-sans">
                        <Lock size={12} className="text-gold" />
                        <span>All transactions are 256-bit SSL encrypted. No full card numbers are stored on our servers.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust and Atelier Security Footer Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-6 text-[11px] text-navy/60 font-sans">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-gold" />
                    <span>256-Bit Encrypted Atelier Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-gold" />
                    <span>Dallas Atelier Certificate of Authenticity Included</span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: Allocation Manifest & Sticky Summary ── */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-28 space-y-6">
                  <div className="rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 mb-2 shadow-2xs">
                        <Sparkles size={11} className="text-gold" />
                        Allocation Manifest
                      </div>
                      <h2 className="font-sans font-bold text-xl sm:text-2xl text-navy tracking-tight">
                        Order Summary
                      </h2>
                    </div>

                    {/* Item List */}
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={`${item.productId}-${item.color}`}
                          className="rounded-[22px] bg-white border border-gray-200/70 p-3 flex gap-3 items-center"
                        >
                          <div className="w-14 h-16 rounded-[14px] overflow-hidden bg-[#ECECEE] shrink-0 border border-gray-100">
                            <img
                              src={item.image || '/images/hero-home.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans font-bold text-xs text-navy truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-navy/50 mt-0.5">
                              Qty: {item.quantity} {item.color ? `· ${item.color}` : ''}
                            </p>
                            <div className="mt-1">
                              {item.preorder ? (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-amber-50 text-[9px] font-bold uppercase tracking-wider text-amber-900 border border-amber-200/70">
                                  <Sparkles size={9} className="text-amber-600" />
                                  Pre-Order · 3-4 Wks
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-emerald-50 text-[9px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/70">
                                  In Stock · 24-48h
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="font-sans font-bold text-xs text-navy shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input Capsule */}
                    <div className="pt-2">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo or gift code"
                          className="w-full rounded-full bg-white border border-gray-200/90 pl-4 pr-20 py-2.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs min-h-[42px]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="mt-1.5 text-[11px] text-emerald-700 font-medium font-sans flex items-center gap-1 pl-2">
                          <Check size={12} strokeWidth={2.5} />
                          Promo applied successfully
                        </p>
                      )}
                    </div>

                    {/* Financial Calculations */}
                    <div className="space-y-3 text-xs sm:text-sm font-sans pt-2 border-t border-gray-200/70">
                      {hasPreorders && !allPreorders && (
                        <>
                          <div className="flex justify-between items-center text-navy/70">
                            <span>Ready to Ship Subtotal</span>
                            <span className="font-semibold text-navy">{formatPrice(inStockSubtotal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-amber-900">
                            <span className="flex items-center gap-1">
                              <Sparkles size={11} className="text-amber-600" />
                              Pre-Order Allocation
                            </span>
                            <span className="font-semibold">{formatPrice(preorderSubtotal)}</span>
                          </div>
                        </>
                      )}

                      {(!hasPreorders || allPreorders) && (
                        <div className="flex justify-between items-center text-navy/70">
                          <span>Subtotal ({items.length} {items.length === 1 ? 'piece' : 'pieces'})</span>
                          <span className="font-semibold text-navy">{formatPrice(fullSubtotal)}</span>
                        </div>
                      )}

                      {discountCents > 0 && (
                        <div className="flex justify-between items-center text-emerald-800">
                          <span>Promotional Courtesy</span>
                          <span className="font-semibold">-{formatPrice(discountCents / 100)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-navy/70">
                        <span>
                          {shippingMethod === 'white_glove' ? 'White-Glove Priority' : 'Insured Shipping'}
                        </span>
                        <span className="font-semibold">
                          {shippingCost === 0 ? (
                            <span className="text-emerald-700">Complimentary</span>
                          ) : (
                            formatPrice(shippingCost)
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-navy/70">
                        <span>Estimated Sales Tax (8.25%)</span>
                        <span className="font-semibold text-navy">{formatPrice(estimatedTax)}</span>
                      </div>

                      {/* Prominent Due Today Breakdown */}
                      <div className="pt-3 border-t border-gray-200/80 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-sans font-bold text-base text-navy">Due Today:</span>
                          <span className="font-sans font-bold text-2xl text-navy tracking-tight">
                            {formatPrice(dueToday)}
                          </span>
                        </div>
                        {hasPreorders && paymentChoice === 'zero_down' && (
                          <div className="flex justify-between items-baseline text-xs text-amber-900 font-medium pt-1">
                            <span>Due Upon Dispatch (3–4 Wks):</span>
                            <span className="font-bold">{formatPrice(dueUponDispatch)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Klarna Installments Micro Note */}
                    <div className="rounded-[18px] bg-white border border-gray-200/70 p-3 flex items-center justify-between text-[11px] text-navy/60">
                      <span>4 interest-free payments of <strong>${(dueToday / 4).toFixed(2)}</strong></span>
                      <span className="font-bold text-[10px] uppercase text-navy">Klarna</span>
                    </div>

                    {/* Primary Confirmation Action Capsule */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Confirming Allocation…
                          </span>
                        ) : hasPreorders && paymentChoice === 'zero_down' && allPreorders ? (
                          <>
                            <Sparkles size={14} className="text-gold" />
                            <span>Confirm Pre-Order Reservation ($0 Today)</span>
                            <ArrowRight size={14} />
                          </>
                        ) : hasPreorders && paymentChoice === 'zero_down' ? (
                          <>
                            <Lock size={13} />
                            <span>Pay In-Stock ({formatPrice(dueToday)}) & Reserve Pre-Order</span>
                            <ArrowRight size={14} />
                          </>
                        ) : (
                          <>
                            <Lock size={13} />
                            <span>Proceed to Stripe Checkout</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-[10px] text-navy/50 font-sans leading-relaxed">
                      By confirming, you agree to Dallas atelier craftsmanship terms. Pre-orders are bench made-to-order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

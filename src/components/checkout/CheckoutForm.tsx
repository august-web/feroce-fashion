'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'
import { PaymentSection } from './PaymentSection'

type ShippingMethod = 'standard' | 'express'

interface FormData {
  email: string
  newsletter: boolean
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  shippingMethod: ShippingMethod
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

function StepNumber({ step }: { step: number }) {
  return (
    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-navy text-[11px] font-bold text-white">
      {step}
    </span>
  )
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal } = useCartStore()
  const [form, setForm] = useState<FormData>({
    email: '',
    newsletter: false,
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    shippingMethod: 'standard',
  })

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const shippingCost = form.shippingMethod === 'express' ? 1800 : (subtotal() >= 20000 ? 0 : 1500)

  const shippingAddress = {
    name: `${form.firstName} ${form.lastName}`.trim(),
    address: form.address,
    apartment: form.apartment,
    city: form.city,
    state: form.state,
    zip: form.zip,
    country: form.country,
    phone: form.phone,
  }

  const handleCheckoutSuccess = (orderId: string) => {
    router.push(`/checkout/success?order=${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-navy/50 text-sm">Your bag is empty.</p>
        <a href="/shop" className="btn-primary inline-block mt-4">Start Shopping</a>
      </div>
    )
  }

  const inputClass = "w-full border border-line bg-white px-4 py-3 text-[16px] font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy/30 min-h-[44px]"
  const labelClass = "block text-[11px] font-sans uppercase tracking-luxury text-navy/60 mb-1.5"

  return (
    <div className="space-y-8">
      {/* ── 1. Contact ── */}
      <div className="bg-white border border-line p-6">
        <div className="flex items-center gap-3 mb-5">
          <StepNumber step={1} />
          <h2 className="font-serif text-lg font-semibold text-navy">Contact</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={form.newsletter}
              onChange={(e) => update('newsletter', e.target.checked)}
              className="h-4 w-4 border-line accent-navy"
            />
            <span className="text-xs text-navy/60">Email me with new arrivals and previews</span>
          </label>
        </div>
      </div>

      {/* ── 2. Shipping Address ── */}
      <div className="bg-white border border-line p-6">
        <div className="flex items-center gap-3 mb-5">
          <StepNumber step={2} />
          <h2 className="font-serif text-lg font-semibold text-navy">Shipping Address</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputClass} required />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street address" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Apartment, Suite, etc. (optional)</label>
            <input type="text" value={form.apartment} onChange={(e) => update('apartment', e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select value={form.state} onChange={(e) => update('state', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">Select</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>ZIP Code</label>
              <input type="text" value={form.zip} onChange={(e) => update('zip', e.target.value)} className={inputClass} required />
            </div>
          </div>
          <div>
            <label className={labelClass}>Phone (optional)</label>
            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
          </div>
        </div>
      </div>

      {/* ── 3. Shipping Method ── */}
      <div className="bg-white border border-line p-6">
        <div className="flex items-center gap-3 mb-5">
          <StepNumber step={3} />
          <h2 className="font-serif text-lg font-semibold text-navy">Shipping Method</h2>
        </div>
        <div className="space-y-3">
          {/* Standard */}
          <label
            className={`flex items-center justify-between p-4 border cursor-pointer transition-all min-h-[56px] ${
              form.shippingMethod === 'standard'
                ? 'border-navy bg-white'
                : 'border-line hover:border-navy/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={form.shippingMethod === 'standard'}
                onChange={() => update('shippingMethod', 'standard')}
                className="h-4 w-4 accent-navy"
              />
              <div>
                <p className="text-sm font-medium text-navy">Standard</p>
                <p className="text-[11px] text-navy/50">5–7 business days</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gold">
              {subtotal() >= 20000 ? 'Free' : '$15.00'}
            </span>
          </label>

          {/* Express */}
          <label
            className={`flex items-center justify-between p-4 border cursor-pointer transition-all min-h-[56px] ${
              form.shippingMethod === 'express'
                ? 'border-navy bg-white'
                : 'border-line hover:border-navy/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={form.shippingMethod === 'express'}
                onChange={() => update('shippingMethod', 'express')}
                className="h-4 w-4 accent-navy"
              />
              <div>
                <p className="text-sm font-medium text-navy">Express</p>
                <p className="text-[11px] text-navy/50">2–3 business days</p>
              </div>
            </div>
            <span className="text-sm font-medium text-navy">$18.00</span>
          </label>
        </div>
      </div>

      {/* ── 4. Payment ── */}
      <div className="bg-white border border-line p-6">
        <div className="flex items-center gap-3 mb-5">
          <StepNumber step={4} />
          <h2 className="font-serif text-lg font-semibold text-navy">Payment</h2>
        </div>
        <PaymentSection
          total={subtotal() + shippingCost + Math.round(subtotal() * 0.0825)}
          email={form.email}
          shippingAddress={shippingAddress}
          shippingMethod={form.shippingMethod}
          onSuccess={handleCheckoutSuccess}
        />
      </div>
    </div>
  )
}

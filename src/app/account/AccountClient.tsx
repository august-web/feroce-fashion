'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBag,
  Sparkles,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  CreditCard,
  ExternalLink,
  Mail,
  Heart,
  KeyRound,
  User,
  Copy,
  Check,
  Lock,
  Loader2,
  X,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { formatPrice } from '@/lib/types'
import { logoutAction } from '@/lib/auth-actions'
import { updateCustomerProfile, updateCustomerPassword } from './actions'

export interface OrderItemData {
  id: string
  name?: string | null
  product_name?: string | null
  price: number
  quantity: number
  color?: string | null
  products?: {
    slug?: string
    image_urls?: string[]
    name?: string
  } | null
}

export interface OrderData {
  id: string
  total: number
  status: string
  payment_method: string
  payment_provider: string
  tracking_number?: string | null
  notes?: string | null
  shipping_address?: Record<string, unknown> | null
  created_at: string
  order_items?: OrderItemData[]
}

interface AccountClientProps {
  user: {
    id: string
    email: string
    created_at: string
  }
  profile: {
    id: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string | null
    created_at: string
  } | null
  orders: OrderData[]
  lifetimeSpend: number
  reviewCount: number
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatLongDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function initialsOf(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/[\s@._]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'F'
}

export function AccountClient({
  user,
  profile,
  orders,
  lifetimeSpend,
  reviewCount,
}: AccountClientProps) {
  const [filter, setFilter] = useState<'all' | 'preorder' | 'paid' | 'shipped'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [fullNameInput, setFullNameInput] = useState(profile?.full_name || '')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ text: string; isError?: boolean } | null>(null)
  const [currentDisplayName, setCurrentDisplayName] = useState(
    profile?.full_name || user.email.split('@')[0] || 'Client'
  )

  // Change Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; isError?: boolean } | null>(null)

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileMessage(null)

    const res = await updateCustomerProfile({ fullName: fullNameInput })
    setIsUpdatingProfile(false)

    if (res.error) {
      setProfileMessage({ text: res.error, isError: true })
    } else {
      setCurrentDisplayName(fullNameInput.trim())
      setProfileMessage({ text: 'Profile name successfully updated.' })
      setTimeout(() => {
        setIsEditProfileOpen(false)
        setProfileMessage(null)
      }, 1200)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'Passwords do not match.', isError: true })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ text: 'Password must be at least 8 characters.', isError: true })
      return
    }

    setIsUpdatingPassword(true)
    setPasswordMessage(null)

    const res = await updateCustomerPassword({ newPassword })
    setIsUpdatingPassword(false)

    if (res.error) {
      setPasswordMessage({ text: res.error, isError: true })
    } else {
      setPasswordMessage({ text: 'Password successfully updated.' })
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setIsPasswordModalOpen(false)
        setPasswordMessage(null)
      }, 1200)
    }
  }

  // Pre-order calculations
  const preOrderOrders = orders.filter((o) => {
    const hasNote = Boolean(
      o.notes?.toLowerCase().includes('pre-order') || o.notes?.toLowerCase().includes('preorder')
    )
    const hasItemPreorder = (o.order_items || []).some((it) =>
      Boolean(
        (it.name && it.name.toLowerCase().includes('pre-order')) ||
        (it.product_name && it.product_name.toLowerCase().includes('pre-order'))
      )
    )
    return hasNote || hasItemPreorder
  })

  const paidOrders = orders.filter((o) => o.status === 'paid')
  const shippedOrders = orders.filter((o) => o.status === 'shipped')

  // Filtered list
  const filteredOrders = orders.filter((o) => {
    if (filter === 'preorder') return preOrderOrders.includes(o)
    if (filter === 'paid') return o.status === 'paid'
    if (filter === 'shipped') return o.status === 'shipped'
    return true
  })

  // Latest shipping address from orders
  const latestOrderWithAddress = orders.find((o) => o.shipping_address && Object.keys(o.shipping_address).length > 0)
  const savedAddress = latestOrderWithAddress?.shipping_address as Record<string, string> | undefined

  const initials = initialsOf(currentDisplayName, user.email)

  return (
    <div className="bg-white min-h-screen text-navy font-sans antialiased">
      {/* ── Top Hero Canvas ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-10 sm:pb-14">
          {/* Breadcrumb Pill */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-6 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            The FÉROCE Circle · Client Privileges
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left: Avatar + Title */}
            <div className="flex items-center gap-5 sm:gap-6">
              {profile?.avatar_url ? (
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar_url}
                    alt={currentDisplayName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-gold/60 ring-offset-4 ring-offset-white shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-navy text-gold flex items-center justify-center border-2 border-white shadow-2xs">
                    <Sparkles size={11} />
                  </div>
                </div>
              ) : (
                <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-navy text-cream flex items-center justify-center font-bold text-xl sm:text-2xl tracking-wider ring-2 ring-gold/60 ring-offset-4 ring-offset-white shadow-sm">
                  {initials}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center border-2 border-white shadow-2xs">
                    <Sparkles size={11} />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
                    {currentDisplayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-dark text-[10px] font-bold uppercase tracking-wider border border-gold/30">
                    <ShieldCheck size={11} />
                    Verified Patron
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-navy/55 mt-2 flex-wrap font-sans">
                  <span>{user.email}</span>
                  <span className="text-navy/20">•</span>
                  <span>Patron since {formatLongDate(user.created_at)}</span>
                  <span className="text-navy/20">•</span>
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Dallas Atelier Access Active
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Capsules */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 text-xs font-semibold text-navy transition-all shadow-2xs cursor-pointer"
              >
                <User size={13} />
                Edit Profile
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 text-xs font-semibold text-navy transition-all shadow-2xs cursor-pointer"
              >
                <KeyRound size={13} />
                Key &amp; Password
              </button>
              <button
                onClick={() => logoutAction()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* ── 4 NEST Luxury Patron Metric Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
            {/* Acquisitions */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between text-navy/50 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Acquisitions</span>
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-navy shadow-2xs">
                  <ShoppingBag size={15} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                {orders.length} Pieces
              </div>
              <div className="text-xs text-navy/50 font-sans mt-1">
                Recorded atelier orders
              </div>
            </div>

            {/* Pre-Orders */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between text-amber-800 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Pre-Orders</span>
                <div className="w-8 h-8 rounded-xl bg-white border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Sparkles size={15} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-950 tracking-tight">
                {preOrderOrders.length} Allocated
              </div>
              <div className="text-xs text-amber-700/80 font-sans mt-1">
                ✦ Made-to-order craft
              </div>
            </div>

            {/* Lifetime Investment */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between text-navy/50 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Atelier Total</span>
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-navy shadow-2xs">
                  <CreditCard size={15} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                {formatPrice(lifetimeSpend)}
              </div>
              <div className="text-xs text-navy/50 font-sans mt-1">
                Confirmed lifetime spend
              </div>
            </div>

            {/* Dedicated Concierge */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-navy/50 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Concierge</span>
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-navy shadow-2xs">
                    <Mail size={15} />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-bold text-navy tracking-tight">
                  Dallas Direct
                </div>
                <div className="text-xs text-navy/50 font-sans mt-0.5">
                  Priority client advisor
                </div>
              </div>
              <a
                href="mailto:ferocefashionff@gmail.com?subject=FÉROCE%20Circle%20Concierge%20Inquiry"
                className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-navy/70 hover:text-navy inline-flex items-center gap-1 transition-colors"
              >
                Inquire With Atelier <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Orders & Side Directory ── */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ── Left 8 Columns: Order Acquisitions & Pre-Orders ── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header + Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-[-0.03em]">
                  Atelier Acquisitions &amp; Dispatches
                </h2>
                <p className="text-xs sm:text-sm text-navy/55 mt-1 font-sans">
                  Real-time status of your Dallas handbag handcrafted dispatches and pre-order drops.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F6F6F8] rounded-full border border-gray-200/80 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-navy text-white shadow-2xs'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setFilter('preorder')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    filter === 'preorder'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-amber-800/80 hover:text-amber-900'
                  }`}
                >
                  Pre-Orders ({preOrderOrders.length})
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    filter === 'paid'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Paid ({paidOrders.length})
                </button>
                <button
                  onClick={() => setFilter('shipped')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    filter === 'shipped'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Dispatched ({shippedOrders.length})
                </button>
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-10 sm:p-14 text-center">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-navy/40 mx-auto mb-4 shadow-2xs">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy">No records found</h3>
                <p className="text-sm text-navy/50 mt-1 max-w-sm mx-auto">
                  {filter === 'preorder'
                    ? 'You have no active made-to-order pre-order allocations.'
                    : 'There are no orders matching this filter.'}
                </p>
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider rounded-full px-6 py-2.5 transition-all shadow-sm"
                  >
                    Explore Autumn/Winter Silhouettes
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const isPreorder =
                    Boolean(
                      order.notes?.toLowerCase().includes('pre-order') ||
                      order.notes?.toLowerCase().includes('preorder')
                    ) ||
                    (order.order_items || []).some((it) =>
                      Boolean(
                        (it.name && it.name.toLowerCase().includes('pre-order')) ||
                        (it.product_name && it.product_name.toLowerCase().includes('pre-order'))
                      )
                    )

                  const statusBadges: Record<string, { label: string; style: string }> = {
                    paid: {
                      label: '✓ Confirmed & In Workshop',
                      style: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
                    },
                    shipped: {
                      label: '✦ Dispatched & En Route',
                      style: 'bg-blue-50 text-blue-800 border-blue-200/80',
                    },
                    pending: {
                      label: '● Order Received & In Queue',
                      style: 'bg-amber-50 text-amber-800 border-amber-200/80',
                    },
                    cancelled: {
                      label: 'Cancelled',
                      style: 'bg-rose-50 text-rose-800 border-rose-200/80',
                    },
                  }

                  const statusConfig = statusBadges[order.status] || {
                    label: order.status.toUpperCase(),
                    style: 'bg-gray-100 text-gray-700 border-gray-200',
                  }

                  const addr = order.shipping_address as Record<string, string> | undefined

                  return (
                    <div
                      key={order.id}
                      className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 hover:border-gray-300 transition-all shadow-2xs"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200/70">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-sm font-bold text-navy tracking-wider">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleCopy(order.id)}
                              aria-label="Copy order ID"
                              className="text-navy/40 hover:text-navy transition-colors cursor-pointer"
                              title="Copy Full Manifest ID"
                            >
                              {copiedId === order.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                            
                            {/* Pre-Order vs In Stock Badge */}
                            {isPreorder ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                                <Sparkles size={11} className="text-gold" />
                                ✦ Made-To-Order Allocation
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                                <CheckCircle2 size={11} className="text-emerald-600" />
                                Ready-To-Ship Dispatch
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-navy/50 mt-1.5 font-sans">
                            <span>Placed {formatDate(order.created_at)}</span>
                            <span>•</span>
                            <span className="capitalize">
                              {order.payment_method === 'automatic' ? 'Stripe Checkout' : order.payment_method || 'Credit Card'}
                            </span>
                          </div>
                        </div>

                        {/* Status + Total */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 pt-2 sm:pt-0">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${statusConfig.style}`}
                          >
                            {statusConfig.label}
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-navy">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items Listing */}
                      <div className="py-5 space-y-3.5">
                        {order.order_items && order.order_items.length > 0 ? (
                          order.order_items.map((item) => {
                            const image = item.products?.image_urls?.[0]
                            const slug = item.products?.slug
                            const title = item.product_name || item.name || item.products?.name || 'Atelier Silhouette'

                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white border border-gray-200/70 shadow-2xs"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {image ? (
                                    <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200/70 shrink-0">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={image}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-14 h-16 rounded-xl bg-gray-100 border border-gray-200/70 flex items-center justify-center text-navy/30 shrink-0">
                                      <ShoppingBag size={18} />
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <div className="font-bold text-sm text-navy truncate">
                                      {title}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-navy/55 flex-wrap">
                                      {item.color && (
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[10px] font-semibold text-navy/70">
                                          {item.color}
                                        </span>
                                      )}
                                      <span>Qty: {item.quantity}</span>
                                      {slug && (
                                        <Link
                                          href={`/product/${slug}`}
                                          className="text-xs text-navy/60 hover:text-navy underline inline-flex items-center gap-0.5 ml-1"
                                        >
                                          View Piece <ExternalLink size={10} />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="font-bold text-sm text-navy">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          /* Fallback card if order items were unlinked */
                          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200/70 shadow-2xs">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-14 rounded-xl bg-gray-50 border border-gray-200/70 flex items-center justify-center text-navy/40 shrink-0">
                                <ShoppingBag size={20} />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-navy">
                                  FÉROCE Atelier Handbag Silhouette
                                </div>
                                <div className="text-xs text-navy/50 mt-0.5">
                                  Handcrafted atelier order record · Dallas, TX
                                </div>
                              </div>
                            </div>
                            <div className="text-right font-bold text-sm text-navy">
                              {formatPrice(order.total)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Shipping Details & Concierge Link */}
                      <div className="pt-4 border-t border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-navy/60 font-sans">
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="text-navy/40 shrink-0" />
                          {addr && addr.city ? (
                            <span>
                              Delivering to: <strong className="text-navy">{addr.name || 'Patron'}</strong> ({addr.city}, {addr.state} {addr.country})
                            </span>
                          ) : (
                            <span>Destination: Dallas Atelier Dispatch Queue</span>
                          )}
                        </div>

                        <a
                          href={`mailto:ferocefashionff@gmail.com?subject=Inquiry%20regarding%20FÉROCE%20Order%20%23${order.id.slice(0, 8).toUpperCase()}`}
                          className="text-navy/70 hover:text-navy font-semibold underline inline-flex items-center gap-1 self-start sm:self-auto"
                        >
                          Inquire with Concierge <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Right 4 Columns: Circle Privileges & Side Directory ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* The FÉROCE Circle Privileges Card */}
            <div className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-gold shadow-2xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm uppercase tracking-wider">
                    Circle Patron Privileges
                  </h3>
                  <p className="text-[11px] text-navy/50">Exclusive to registered clientele</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-navy/75 font-sans">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/70 shadow-2xs">
                  <div className="font-bold text-navy flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    48-Hour Early Drop Allocation
                  </div>
                  <p className="text-[11px] text-navy/55 mt-1 leading-relaxed">
                    Guaranteed priority reservations for limited-batch Dallas leather &amp; denim silhouettes before public release.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/70 shadow-2xs">
                  <div className="font-bold text-navy flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    Lifetime Atelier Hardware Care
                  </div>
                  <p className="text-[11px] text-navy/55 mt-1 leading-relaxed">
                    Complimentary ultrasonic hardware cleaning, edge re-coating, and dust cover replacements at our Dallas studio.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/70 shadow-2xs">
                  <div className="font-bold text-navy flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    Private Atelier Advisor
                  </div>
                  <p className="text-[11px] text-navy/55 mt-1 leading-relaxed">
                    Direct access to FÉROCE master artisans for bespoke monogramming and custom hardware fittings.
                  </p>
                </div>
              </div>
            </div>

            {/* Saved Delivery Destination */}
            <div className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-navy/60" />
                  <h3 className="font-bold text-navy text-sm uppercase tracking-wider">
                    Delivery Destination
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                  On File
                </span>
              </div>

              {savedAddress ? (
                <div className="p-4 rounded-2xl bg-white border border-gray-200/70 shadow-2xs text-xs text-navy/70 space-y-1 font-sans">
                  <p className="font-bold text-navy text-sm">{savedAddress.name || currentDisplayName}</p>
                  <p>{savedAddress.address}</p>
                  {savedAddress.apartment && <p>{savedAddress.apartment}</p>}
                  <p>
                    {savedAddress.city}, {savedAddress.state} {savedAddress.zip}
                  </p>
                  <p className="text-navy/40 uppercase tracking-wider text-[10px] pt-1">
                    {savedAddress.country || 'United States'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-gray-200/70 shadow-2xs text-xs text-navy/50 font-sans">
                  No default address on file. Your delivery details will be captured automatically during checkout.
                </div>
              )}
            </div>

            {/* Quick Atelier Navigation */}
            <div className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-7 shadow-2xs">
              <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-3">
                Atelier Directory
              </h3>
              <div className="space-y-1.5 font-sans">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200/70 text-xs font-semibold text-navy transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={14} className="text-rose-500" />
                    Saved Pieces &amp; Wishlist
                  </span>
                  <ChevronRight size={14} className="text-navy/40" />
                </Link>

                <Link
                  href="/shop"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200/70 text-xs font-semibold text-navy transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-navy/70" />
                    Autumn/Winter Collection
                  </span>
                  <ChevronRight size={14} className="text-navy/40" />
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200/70 text-xs font-semibold text-navy transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={14} className="text-navy/70" />
                    Contact Atelier Support
                  </span>
                  <ChevronRight size={14} className="text-navy/40" />
                </Link>

                <Link
                  href="/delete-account"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200/70 text-xs font-semibold text-navy/60 hover:text-navy transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-navy/40" />
                    Privacy &amp; Data Rights
                  </span>
                  <ChevronRight size={14} className="text-navy/40" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F6F6F8] border border-gray-200/80 flex items-center justify-center text-navy shadow-2xs">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-navy">Edit Profile</h3>
                  <p className="text-xs text-navy/50">Update your verified client details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy/60 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  required
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F6F6F8] border border-gray-200/80 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy/70 mb-2">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200/80 text-sm text-navy/50 cursor-not-allowed"
                />
              </div>

              {profileMessage && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold ${
                    profileMessage.isError
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-navy/60 hover:text-navy transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-2.5 rounded-full bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingProfile ? <Loader2 size={13} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Key & Password Modal ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F6F6F8] border border-gray-200/80 flex items-center justify-center text-navy shadow-2xs">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-navy">Key &amp; Password</h3>
                  <p className="text-xs text-navy/50">Update your account credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy/60 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy/70 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F6F6F8] border border-gray-200/80 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy/70 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F6F6F8] border border-gray-200/80 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:bg-white transition-all"
                />
              </div>

              {passwordMessage && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold ${
                    passwordMessage.isError
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-navy/60 hover:text-navy transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-6 py-2.5 rounded-full bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingPassword ? <Loader2 size={13} className="animate-spin" /> : null}
                  Update Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

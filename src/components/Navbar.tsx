'use client'

import Link from 'next/link'
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { createClient } from '@/lib/supabase/client'
import { SearchModal } from '@/components/SearchModal'

function initialsOf(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/[\s@._]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'F'
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('menu') === '1'
    }
    return false
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [accountHref, setAccountHref] = useState('/login')
  const [accountLabel, setAccountLabel] = useState('Sign In')
  const [accountRole, setAccountRole] = useState<'admin' | 'customer' | 'guest'>('guest')
  const [accountName, setAccountName] = useState<string | null>(null)
  const [accountEmail, setAccountEmail] = useState<string | null>(null)
  const [accountAvatar, setAccountAvatar] = useState<string | null>(null)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(true)
  const [mobileWomenOpen, setMobileWomenOpen] = useState(true)
  const [mobileMenOpen, setMobileMenOpen] = useState(false)

  const totalCount = useCartStore((s) => s.totalCount())
  const openMiniCart = useCartStore((s) => s.openMiniCart)
  const wishlistCount = useWishlistStore((s) => s.totalCount())

  useEffect(() => {
    setHydrated(true)
    const supabase = createClient()

    async function resolveAccount(userId: string, email?: string) {
      setAccountEmail(email || null)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name, avatar_url')
          .eq('id', userId)
          .single()

        const profileData = profile as {
          role?: string
          full_name?: string | null
          avatar_url?: string | null
        } | null

        const isAdmin = profileData?.role === 'admin'
        setAccountHref(isAdmin ? '/admin' : '/account')
        setAccountLabel(isAdmin ? 'Fashion Admin' : 'The Circle')
        setAccountRole(isAdmin ? 'admin' : 'customer')
        setAccountName(profileData?.full_name || null)
        setAccountAvatar(profileData?.avatar_url || null)
      } catch {
        setAccountHref('/account')
        setAccountLabel('Account')
        setAccountRole('customer')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        resolveAccount(session.user.id, session.user.email)
      } else {
        setAccountHref('/login')
        setAccountLabel('Sign In')
        setAccountRole('guest')
        setAccountName(null)
        setAccountAvatar(null)
        setAccountEmail(null)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        resolveAccount(session.user.id, session.user.email)
      } else {
        setAccountHref('/login')
        setAccountLabel('Sign In')
        setAccountRole('guest')
        setAccountName(null)
        setAccountAvatar(null)
        setAccountEmail(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('search') === '1' || params.get('q')) {
        setSearchOpen(true)
      }
      if (params.get('cart') === '1') {
        openMiniCart()
      }
      if (params.get('menu') === '1') {
        setMenuOpen(true)
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openMiniCart])

  const displayCount = hydrated ? totalCount : 0
  const displayWishlist = hydrated ? wishlistCount : 0

  return (
    <>
      {/* ── Modern Luxury Navbar (With Authentic FÉROCE Monogram Logo) ── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all font-sans">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* ── LEFT: Mobile Menu Button + Authentic FÉROCE Logo Wordmark ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Trigger (Elevated Luxury Pill) */}
            <button
              type="button"
              aria-label="Open boutique menu"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-navy hover:text-navy rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>

            {/* Official Circular Gold FÉROCE Monogram Emblem + Wordmark */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img
                src="/images/feroce-emblem.png"
                alt="FÉROCE Monogram"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-sans text-base sm:text-xl font-bold tracking-[0.14em] text-navy group-hover:text-navy/80 transition-colors leading-none">
                  FÉROCE
                </span>
                <span className="text-[7px] sm:text-[8px] font-sans uppercase tracking-[0.34em] text-navy/60 font-semibold mt-1">
                  Fashion
                </span>
              </div>
            </Link>
          </div>

          {/* ── CENTER: Desktop Links (Home, Collections Mega Dropdown, Best Sellers, About Us) ── */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {/* 1. Home */}
            <Link
              href="/"
              className="text-xs font-sans font-medium text-navy/70 hover:text-navy transition-colors py-1"
            >
              Home
            </Link>

            {/* 2. Collections (Dropdown with Men & Women -> Naji, Denim De Ville) */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-navy/70 hover:text-navy transition-colors"
              >
                <span>Collections</span>
                <ChevronDown
                  size={13}
                  className="text-navy/40 group-hover:text-navy group-hover:rotate-180 transition-transform duration-200"
                />
              </Link>

              {/* Collections Mega Dropdown Panel */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-[440px] bg-white border border-gray-100 rounded-3xl shadow-[0_16px_40px_rgba(10,17,40,0.1)] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Women's Column */}
                    <div>
                      <Link
                        href="/shop/womens"
                        className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-navy hover:text-gold transition-colors flex items-center justify-between pb-2 border-b border-gray-100"
                      >
                        <span>Women</span>
                        <ChevronRight size={13} className="text-navy/30" />
                      </Link>
                      <ul className="mt-3 space-y-2.5">
                        <li>
                          <Link
                            href="/shop/womens"
                            className="group/item flex flex-col hover:text-gold transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-xs font-medium text-navy/85 group-hover/item:text-gold">
                                Naji Collection
                              </span>
                              <span className="text-[8px] font-semibold px-1.5 py-0.2 bg-gold/15 text-gold border border-gold/30 rounded-xs">
                                New
                              </span>
                            </div>
                            <span className="text-[10px] text-navy/45 font-sans mt-0.5">
                              Sensory faux-fur evening bags
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop/womens"
                            className="group/item flex flex-col hover:text-gold transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-xs font-medium text-navy/85 group-hover/item:text-gold">
                                Denim De Ville
                              </span>
                              <span className="text-[8px] font-semibold px-1.5 py-0.2 bg-gold/15 text-gold border border-gold/30 rounded-xs">
                                Pre-Order
                              </span>
                            </div>
                            <span className="text-[10px] text-navy/45 font-sans mt-0.5">
                              Monogram jacquard denim edit
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop/womens"
                            className="font-sans text-xs text-navy/60 hover:text-gold transition-colors block pt-1"
                          >
                            All Women&apos;s Handbags →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Men's Column */}
                    <div>
                      <Link
                        href="/shop/mens"
                        className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-navy hover:text-gold transition-colors flex items-center justify-between pb-2 border-b border-gray-100"
                      >
                        <span>Men</span>
                        <ChevronRight size={13} className="text-navy/30" />
                      </Link>
                      <ul className="mt-3 space-y-2.5">
                        <li>
                          <Link
                            href="/shop/mens"
                            className="group/item flex flex-col hover:text-gold transition-colors"
                          >
                            <span className="font-sans text-xs font-medium text-navy/85 group-hover/item:text-gold">
                              Luxury Fanny Packs
                            </span>
                            <span className="text-[10px] text-navy/45 font-sans mt-0.5">
                              High-utility urban belt bags
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop/mens"
                            className="group/item flex flex-col hover:text-gold transition-colors"
                          >
                            <span className="font-sans text-xs font-medium text-navy/85 group-hover/item:text-gold">
                              Signature Satchels
                            </span>
                            <span className="text-[10px] text-navy/45 font-sans mt-0.5">
                              Structured crossbody briefcases
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop/mens"
                            className="font-sans text-xs text-navy/60 hover:text-gold transition-colors block pt-1"
                          >
                            All Men&apos;s Accessories →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Dropdown Bottom Banner */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-cream/40 -mx-6 -mb-6 px-6 py-3 rounded-b-3xl">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-navy/50 font-medium">
                      Complimentary US Express Shipping over $200
                    </span>
                    <Link
                      href="/shop"
                      className="text-[10px] font-sans font-semibold text-gold hover:text-navy uppercase tracking-wider"
                    >
                      Shop All →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Best Sellers */}
            <Link
              href="/shop"
              className="text-xs font-sans font-medium text-navy/70 hover:text-navy transition-colors py-1"
            >
              Best Sellers
            </Link>

            {/* 4. About Us */}
            <Link
              href="/about"
              className="text-xs font-sans font-medium text-navy/70 hover:text-navy transition-colors py-1"
            >
              About Us
            </Link>
          </div>

          {/* ── RIGHT: Utility Actions (Search, Sign In, Wishlist, Cart) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              aria-label="Search archive"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-auto sm:px-3 text-navy/80 hover:text-navy transition-all rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 group cursor-pointer shadow-2xs shrink-0"
            >
              <Search size={16} strokeWidth={1.75} className="group-hover:scale-105 transition-transform" />
              <span className="hidden xl:inline text-xs font-sans text-navy/60 font-medium ml-2">Search</span>
              <kbd className="hidden xl:inline-flex items-center justify-center rounded-full px-2 py-0.5 bg-white border border-gray-200/80 text-[10px] text-navy/40 font-mono ml-2">
                ⌘K
              </kbd>
            </button>

            {/* Sign In / Account Link (Desktop) */}
            <Link
              href={accountHref}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-sans font-semibold text-navy hover:text-navy transition-all px-3.5 py-2 rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 shadow-2xs shrink-0"
            >
              <User size={14} strokeWidth={1.75} />
              <span>{accountLabel}</span>
            </Link>

            {/* Wishlist Icon Button */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-navy hover:text-navy transition-all rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 shadow-2xs shrink-0"
            >
              <Heart size={16} strokeWidth={1.75} className="text-navy/75 hover:text-rose-600 transition-colors" />
              {displayWishlist > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-navy shadow-xs border border-white">
                  {displayWishlist}
                </span>
              )}
            </Link>

            {/* Cart Capsule Button */}
            <button
              type="button"
              aria-label={`Shopping cart, ${displayCount} items`}
              onClick={openMiniCart}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-white bg-[#4A4D52] hover:bg-navy transition-all rounded-full shadow-xs cursor-pointer shrink-0"
            >
              <ShoppingBag size={16} strokeWidth={1.75} />
              {displayCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy text-gold px-1 text-[9px] font-bold shadow-xs border border-white">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Slideout Backdrop (Frosted Luxury) ── */}
      <div
        className={`fixed inset-0 z-[60] bg-navy/50 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile Slideout Drawer (Elevated Luxury Atelier Experience) ── */}
      <div
        className={`fixed top-0 left-0 z-[70] h-full w-[88vw] max-w-sm bg-white rounded-r-[32px] sm:rounded-r-[40px] shadow-[0_20px_60px_rgba(10,17,40,0.25)] transition-transform duration-300 ease-out lg:hidden flex flex-col font-sans border-r border-gray-100 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ── 1. Drawer Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 h-20 bg-white shrink-0">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <img
              src="/images/feroce-emblem.png"
              alt="FÉROCE"
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-sans text-base font-bold tracking-[0.14em] text-navy leading-none">
                FÉROCE
              </span>
              <span className="text-[7px] font-sans uppercase tracking-[0.32em] text-navy/60 font-semibold mt-1">
                Fashion
              </span>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 flex items-center justify-center text-navy transition-all shadow-2xs cursor-pointer"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* ── 2. Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Fashion Operational Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 shadow-2xs w-full justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dallas Fashion HQ · Active
            </span>
            <span className="text-[9px] text-navy/40 font-mono">TX · US</span>
          </div>

          {/* Client Authentication & Status Card (NEST Card) */}
          <div className="rounded-[28px] bg-[#F6F6F8] border border-gray-200/80 p-4 shadow-2xs">
            {accountRole === 'customer' ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {accountAvatar ? (
                    <img
                      src={accountAvatar}
                      alt={accountName || 'Client'}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-gold/60 ring-offset-2 ring-offset-white shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-navy text-cream flex items-center justify-center font-bold text-sm tracking-wider shrink-0 ring-2 ring-gold/60 ring-offset-2 ring-offset-white">
                      {initialsOf(accountName || '', accountEmail || '')}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-navy truncate">
                        {accountName || 'Circle Member'}
                      </span>
                      <ShieldCheck size={12} className="text-gold shrink-0" />
                    </div>
                    <span className="text-[10px] text-navy/55 block truncate font-sans">
                      The FÉROCE Circle Patron
                    </span>
                  </div>
                </div>

                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-[#4A4D52] hover:bg-navy text-white text-[10px] font-semibold uppercase tracking-wider shrink-0 transition-all shadow-xs inline-flex items-center gap-1"
                >
                  Dashboard <ArrowRight size={10} />
                </Link>
              </div>
            ) : accountRole === 'admin' ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-gold/60 ring-offset-2 ring-offset-white">
                    <Sparkles size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-navy block truncate">
                      Fashion Director
                    </span>
                    <span className="text-[10px] text-navy/55 block truncate font-sans">
                      Dallas Backoffice Operations
                    </span>
                  </div>
                </div>

                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-navy hover:bg-navy-dark text-gold text-[10px] font-semibold uppercase tracking-wider shrink-0 transition-all shadow-xs inline-flex items-center gap-1"
                >
                  Backoffice <ArrowRight size={10} />
                </Link>
              </div>
            ) : (
              /* Guest Client State */
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-gold shadow-2xs shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-navy block">
                      The FÉROCE Circle
                    </span>
                    <span className="text-[10px] text-navy/50 block font-sans">
                      Client access &amp; pre-orders
                    </span>
                  </div>
                </div>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-3.5 py-1.5 rounded-full bg-[#4A4D52] hover:bg-navy text-white text-[10px] font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer shrink-0 inline-flex items-center gap-1"
                >
                  Sign In <ArrowRight size={10} />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Search Capsule Button */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen(true)
            }}
            className="w-full px-4 py-2.5 rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 flex items-center justify-between text-xs text-navy/60 transition-all shadow-2xs cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <Search size={14} className="text-navy/60 group-hover:text-navy transition-colors" />
              <span>Search silhouettes &amp; archive...</span>
            </span>
            <kbd className="px-2 py-0.5 rounded-full bg-white border border-gray-200/80 text-[9px] font-mono text-navy/40">
              ⌘K
            </kbd>
          </button>

          {/* ── Main Navigation Links ── */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-navy/40 font-bold block px-2">
              Fashion Archive
            </span>

            {/* 1. Home Link Card */}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F6F8] hover:bg-gray-200/60 border border-gray-200/70 text-xs font-bold text-navy transition-all shadow-2xs"
            >
              <span>Home</span>
              <ChevronRight size={14} className="text-navy/40" />
            </Link>

            {/* 2. Collections Card with Expandable Subsections */}
            <div className="rounded-2xl bg-[#F6F6F8] border border-gray-200/70 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setMobileCollectionsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-navy hover:text-navy transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Collections &amp; Silhouettes</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 bg-gold/15 text-gold border border-gold/30 rounded-full">
                    A/W 2026
                  </span>
                </span>
                <ChevronDown
                  size={14}
                  className={`text-navy/50 transition-transform duration-200 ${
                    mobileCollectionsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileCollectionsOpen && (
                <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-gray-200/60 bg-white/60">
                  {/* Women's Handbags */}
                  <div className="p-3 rounded-xl bg-white border border-gray-200/60 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href="/shop/womens"
                        onClick={() => setMenuOpen(false)}
                        className="text-xs font-bold uppercase tracking-wider text-navy hover:text-gold flex items-center gap-1"
                      >
                        Women&apos;s Collection <ArrowUpRight size={11} className="text-navy/40" />
                      </Link>
                    </div>

                    <div className="space-y-1.5 pl-1 text-xs">
                      <Link
                        href="/shop/womens"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-1 text-navy/70 hover:text-navy font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                          Naji Evening Collection
                        </span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-gold/15 text-gold border border-gold/30 rounded-full">
                          NEW
                        </span>
                      </Link>
                      <Link
                        href="/shop/womens"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-1 text-navy/70 hover:text-navy font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                          Denim De Ville Edit
                        </span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/70 rounded-full">
                          ✦ PRE-ORDER
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Men's Accessories */}
                  <div className="p-3 rounded-xl bg-white border border-gray-200/60 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href="/shop/mens"
                        onClick={() => setMenuOpen(false)}
                        className="text-xs font-bold uppercase tracking-wider text-navy hover:text-gold flex items-center gap-1"
                      >
                        Men&apos;s Collection <ArrowUpRight size={11} className="text-navy/40" />
                      </Link>
                    </div>

                    <div className="space-y-1.5 pl-1 text-xs">
                      <Link
                        href="/shop/mens"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-1 text-navy/70 hover:text-navy font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy/40 inline-block" />
                          Luxury Fanny Packs
                        </span>
                        <span className="text-[9px] text-navy/40">Leather &amp; Fur</span>
                      </Link>
                      <Link
                        href="/shop/mens"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-1 text-navy/70 hover:text-navy font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy/40 inline-block" />
                          Signature Satchels
                        </span>
                        <span className="text-[9px] text-navy/40">Structured Brief</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Best Sellers */}
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F6F8] hover:bg-gray-200/60 border border-gray-200/70 text-xs font-bold text-navy transition-all shadow-2xs"
            >
              <span>Best Sellers &amp; Vault</span>
              <ChevronRight size={14} className="text-navy/40" />
            </Link>

            {/* 4. About Us */}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F6F8] hover:bg-gray-200/60 border border-gray-200/70 text-xs font-bold text-navy transition-all shadow-2xs"
            >
              <span>About FÉROCE Fashion</span>
              <ChevronRight size={14} className="text-navy/40" />
            </Link>
          </div>

          {/* ── 3. Quick Action Tiles (Bag & Wishlist) ── */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Bag Tile */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                openMiniCart()
              }}
              className="p-3.5 rounded-2xl bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 flex flex-col justify-between text-left transition-all shadow-2xs cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-navy shadow-2xs">
                  <ShoppingBag size={15} />
                </div>
                {displayCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-navy text-gold text-[9px] font-bold">
                    {displayCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-navy/40 font-mono">0</span>
                )}
              </div>
              <span className="text-xs font-bold text-navy">Shopping Bag</span>
              <span className="text-[10px] text-navy/50 font-sans mt-0.5">
                Review &amp; Checkout
              </span>
            </button>

            {/* Wishlist Tile */}
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 flex flex-col justify-between text-left transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-rose-500 shadow-2xs">
                  <Heart size={15} />
                </div>
                {displayWishlist > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-gold text-navy text-[9px] font-bold">
                    {displayWishlist}
                  </span>
                ) : (
                  <span className="text-[10px] text-navy/40 font-mono">0</span>
                )}
              </div>
              <span className="text-xs font-bold text-navy">Saved Pieces</span>
              <span className="text-[10px] text-navy/50 font-sans mt-0.5">
                Client Wishlist
              </span>
            </Link>
          </div>
        </div>

        {/* ── 4. Drawer Footer ── */}
        <div className="p-4 border-t border-gray-100 bg-[#F6F6F8] text-center shrink-0 rounded-br-[32px] sm:rounded-br-[40px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200/70 text-[9px] font-semibold uppercase tracking-wider text-navy/70 shadow-2xs mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Free US Express Shipping over $200
          </div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-navy/45 font-semibold">
            Dallas, TX • Handcrafted Luxury
          </p>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

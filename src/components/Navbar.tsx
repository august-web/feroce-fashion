'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Search, User, Menu, X, Heart, ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { createClient } from '@/lib/supabase/client'
import { SearchModal } from '@/components/SearchModal'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [accountHref, setAccountHref] = useState('/login')
  const [accountLabel, setAccountLabel] = useState('Sign In')
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [mobileWomenOpen, setMobileWomenOpen] = useState(true)

  const totalCount = useCartStore((s) => s.totalCount())
  const openMiniCart = useCartStore((s) => s.openMiniCart)
  const wishlistCount = useWishlistStore((s) => s.totalCount())

  useEffect(() => {
    setHydrated(true)
    const supabase = createClient()
    async function resolveAccount(userId: string) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
      const isAdmin = profile && (profile as { role: string }).role === 'admin'
      setAccountHref(isAdmin ? '/admin' : '/account')
      setAccountLabel(isAdmin ? 'Admin' : 'Account')
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) resolveAccount(session.user.id)
      else {
        setAccountHref('/login')
        setAccountLabel('Sign In')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) resolveAccount(session.user.id)
      else {
        setAccountHref('/login')
        setAccountLabel('Sign In')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const displayCount = hydrated ? totalCount : 0
  const displayWishlist = hydrated ? wishlistCount : 0

  return (
    <>
      {/* ── Modern Minimalist Navbar (With Authentic FÉROCE Monogram Logo) ── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* ── LEFT: Authentic FÉROCE Logo + Féroce Fashion Wordmark ── */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center text-navy hover:text-gold transition-colors rounded-full hover:bg-cream -ml-2"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              {/* Authentic Gold Circular FÉROCE Monogram Emblem */}
              <img
                src="/images/feroce-emblem.png"
                alt="FÉROCE Monogram"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-sans text-lg sm:text-xl font-bold tracking-[0.14em] text-navy group-hover:text-gold transition-colors leading-none">
                  FÉROCE
                </span>
                <span className="text-[7px] sm:text-[8px] font-sans uppercase tracking-[0.34em] text-navy/60 font-semibold mt-1">
                  Fashion
                </span>
              </div>
            </Link>
          </div>

          {/* ── CENTER: Home, Collections (with Men & Women Dropdown), Best Sellers, About Us ── */}
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
                <div className="w-[440px] bg-white border border-gray-100 rounded-2xl shadow-[0_16px_40px_rgba(10,17,40,0.1)] p-6">
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
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-cream/40 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl">
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
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-navy/80 hover:text-navy transition-colors rounded-full hover:bg-cream"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Sign In / Account Link with Label */}
            <Link
              href={accountHref}
              className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-medium text-navy/80 hover:text-navy transition-colors px-2 py-1.5 rounded-full hover:bg-cream"
            >
              <User size={16} strokeWidth={1.5} />
              <span>{accountLabel}</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-navy/80 hover:text-navy transition-colors rounded-full hover:bg-cream"
            >
              <Heart size={18} strokeWidth={1.5} />
              {displayWishlist > 0 && (
                <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold px-1 text-[8px] font-bold text-navy">
                  {displayWishlist}
                </span>
              )}
            </Link>

            {/* Cart with Count Pill */}
            <button
              type="button"
              aria-label={`Shopping cart, ${displayCount} items`}
              onClick={openMiniCart}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-navy hover:text-gold transition-colors rounded-full hover:bg-cream"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {displayCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy text-gold px-1 text-[8px] font-bold shadow-xs">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Slideout Drawer ── */}
      <div
        className={`fixed inset-0 z-[60] bg-navy/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 z-[70] h-full w-[85vw] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 h-16 bg-cream/30">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/feroce-emblem.png"
              alt="FÉROCE"
              className="w-7 h-7 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-sans text-base font-bold tracking-[0.14em] text-navy leading-none">
                FÉROCE
              </span>
              <span className="text-[7px] font-sans uppercase tracking-[0.3em] text-navy/60 font-semibold mt-0.5">
                Fashion
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center text-navy hover:text-gold rounded-full hover:bg-cream"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-navy/40 mb-3 font-semibold">
              Menu
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 items-center font-sans text-sm font-medium text-navy hover:text-gold border-b border-gray-100"
                >
                  Home
                </Link>
              </li>

              {/* Collections with Sub-items */}
              <li className="border-b border-gray-100 py-2">
                <span className="font-sans text-xs uppercase tracking-[0.16em] font-bold text-navy/40 block mb-2">
                  Collections
                </span>
                <div className="space-y-2 pl-2">
                  {/* Women */}
                  <div className="space-y-1">
                    <Link
                      href="/shop/womens"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between font-sans text-sm font-semibold text-navy hover:text-gold"
                    >
                      <span>Women</span>
                      <ChevronRight size={13} className="text-navy/30" />
                    </Link>
                    <div className="pl-3 space-y-1 text-xs text-navy/70">
                      <Link
                        href="/shop/womens"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-1 hover:text-gold"
                      >
                        <span>Naji Collection</span>
                        <span className="text-[8px] font-semibold px-1.5 py-0.2 bg-gold/15 text-gold border border-gold/30 rounded-xs">
                          New
                        </span>
                      </Link>
                      <Link
                        href="/shop/womens"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-1 hover:text-gold"
                      >
                        <span>Denim De Ville</span>
                        <span className="text-[8px] font-semibold px-1.5 py-0.2 bg-gold/15 text-gold border border-gold/30 rounded-xs">
                          Pre-Order
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Men */}
                  <div className="pt-2">
                    <Link
                      href="/shop/mens"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between font-sans text-sm font-semibold text-navy hover:text-gold"
                    >
                      <span>Men</span>
                      <ChevronRight size={13} className="text-navy/30" />
                    </Link>
                  </div>
                </div>
              </li>

              <li>
                <Link
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 items-center font-sans text-sm font-medium text-navy hover:text-gold border-b border-gray-100"
                >
                  Best Sellers
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 items-center font-sans text-sm font-medium text-navy hover:text-gold border-b border-gray-100"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-navy/40 mb-3 font-semibold">
              Account & Bag
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); openMiniCart() }}
                  className="flex h-10 items-center justify-between font-sans text-xs font-medium text-navy hover:text-gold w-full"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag size={16} />
                    Shopping Bag
                  </span>
                  {displayCount > 0 && (
                    <span className="px-2 py-0.5 bg-navy text-gold text-[9px] font-bold rounded-full">
                      {displayCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 items-center justify-between font-sans text-xs font-medium text-navy hover:text-gold"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart size={16} />
                    Wishlist
                  </span>
                  {displayWishlist > 0 && (
                    <span className="text-gold font-bold text-xs">({displayWishlist})</span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href={accountHref}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 items-center gap-2.5 font-sans text-xs font-medium text-navy hover:text-gold"
                >
                  <User size={16} />
                  {accountLabel}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-cream/30 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-navy/40 font-medium">
            FÉROCE Fashion • Authentic Luxury
          </p>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

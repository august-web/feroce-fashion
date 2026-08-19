'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { label: 'Women', href: '/shop' },
  { label: 'Men', href: '/shop' },
  { label: 'Bags', href: '/shop' },
  { label: 'Accessories', href: '/shop' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [accountHref, setAccountHref] = useState('/login')
  const totalCount = useCartStore((s) => s.totalCount())

  useEffect(() => {
    setHydrated(true)

    // Check auth state and set account link accordingly
    const supabase = createClient()

    async function resolveAccountHref(userId: string) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      if (profile && (profile as { role: string }).role === 'admin') {
        setAccountHref('/admin')
      } else {
        setAccountHref('/account')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        resolveAccountHref(session.user.id)
      } else {
        setAccountHref('/login')
      }
    })

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          resolveAccountHref(session.user.id)
        } else {
          setAccountHref('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const displayCount = hydrated ? totalCount : 0

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Left — Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-sans uppercase tracking-luxury text-navy hover:text-gold transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center — Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10">
            <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-navy">
              FÉROCE
            </span>
          </Link>

          {/* Right — Icons */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-5">
            {/* Search — always visible, 48px touch target */}
            <button
              aria-label="Search"
              className="flex h-12 w-12 items-center justify-center text-navy hover:text-gold transition-colors -mr-2 sm:mr-0"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Wishlist — desktop only */}
            <button
              aria-label="Wishlist"
              className="hidden h-12 w-12 items-center justify-center text-navy hover:text-gold transition-colors md:flex"
            >
              <Heart size={18} strokeWidth={1.5} />
            </button>

            {/* Bag with count */}
            <Link
              href="/bag"
              aria-label={`Shopping bag, ${displayCount} items`}
              className="relative flex h-12 w-12 items-center justify-center text-navy hover:text-gold transition-colors -ml-2 sm:ml-0"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {displayCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[8px] font-bold text-navy">
                  {displayCount}
                </span>
              )}
            </Link>

            {/* Account — desktop only */}
            <Link
              href={accountHref}
              aria-label="Account"
              className="hidden h-12 w-12 items-center justify-center text-navy hover:text-gold transition-colors md:flex"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>

            {/* Hamburger — mobile only, 48px touch target */}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-12 w-12 items-center justify-center text-navy md:hidden -mr-2"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-navy/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 z-[70] h-full w-[80vw] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-line px-6 h-14">
          <span className="font-serif text-lg font-semibold tracking-tight text-navy">
            FÉROCE
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-12 w-12 items-center justify-center text-navy hover:text-gold transition-colors"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer links */}
        <div className="px-6 py-6">
          <p className="label mb-4 text-navy/40">Shop</p>
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-12 items-center font-serif text-base text-navy hover:text-gold transition-colors border-b border-line/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Drawer footer links */}
        <div className="px-6 py-4 border-t border-line">
          <ul className="space-y-1">
            <li>
              <Link
                href={accountHref}
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center text-[11px] uppercase tracking-luxury text-navy hover:text-gold transition-colors"
              >
                <User size={16} strokeWidth={1.5} className="mr-3" />
                Account
              </Link>
            </li>
            <li>
              <Link
                href="/bag"
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center text-[11px] uppercase tracking-luxury text-navy hover:text-gold transition-colors"
              >
                <ShoppingBag size={16} strokeWidth={1.5} className="mr-3" />
                Bag {displayCount > 0 && `(${displayCount})`}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Mail,
  Settings,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & Inventory', href: '/admin/products', icon: Package },
  { label: 'Orders & Pre-Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'The Circle Clients', href: '/admin/customers', icon: Users },
  { label: 'Atelier Emails', href: '/admin/emails', icon: Mail },
  { label: 'Key Access & Settings', href: '/admin/settings', icon: Settings, tab: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-[#FBFBFC] text-navy antialiased font-sans">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-col border-r border-gray-200/80 bg-white fixed inset-y-0 left-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand Header with Authentic FÉROCE Monogram Emblem */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-3 group">
            <img
              src="/images/feroce-emblem.png"
              alt="FÉROCE Monogram"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
            />
            <div className="flex flex-col">
              <span className="font-sans text-lg font-bold tracking-[0.14em] text-navy group-hover:text-gold transition-colors leading-none">
                FÉROCE
              </span>
              <span className="text-[8px] font-sans uppercase tracking-[0.32em] text-navy/60 font-semibold mt-1">
                Atelier Admin
              </span>
            </div>
          </Link>

          {/* Active Status Pill */}
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/70 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-sans uppercase tracking-wider font-semibold text-navy/70">
              Dallas Atelier HQ · Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-navy/40">
            Management & Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-full transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? 'bg-navy text-white shadow-xs font-semibold'
                    : 'text-navy/65 hover:bg-[#F6F6F8] hover:text-navy'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-gold' : 'text-navy/50'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2 bg-white">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold text-navy/70 hover:text-navy hover:bg-[#F6F6F8] border border-gray-200/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={14} />
              <span>Return to Boutique</span>
            </div>
            <ExternalLink size={12} className="text-navy/40" />
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold text-navy/60 hover:text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
          >
            <LogOut size={14} />
            <span>Director Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 h-16 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src="/images/feroce-emblem.png"
            alt="FÉROCE Emblem"
            className="w-8 h-8 object-contain drop-shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm tracking-[0.14em] text-navy leading-none">
              FÉROCE
            </span>
            <span className="text-[7px] font-sans uppercase tracking-[0.28em] text-navy/60 font-semibold mt-0.5">
              Atelier Admin
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F6F8] border border-gray-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-semibold text-navy/70 uppercase">Dallas</span>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-[#F6F6F8] hover:bg-gray-200/70 flex items-center justify-center text-navy transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-200 p-4 space-y-1.5 shadow-lg animate-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-full min-h-[44px] ${
                  isActive ? 'bg-navy text-white' : 'text-navy/70 hover:bg-[#F6F6F8]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between px-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-xs font-semibold text-navy/70 hover:text-navy flex items-center gap-1.5 py-1"
            >
              <ArrowLeft size={13} />
              <span>Boutique</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold text-red-600 flex items-center gap-1.5 py-1 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Director Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Tab Bar ── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 flex"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.filter((item) => item.tab !== false).map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-colors ${
                isActive ? 'text-navy font-bold' : 'text-navy/40 font-medium'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] font-sans uppercase tracking-wider">
                {item.label.split(' ')[0]}
              </span>
            </Link>
          )
        })}
      </div>

      {/* ── Main Content Container ── */}
      <main className="flex-1 min-w-0 md:ml-64 lg:ml-72 md:pt-0 pt-16 pb-20 md:pb-10">
        {children}
      </main>
    </div>
  )
}

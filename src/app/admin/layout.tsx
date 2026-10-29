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
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & Inventory', href: '/admin/products', icon: Package },
  { label: 'Orders & Pre-Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Atelier Emails', href: '/admin/emails', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings, tab: false },
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
    <div className="flex min-h-screen bg-[#FBFBFC] text-navy antialiased">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-col border-r border-gray-200/80 bg-white fixed inset-y-0 left-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#F6F6F8] border border-gray-200 flex items-center justify-center text-navy font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <span className="font-serif text-base text-gold">F</span>
            </div>
            <div>
              <p className="font-sans font-bold text-sm tracking-tight text-navy">FÉROCE ATELIER</p>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold text-navy/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Dallas Backoffice
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-navy/40">
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
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold text-navy/60 hover:text-navy hover:bg-[#F6F6F8] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Boutique</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold text-navy/60 hover:text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#F6F6F8] border border-gray-200 flex items-center justify-center text-xs font-bold font-serif text-gold">
            F
          </div>
          <span className="font-sans font-bold text-sm text-navy">FÉROCE HQ</span>
          <span className="rounded-full px-2 py-0.5 bg-[#F6F6F8] text-[9px] font-semibold text-navy/60 uppercase">
            Admin
          </span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 rounded-full bg-[#F6F6F8] flex items-center justify-center text-navy cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-white border-b border-gray-200 p-4 space-y-1 shadow-lg">
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
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between px-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-xs font-semibold text-navy/60 flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Boutique</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
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
                isActive ? 'text-navy' : 'text-navy/40'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] font-sans font-semibold uppercase tracking-wider">
                {item.label.split(' ')[0]}
              </span>
            </Link>
          )
        })}
      </div>

      {/* ── Main Content Container ── */}
      <main className="flex-1 min-w-0 md:ml-64 lg:ml-72 md:pt-0 pt-14 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}

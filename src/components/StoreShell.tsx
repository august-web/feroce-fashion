'use client'

import { usePathname } from 'next/navigation'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MiniCartDrawer } from '@/components/MiniCartDrawer'

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <MiniCartDrawer />
    </>
  )
}

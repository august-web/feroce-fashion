'use client'

import { usePathname } from 'next/navigation'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LaunchConfetti } from '@/components/LaunchConfetti'

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
      <main>{children}</main>
      <Footer />
      <LaunchConfetti />
    </>
  )
}

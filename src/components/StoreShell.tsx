'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ComingSoonModal } from '@/components/ComingSoonModal'

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [showComingSoon, setShowComingSoon] = useState(false)

  // Show coming soon popup once per session
  useEffect(() => {
    if (isAdmin) return
    const hasSeen = sessionStorage.getItem('feroce-coming-soon-seen')
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowComingSoon(true)
        sessionStorage.setItem('feroce-coming-soon-seen', '1')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isAdmin])

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ComingSoonModal
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </>
  )
}

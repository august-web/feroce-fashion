'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthPromptModal } from '@/components/AuthPromptModal'
import { useAuth } from '@/hooks/useAuth'

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const { isAuthenticated, loading } = useAuth()
  const [showWelcome, setShowWelcome] = useState(false)

  // Show welcome popup once per session for non-signed-in visitors
  useEffect(() => {
    if (loading || isAdmin || isAuthenticated) return
    const hasSeenWelcome = sessionStorage.getItem('feroce-welcome-seen')
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(true)
        sessionStorage.setItem('feroce-welcome-seen', '1')
      }, 2000) // 2 second delay so they see the page first
      return () => clearTimeout(timer)
    }
  }, [loading, isAuthenticated, isAdmin])

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AuthPromptModal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        message="Create an account to start building your bag, track orders, and get early access to new collections."
      />
    </>
  )
}

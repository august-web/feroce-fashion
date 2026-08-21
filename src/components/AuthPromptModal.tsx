'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@/hooks/useAuth'

interface AuthPromptModalProps {
  open: boolean
  onClose: () => void
  message?: string
}

export function AuthPromptModal({ open, onClose, message }: AuthPromptModalProps) {
  const { isAuthenticated } = useAuth()

  // Auto-close if user signs in
  useEffect(() => {
    if (isAuthenticated && open) onClose()
  }, [isAuthenticated, open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || isAuthenticated) return null

  if (typeof window === 'undefined') return null

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 17, 40, 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white border border-line max-w-md w-full px-8 py-10 text-center animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-navy/40 hover:text-navy transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Gold accent line */}
        <div className="w-10 h-px bg-gold mx-auto mb-6" />

        <h2 className="font-serif text-2xl font-semibold text-navy mb-2">
          Welcome to Féroce
        </h2>
        <p className="text-sm text-navy/50 mb-8 leading-relaxed">
          {message || 'Sign in or create an account to add items to your bag and checkout.'}
        </p>

        {/* CTA buttons */}
        <div className="space-y-3">
          <Link
            href="/login"
            onClick={onClose}
            className="block w-full btn-primary py-4 min-h-[48px] text-center"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="block w-full border border-navy text-navy uppercase font-sans font-medium text-[11px] px-9 py-4 min-h-[48px] text-center transition-all duration-300 hover:bg-navy hover:text-white"
            style={{ letterSpacing: '0.2em' }}
          >
            Create Account
          </Link>
        </div>

        <p className="mt-6 text-[10px] text-navy/35 uppercase tracking-wider">
          Already a member? Just sign in above.
        </p>
      </div>
    </div>,
    document.body
  )
}

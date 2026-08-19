'use client'

import { create } from 'zustand'
import { useEffect, useState } from 'react'

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
}

interface ToastStore {
  toasts: Toast[]
  add: (message: string, type?: Toast['type']) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function ToastContainer() {
  const { toasts, remove } = useToastStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 sm:bottom-8 sm:right-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-navy text-white px-5 py-3.5 text-xs font-sans uppercase tracking-luxury shadow-lg animate-slide-up min-h-[48px]"
          style={{ letterSpacing: '0.15em' }}
        >
          {t.type === 'success' && (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 text-white/40 hover:text-white text-sm flex-shrink-0">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

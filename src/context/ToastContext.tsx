import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'

type Toast = { id: number; message: string }
const ToastContext = createContext<{ notify: (message: string) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = useCallback((message: string) => {
    const id = Date.now()
    setToasts(t => [...t, { id, message }])
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600)
  }, [])
  return <ToastContext.Provider value={{ notify }}>
    {children}
    <div className="fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2" aria-live="polite">
      {toasts.map(t => <div key={t.id} className="flex items-center gap-3 bg-ink px-4 py-3 text-sm text-white shadow-2xl animate-fade-up">
        <Check size={16} className="text-[#d8c5a9]" /> <span className="flex-1">{t.message}</span>
        <button aria-label="Dismiss" onClick={() => setToasts(x => x.filter(v => v.id !== t.id))}><X size={15}/></button>
      </div>)}
    </div>
  </ToastContext.Provider>
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used in provider')
  return value
}

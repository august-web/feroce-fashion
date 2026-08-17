import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine, Product } from '../types'
import { readStorage, writeStorage } from '../lib/storage'

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  add: (product: Product, quantity?: number, color?: string, variant?: string) => void
  remove: (key: string) => void
  update: (key: string, quantity: number) => void
  clear: () => void
  open: () => void
  close: () => void
  lineKey: (line: CartLine) => string
}

const CartContext = createContext<CartContextValue | null>(null)
const keyFor = (line: CartLine) => `${line.product.id}:${line.color}:${line.variant}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStorage('feroce-cart-v2', []))
  const [isOpen, setOpen] = useState(false)
  useEffect(() => writeStorage('feroce-cart-v2', lines), [lines])

  const value = useMemo<CartContextValue>(() => ({
    lines,
    isOpen,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + l.quantity * l.product.price, 0),
    lineKey: keyFor,
    add(product, quantity = 1, color = product.colors[0].name, variant = product.variants[0]) {
      const incoming = { product, quantity, color, variant }
      setLines(current => {
        const key = keyFor(incoming)
        const match = current.find(l => keyFor(l) === key)
        return match ? current.map(l => keyFor(l) === key ? { ...l, quantity: Math.min(l.quantity + quantity, 10) } : l) : [...current, incoming]
      })
      setOpen(true)
    },
    remove(key) { setLines(current => current.filter(l => keyFor(l) !== key)) },
    update(key, quantity) { setLines(current => current.map(l => keyFor(l) === key ? { ...l, quantity: Math.max(1, Math.min(quantity, 10)) } : l)) },
    clear() { setLines([]) },
    open() { setOpen(true) }, close() { setOpen(false) },
  }), [lines, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

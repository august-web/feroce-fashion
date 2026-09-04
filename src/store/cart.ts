'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, color?: string) => void
  clearCart: () => void
  totalCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.color === item.color,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.color === item.color
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem: (productId, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => i.productId !== productId || (color !== undefined && i.color !== color),
          ),
        }))
      },

      updateQuantity: (productId, quantity, color) => {
        if (quantity < 1) return get().removeItem(productId, color)
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && (color === undefined || i.color === color)
              ? { ...i, quantity }
              : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    // v1: prices moved from cents to dollars — old persisted carts are
    // wiped once rather than rendering 100x prices.
    { name: 'feroce-cart', version: 1, migrate: () => ({ items: [] }) },
  ),
)

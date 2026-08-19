export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'customer' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'admin'
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string
          price: number
          image_urls: string[]
          color: string
          stock: number
          active: boolean
          is_new: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description: string
          price: number
          image_urls?: string[]
          color: string
          stock?: number
          active?: boolean
          is_new?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          image_urls?: string[]
          color?: string
          stock?: number
          active?: boolean
          is_new?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          stripe_session_id: string | null
          paypal_order_id: string | null
          payment_method:
            | 'card'
            | 'apple_pay'
            | 'google_pay'
            | 'cashapp'
            | 'bank_transfer'
            | 'paypal'
          payment_provider: 'stripe' | 'paypal'
          total: number
          status: 'pending' | 'paid' | 'shipped' | 'cancelled'
          shipping_address: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          stripe_session_id?: string | null
          paypal_order_id?: string | null
          payment_method:
            | 'card'
            | 'apple_pay'
            | 'google_pay'
            | 'cashapp'
            | 'bank_transfer'
            | 'paypal'
          payment_provider: 'stripe' | 'paypal'
          total: number
          status?: 'pending' | 'paid' | 'shipped' | 'cancelled'
          shipping_address?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          stripe_session_id?: string | null
          paypal_order_id?: string | null
          payment_method?:
            | 'card'
            | 'apple_pay'
            | 'google_pay'
            | 'cashapp'
            | 'bank_transfer'
            | 'paypal'
          payment_provider?: 'stripe' | 'paypal'
          total?: number
          status?: 'pending' | 'paid' | 'shipped' | 'cancelled'
          shipping_address?: Json
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          name: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          name: string
          price: number
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          name?: string
          price?: number
          quantity?: number
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

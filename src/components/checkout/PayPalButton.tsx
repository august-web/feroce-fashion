'use client'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''

export function PayPalButton() {
  const { items } = useCartStore()
  const [processing, setProcessing] = useState(false)

  if (!paypalClientId) return null

  const createOrder = async () => {
    if (!items.length) return ''

    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            price: item.price,
            image: item.image,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (data.orderId) {
        return data.orderId
      }

      console.error('PayPal create order error:', data.error)
      return ''
    } catch (error) {
      console.error('PayPal create order network error:', error)
      return ''
    }
  }

  const onApprove = async (data: { orderID?: string }) => {
    if (!data.orderID) return

    setProcessing(true)

    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            price: item.price,
            image: item.image,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      })

      const result = await res.json()

      if (result.orderId) {
        // Clear the cart and redirect to success page
        useCartStore.getState().clearCart()
        window.location.href = `/checkout/success?order=${result.orderId}`
      } else {
        alert(result.error || 'Payment failed. Please try again.')
        setProcessing(false)
      }
    } catch (error) {
      console.error('PayPal capture error:', error)
      alert('Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  const onError = (err: Record<string, unknown>) => {
    console.error('PayPal error:', err)
    setProcessing(false)
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-cream px-3 text-navy/40 font-sans uppercase tracking-[0.1em]">or pay with</span>
          </div>
        </div>

        <div className="mt-4">
          {processing ? (
            <div className="flex items-center justify-center py-4 text-sm text-navy/60">
              <svg className="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing PayPal payment...
            </div>
          ) : (
            <PayPalButtons
              style={{
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal',
                height: 48,
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              disabled={!items.length}
            />
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  )
}

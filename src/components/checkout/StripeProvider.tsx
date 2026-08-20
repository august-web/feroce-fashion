'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ReactNode } from 'react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface StripeProviderProps {
  clientSecret: string
  children: ReactNode
}

export function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0A1128',
            colorBackground: '#ffffff',
            colorText: '#0A1128',
            colorDanger: '#dc2626',
            fontFamily: 'Montserrat, sans-serif',
            borderRadius: '0px',
            spacingUnit: '4px',
          },
          rules: {
            '.Input': {
              border: '1px solid #E2DFD8',
              padding: '12px 16px',
              fontSize: '16px',
            },
            '.Input:focus': {
              border: '1px solid #0A1128',
              boxShadow: 'none',
            },
            '.Tab': {
              border: '1px solid #E2DFD8',
              borderRadius: '0px',
            },
            '.Tab:hover': {
              border: '1px solid #0A1128',
            },
            '.Tab--selected': {
              border: '1px solid #0A1128',
              backgroundColor: '#F4F1EA',
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}

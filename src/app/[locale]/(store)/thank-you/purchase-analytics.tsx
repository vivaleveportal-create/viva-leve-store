'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics-client'

export default function PurchaseAnalytics({ orderId }: { orderId?: string }) {
  useEffect(() => {
    trackEvent('purchase_completed', {
      payload: {
        order_id: orderId
      }
    })

    // Disparar conversão Google Ads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'AW-18064014602')
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-18064014602/cdySCMa32JUcEIr6y6VD',
        'value': 1.0,
        'currency': 'BRL'
      })
    }
  }, [orderId])

  return null
}

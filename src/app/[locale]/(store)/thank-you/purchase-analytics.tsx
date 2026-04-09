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
    if (typeof window !== 'undefined') {
      const gtag = (window as any).gtag
      if (typeof gtag === 'function') {
        gtag('config', 'AW-18064014602')
        gtag('event', 'conversion', {
          'send_to': 'AW-18064014602/cdySCMa32JUcEIr6y6VD',
          'value': 1.0,
          'currency': 'BRL'
        })
      } else {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push(['config', 'AW-18064014602']);
        (window as any).dataLayer.push(['event', 'conversion', {
          'send_to': 'AW-18064014602/cdySCMa32JUcEIr6y6VD',
          'value': 1.0,
          'currency': 'BRL'
        }]);
      }
    }
  }, [orderId])

  return null
}

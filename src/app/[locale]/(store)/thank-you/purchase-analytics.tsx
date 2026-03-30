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
  }, [orderId])

  return null
}

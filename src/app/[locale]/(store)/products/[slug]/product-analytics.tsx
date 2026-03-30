'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics-client'

interface ProductAnalyticsProps {
  productId: string
  productName: string
  productSlug: string
}

export default function ProductAnalytics({ productId, productName, productSlug }: ProductAnalyticsProps) {
  useEffect(() => {
    trackEvent('product_view', {
      product_id: productId,
      payload: {
        name: productName,
        slug: productSlug
      }
    })
  }, [productId, productName, productSlug])

  return null
}

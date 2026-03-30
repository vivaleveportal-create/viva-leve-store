'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics-client'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackEvent('page_view', {
      payload: {
        path: pathname,
        url: window.location.href,
        utm_source: searchParams.get('utm_source'),
        utm_campaign: searchParams.get('utm_campaign')
      }
    })
  }, [pathname, searchParams])

  return null
}

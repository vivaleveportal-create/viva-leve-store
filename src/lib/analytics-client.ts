'use client'

export type AnalyticsEventType = 
  | 'page_view'
  | 'product_view'
  | 'chat_opened'
  | 'chat_message_sent'
  | 'whatsapp_click'
  | 'purchase_completed'

interface InternalTrackOptions {
  product_id?: string
  payload?: any
  source?: 'site' | 'chat' | 'whatsapp'
}

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('viva_leve_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('viva_leve_session_id', sessionId)
  }
  return sessionId
}

export const trackEvent = async (type: AnalyticsEventType, options: InternalTrackOptions = {}) => {
  if (typeof window === 'undefined') return

  const sessionId = getSessionId()
  
  // 1. GA4 tracking (requires window.gtag)
  if (typeof window.gtag === 'function') {
    window.gtag('event', type, {
      session_id: sessionId,
      product_id: options.product_id,
      ...options.payload
    })
  } else if (type === 'page_view' && typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
          page_path: window.location.pathname,
      });
  }

  // 2. Internal Observability tracking
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: type,
        session_id: sessionId,
        product_id: options.product_id,
        payload: options.payload,
        source: options.source || 'site',
      })
    })
  } catch (err) {
    console.error('[Analytics Client Error]', err)
  }
}

// Global declaration for gtag
declare global {
  function gtag(...args: any[]): void;
}

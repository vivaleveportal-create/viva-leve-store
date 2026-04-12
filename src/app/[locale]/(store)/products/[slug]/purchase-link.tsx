'use client'

import { trackEvent } from '@/lib/analytics-client'
import { Link } from '@/i18n/routing'

interface PurchaseLinkProps {
  href: string
  slug: string
  children: React.ReactNode
  className?: string
}

export default function PurchaseLink({ href, slug, children, className }: PurchaseLinkProps) {
  const handleClick = () => {
    trackEvent('purchase_click', { product_id: slug })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}

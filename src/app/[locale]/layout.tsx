import type { Metadata, Viewport } from 'next'
import { Inter, Outfit, Fraunces } from 'next/font/google'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import '../globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap'
})

export const viewport: Viewport = {
  themeColor: '#00756e',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal',
    template: `%s | ${process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'}`,
  },
  description: 'Produtos pensados para quem sabe o valor de viver com qualidade. Viva Leve Portal.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Viva Leve Portal',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Viva Leve Portal - Cuide bem de você',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params?: Promise<{ locale?: string }>
}) {
  let locale = 'pt';
  if (params) {
    const p = await params;
    if (p.locale) {
      locale = p.locale;
    }
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.className} ${fraunces.variable} min-h-screen flex flex-col`}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <Script
          id="google-ads"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
          `}
        </Script>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <NextIntlClientProvider messages={messages}>
          <main className="flex-grow">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

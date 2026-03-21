import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <main className="flex-grow">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

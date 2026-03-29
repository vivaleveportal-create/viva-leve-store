import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import StoreNavbar from '@/components/store/navbar'
import StoreFooter from '@/components/store/footer'
import WhatsappButton from '@/components/store/whatsapp-button'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_STORE_NAME || 'Loja Digital'}`,
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreNavbar />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsappButton />
      <Toaster position="top-center" richColors />
    </div>
  )
}

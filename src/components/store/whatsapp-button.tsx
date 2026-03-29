'use client'

import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function WhatsappButton() {
  const pathname = usePathname()
  
  // Ocultar em páginas de produto (/products/...)
  const isProductPage = pathname?.includes('/products/')

  if (isProductPage) return null

  const whatsappUrl = 'https://wa.me/5521982266075?text=Olá! Gostaria de tirar uma dúvida sobre a loja.'

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group flex items-center gap-2"
      aria-label="Falar conosco no WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
        Falar no WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
      </span>
    </a>
  )
}

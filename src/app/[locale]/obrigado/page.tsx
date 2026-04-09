'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

// Declarando gtag globalmente para o TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export default function ObrigadoPage() {
  useEffect(() => {
    // Função para disparar a conversão
    const fireConversion = () => {
      if (typeof window !== 'undefined') {
        const gtag = (window as any).gtag
        
        if (typeof gtag === 'function') {
          // Garantir que o ID da conta está configurado
          gtag('config', 'AW-18064014602')
          
          // Dispara o evento de conversão específico
          gtag('event', 'conversion', {
            send_to: 'AW-18064014602/cdySCMa32JUcEIr6y6VD',
            value: 1.0,
            currency: 'BRL'
          })
          console.log('Google Ads Conversion Fired!')
        } else {
          // Fallback para dataLayer caso o gtag ainda não seja uma função
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push(['config', 'AW-18064014602']);
          (window as any).dataLayer.push(['event', 'conversion', {
            send_to: 'AW-18064014602/cdySCMa32JUcEIr6y6VD',
            value: 1.0,
            currency: 'BRL'
          }]);
          console.log('Google Ads Conversion queued via dataLayer.')
        }
      }
    }

    // Tentar disparar imediatamente
    fireConversion()

    // Fallback: tentar novamente em 1 e 2 segundos caso o script demore a carregar
    const timer1 = setTimeout(fireConversion, 1000)
    const timer2 = setTimeout(fireConversion, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      <CheckCircle2 color="#00756e" size={80} className="mb-6 animate-bounce-subtle" />
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#00756e]">
        Pedido confirmado! 🎉
      </h1>
      
      <p className="text-lg text-gray-600 max-w-lg mb-10 leading-relaxed">
        Obrigado pela sua compra! Em breve nossa equipe entrará em contato para confirmar os detalhes da entrega.
      </p>
      
      <Link 
        href="/"
        className="px-8 py-3 bg-[#80b023] hover:bg-[#6c951e] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95"
      >
        Ver mais produtos
      </Link>
    </div>
  )
}

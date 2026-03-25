import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react'

export default async function StoreFooter() {
  const year = new Date().getFullYear()
  const name = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'
  const t = await getTranslations('Footer')
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP

  return (
    <footer className="bg-[#0a1f1e] text-gray-400 py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Superior Grid — Rigorous Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 mb-20">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <div className="h-20 flex items-center mb-6">
              <Image 
                src="/logo/logo-white.png" 
                alt={name} 
                width={340} 
                height={140} 
                className="h-[140px] w-auto -mt-32"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-400/80 pt-4">
              Produtos pensados para quem sabe o valor de viver com qualidade.
            </p>
          </div>

          {/* Column 2: Nav */}
          <div className="flex flex-col">
            <div className="h-20 flex items-center mb-6">
              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[12px]">Navegação</h4>
            </div>
            <ul className="space-y-4 text-sm">
              <li><Link href="/products" className="hover:text-viva-accent-warm transition-colors decoration-0">Produtos</Link></li>
              <li><Link href="/quem-somos" className="hover:text-viva-accent-warm transition-colors decoration-0">Quem Somos</Link></li>
              <li><Link href="/contato" className="hover:text-viva-accent-warm transition-colors decoration-0">Contato</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col">
            <div className="h-20 flex items-center mb-6">
              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[12px]">Suporte</h4>
            </div>
            <ul className="space-y-4 text-sm">
              <li><Link href="/termos" className="hover:text-viva-accent-warm transition-colors decoration-0">{t('terms')}</Link></li>
              <li><Link href="/privacidade" className="hover:text-viva-accent-warm transition-colors decoration-0">{t('privacy')}</Link></li>
              <li><Link href="/cookies" className="hover:text-viva-accent-warm transition-colors decoration-0">Cookies</Link></li>
              {whatsapp && (
                <li>
                  <a 
                    href={`https://wa.me/${whatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-viva-accent-warm transition-colors decoration-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Trust */}
          <div className="flex flex-col">
            <div className="h-20 flex items-center mb-6">
              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[12px]">Segurança</h4>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-sm text-gray-400/80">
                <ShieldCheck className="w-5 h-5 text-viva-accent-warm/60" />
                <span>Pagamento via Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400/80">
                <Truck className="w-5 h-5 text-viva-accent-warm/60" />
                <span>Entrega via Logzz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar — Minimalist */}
        <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-4 text-[10px] tracking-widest uppercase text-gray-500">
          <p>© {year} {name}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}

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
    <footer className="bg-[#0a1f1e] text-gray-400 py-10 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Top Centered Logo/Titles Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 items-start">
          
          {/* Col 1 */}
          <div className="flex flex-col">
            <div className="h-[90px] flex items-center mb-1">
              <Image 
                src="/logo/logo-white.png" 
                alt={name} 
                width={200} 
                height={90} 
                className="h-[90px] w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs opacity-70">
              Produtos pensados para quem sabe o valor de viver com qualidade.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col">
            <div className="h-[90px] flex items-center mb-1">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Navegação</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Produtos</Link></li>
              <li><Link href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col">
            <div className="h-[90px] flex items-center mb-1">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Suporte</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/termos" className="hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href="/privacidade" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              {whatsapp && (
                <li>
                  <a 
                    href={`https://wa.me/${whatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col">
            <div className="h-[90px] flex items-center mb-1">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Segurança</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm opacity-80">
                <ShieldCheck className="w-5 h-5 text-viva-accent-warm" />
                <span>Pagamento via Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-80">
                <Truck className="w-5 h-5 text-viva-accent-warm" />
                <span>Entrega via Logzz</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <p>© {year} {name}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}

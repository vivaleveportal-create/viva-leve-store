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
    <footer className="bg-[#0a1f1e] text-gray-400 py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Col 1: Logo & Tagline */}
          <div className="space-y-6">
            <Image 
              src="/logo/logo-white.png" 
              alt={name} 
              width={160} 
              height={44} 
              className="h-12 w-auto"
            />
            <p className="text-sm leading-relaxed max-w-xs">
              Produtos pensados para quem sabe o valor de viver com qualidade.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm">Navegação</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Produtos</Link></li>
              <li><Link href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm">Suporte</h4>
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

          {/* Col 4: Trust Badges */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm">Segurança</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <ShieldCheck className="w-5 h-5 text-viva-blue" />
                <span>Pagamento Seguro via Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Truck className="w-5 h-5 text-viva-blue" />
                <span>Entrega via Logzz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {year} {name}. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/termos" className="hover:text-white transition-colors">{t('terms')}</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">{t('privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


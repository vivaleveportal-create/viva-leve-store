import { Link } from '@/i18n/routing'
import { connectMongo } from '@/lib/mongodb'
import ProductModel from '@/lib/models/Product'
import CategoryModel from '@/lib/models/Category'
import { formatPrice } from '@/lib/utils'
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  MessageCircle,
  ShoppingBag
} from 'lucide-react'
import Image from 'next/image'
import ProductCard from '@/components/store/product-card'

async function getHomeData(locale: string) {
  await connectMongo()
  const [products, categories] = await Promise.all([
    ProductModel.find({ active: true, locale, featured: true })
      .populate('category', 'label name value')
      .limit(8)
      .lean(),
    CategoryModel.find({ locale })
      .limit(10)
      .lean()
  ])
  return { products, categories }
}

export default async function StoreHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { products, categories } = await getHomeData(locale)
  const currency = locale === 'en' ? 'USD' : 'BRL'
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP
    ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`
    : '#'

  const firstProduct = products?.[0] as any
  const categoryLabel = firstProduct?.category?.label || firstProduct?.category?.name

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Section 1 — Hero Editorial */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0a1f1e]">
        {firstProduct ? (
          <>
            <Image 
              src="/images/hero-bg.jpg" 
              fill 
              className="object-cover opacity-60" 
              alt="Viva Leve Portal" 
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f1e] via-[#0a1f1e]/60 to-transparent" />
            
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20">
              <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                {categoryLabel && (
                  <span className="bg-viva-accent-warm/20 text-viva-accent-warm text-xs px-4 py-1.5 rounded-full uppercase font-bold tracking-widest inline-block mb-6 backdrop-blur-sm border border-viva-accent-warm/20">
                    {categoryLabel}
                  </span>
                )}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-semibold text-white leading-[1.1] mb-6 drop-shadow-sm">
                  {firstProduct.name}
                </h1>
                <p className="text-3xl font-bold text-viva-accent-warm mb-10 font-display">
                  {formatPrice(Math.round(firstProduct.price * 100), currency)}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <Link
                    href={`/products/${firstProduct.slug}` as any}
                    className="inline-flex items-center justify-center bg-viva-primary text-white font-semibold px-10 py-5 rounded-full hover:brightness-110 transition-all shadow-xl hover:shadow-viva-primary/20 hover:-translate-y-1 active:scale-95 text-lg"
                  >
                    Ver produto
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    href="/products"
                    className="text-white/70 hover:text-white text-base font-medium transition-colors border-b border-white/20 hover:border-white py-1"
                  >
                    Ver todos os produtos →
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20 text-center flex flex-col items-center">
             <Image src="/logo/logo-white.png" alt="Viva Leve" width={200} height={60} className="mb-10" />
             <h1 className="text-5xl font-display font-semibold text-white mb-6">Qualidade em cada detalhe</h1>
             <Link href="/products" className="bg-viva-primary text-white px-10 py-4 rounded-full font-bold shadow-lg">
                Explorar Loja
             </Link>
          </div>
        )}
      </section>

      {/* Section 2 — Trust bar */}
      <section className="bg-[#0d2827] text-white py-3 min-h-[48px] flex items-center border-y border-white/5">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-around gap-x-12 gap-y-4 px-4 w-full">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-wide">
            <Truck className="w-5 h-5 text-viva-blue" />
            ENTREGA NACIONAL GARANTIDA
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-wide">
            <ShieldCheck className="w-5 h-5 text-viva-blue" />
            PAGAMENTO 100% SEGURO
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-wide">
            <MessageCircle className="w-5 h-5 text-viva-blue" />
            SUPORTE VIA WHATSAPP
          </div>
        </div>
      </section>

      {/* Section 3 — Featured Products */}
      {products.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-viva-text">Nossa Vitrine</h2>
                <div className="h-1 w-20 bg-viva-accent rounded-full" />
              </div>
              <Link 
                href="/products" 
                className="hidden sm:flex items-center gap-1.5 text-viva-primary font-bold hover:text-viva-accent-warm transition-colors"
              >
                Ver tudo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {(products as any[]).map((product) => (
                <ProductCard key={product._id.toString()} product={product} currency={currency} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 4 — Por que escolher o Viva Leve */}
      <section className="py-24 px-4 bg-[#f5f5f0]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-viva-text mb-16">
            Por que escolher o Viva Leve?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-md transition-shadow">
                <Truck className="w-8 h-8 text-viva-primary" />
              </div>
              <h3 className="font-display font-bold text-viva-text text-lg">Entrega nacional</h3>
              <p className="text-sm text-viva-muted leading-relaxed">
                Entrega garantida via Logzz em 3 a 7 dias úteis para todo o Brasil.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-md transition-shadow">
                <ShieldCheck className="w-8 h-8 text-viva-primary" />
              </div>
              <h3 className="font-display font-bold text-viva-text text-lg">Pagamento seguro</h3>
              <p className="text-sm text-viva-muted leading-relaxed">
                Sua compra é 100% protegida pela tecnologia de pagamentos do Stripe.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-md transition-shadow">
                <MessageCircle className="w-8 h-8 text-viva-primary" />
              </div>
              <h3 className="font-display font-bold text-viva-text text-lg">Suporte humano</h3>
              <p className="text-sm text-viva-muted leading-relaxed">
                Esqueça os robôs. Nossa equipe real atende você diretamente pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Categorias (Pills interativas) */}
      <section id="categories" className="py-20 px-4 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-viva-text mb-10">Explorar Categorias</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat: any) => (
              <Link
                key={cat._id.toString()}
                href={`/products?categoria=${cat.value}`}
                className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-viva-muted bg-white hover:border-viva-primary hover:text-viva-primary hover:bg-viva-primary/5 transition-all duration-300 shadow-sm"
              >
                {cat.label || cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Banner WhatsApp */}
      <section className="py-20 px-4 bg-[#0a1f1e] text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-white mb-2">
              Ainda com dúvidas? <br />
              <span className="text-viva-accent-warm">Fale com nossos especialistas.</span>
            </h2>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-[#25D366] text-white hover:bg-[#128C7E] font-bold px-10 py-5 rounded-full shadow-[0_10px_40px_-10px_rgba(37,211,102,0.4)] transition-all hover:scale-105 active:scale-95 text-lg shrink-0"
          >
            Chamar no WhatsApp
            <MessageCircle className="ml-3 w-6 h-6" />
          </a>
        </div>
      </section>
    </div>
  )
}

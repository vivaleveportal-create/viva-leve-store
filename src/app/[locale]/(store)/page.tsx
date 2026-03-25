import Link from 'next/link'
import { connectMongo } from '@/lib/mongodb'
import ProductModel from '@/lib/models/Product'
import CategoryModel from '@/lib/models/Category'
import { formatPrice } from '@/lib/utils'
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  Activity, 
  Sparkles, 
  Moon, 
  Home, 
  PawPrint,
  Smile 
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

  const categoryIcons: Record<string, any> = {
    'Saúde e Mobilidade': Activity,
    'Cuidados com a Pele': Sparkles,
    'Conforto e Sono': Moon,
    'Casa e Utilidades': Home,
    'Pets': PawPrint,
    'Beleza e Cuidados Pessoais': Smile,
    'Health and Mobility': Activity,
    'Skin Care': Sparkles,
    'Comfort and Sleep': Moon,
    'Home and Utilities': Home,
    'Pets EN': PawPrint,
    'Beauty and Personal Care': Smile,
  }

  const firstProduct = products?.[0] as any
  const categoryLabel = firstProduct?.category?.label || firstProduct?.category?.name

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Section 1 — Hero Split (Produto + Texto) */}
      <section className="relative overflow-hidden bg-[#0a1f1e] py-10 md:py-16 lg:py-20 px-4">
        {/* Decorative Element */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(91,157,181,0.08)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {firstProduct && firstProduct.images?.[0] ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Coluna esquerda: Texto + CTA */}
              <div className="lg:col-span-5 order-2 md:order-1 space-y-6">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  {categoryLabel && (
                    <span className="bg-viva-accent-warm/20 text-viva-accent-warm text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider mb-4 inline-block">
                      {categoryLabel}
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white leading-tight mb-4">
                    {firstProduct.name}
                  </h1>
                  <p className="text-3xl md:text-4xl font-black text-viva-accent-warm mb-8">
                    {formatPrice(Math.round(firstProduct.price * 100), currency)}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <Link
                      href={`/products/${firstProduct.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center bg-viva-primary text-white hover:bg-viva-primary-hover px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group"
                    >
                      Ver produto
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/products"
                      className="text-white/60 hover:text-white font-medium transition-colors text-sm"
                    >
                      Ver todos os produtos →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Coluna direita: Imagem destaque */}
              <div className="lg:col-span-7 order-1 md:order-2">
                <div className="relative aspect-square drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-[1.03] transition-transform duration-700 animate-in fade-in zoom-in duration-700 p-8">
                  <Image
                    src={firstProduct.images[0]}
                    alt={firstProduct.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Hero */
            <div className="text-center py-12 flex flex-col items-center">
              <div className="mb-8">
                <Image src="/logo/logo-white.png" alt="Viva Leve" width={200} height={60} />
              </div>
              <h1 className="text-4xl font-bold font-display text-white mb-4">Conheça nossos produtos</h1>
              <p className="text-xl text-white/70 mb-8 max-w-xl">Produtos pensados para quem sabe o valor de viver com qualidade.</p>
              <Link href="/products" className="bg-viva-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                Ver todos os produtos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Section 2 — Trust bar */}
      <section className="bg-[#0d2827] text-white py-4 border-y border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide min-h-[48px] flex items-center">
        <div className="max-w-6xl mx-auto flex justify-around gap-8 px-4 items-center w-full">
          <div className="flex items-center gap-3 text-sm font-medium shrink-0">
            <Truck className="w-5 h-5 text-viva-blue" />
            Entrega nacional garantida
          </div>
          <div className="flex items-center gap-3 text-sm font-medium shrink-0">
            <ShieldCheck className="w-5 h-5 text-viva-blue" />
            Pagamento 100% seguro via Stripe
          </div>
          <div className="flex items-center gap-3 text-sm font-medium shrink-0">
            <MessageCircle className="w-5 h-5 text-viva-blue" />
            Suporte via WhatsApp
          </div>
        </div>
      </section>

      {/* Section 3 — Grid de Produtos Destaques */}
      {products.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-display text-viva-text">Destaques</h2>
              <Link 
                href="/products" 
                className="flex items-center gap-1.5 text-viva-primary font-bold hover:text-viva-accent-warm transition-colors"
              >
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {(products as any[]).map((product) => (
                <ProductCard key={product._id.toString()} product={product} currency={currency} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 4 — Categorias (scroll horizontal) */}
      <section className="py-10 px-4 bg-viva-surface border-y border-gray-100/50">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <h2 className="text-xl font-bold font-display text-viva-text mb-6">Categorias</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x">
            {categories.map((cat: any) => {
              const label = cat.label || cat.name;
              const IconComp = categoryIcons[label] || Activity;
              return (
                <Link
                  key={cat._id.toString()}
                  href={`/products?categoria=${cat.value}`}
                  className="flex items-center gap-2.5 bg-white hover:bg-viva-primary hover:text-white px-5 py-3 rounded-full text-sm font-bold text-viva-muted hover:border-viva-primary border border-gray-200 transition-all shrink-0 shadow-sm hover:shadow-md snap-start group"
                >
                  <IconComp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5 — Banner WhatsApp */}
      <section className="py-12 md:py-16 px-4 bg-[#0a1f1e] border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-display">Precisa de ajuda para escolher?</h2>
            <p className="text-base text-white/90">Nossa equipe responde pelo WhatsApp em até 5 minutos.</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-viva-accent-warm text-white hover:bg-viva-accent transition-all font-bold px-8 py-4 rounded-xl shadow-lg shrink-0 outline-none hover:scale-105 active:scale-95"
          >
            Falar com a gente
            <MessageCircle className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  )
}

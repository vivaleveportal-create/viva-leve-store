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
  ShoppingBag,
  Cpu,
  Activity,
  Sparkles,
  Moon,
  Home,
  PawPrint,
  Smile
} from 'lucide-react'
import Image from 'next/image'
import ProductCard from '@/components/store/product-card'

const categoryIcons: Record<string, any> = {
  'Saúde e Mobilidade': Activity,
  'Cuidados com a Pele': Sparkles,
  'Conforto e Sono': Moon,
  'Casa e Utilidades': Home,
  'Pets': PawPrint,
  'Beleza e Cuidados Pessoais': Smile,
  'Eletrônicos e Tecnologia': Cpu,
  'Health and Mobility': Activity,
  'Skin Care': Sparkles,
  'Comfort and Sleep': Moon,
  'Home and Utilities': Home,
  'Pets EN': PawPrint,
  'Beauty and Personal Care': Smile,
  'Electronics and Technology': Cpu,
}

async function getHomeData(locale: string, page: number = 1) {
  await connectMongo()
  const limit = 12
  const skip = (page - 1) * limit
  
  const [products, totalFeatured, categories] = await Promise.all([
    ProductModel.find({ active: true, locale, featured: true })
      .populate('category', 'label name value')
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments({ active: true, locale, featured: true }),
    CategoryModel.find({ locale })
      .limit(12)
      .lean()
  ])
  return { products, totalFeatured, categories }
}

export default async function StoreHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  
  const { products, totalFeatured, categories } = await getHomeData(locale, page)
  const totalPages = Math.ceil(totalFeatured / 12)
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
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-white leading-tight mb-4">
                  Porque viver bem não precisa ser complicado.
                </h1>
                <p className="text-lg text-white/80 max-w-md mb-8">
                  Produtos selecionados para cuidar de você, da sua casa e de quem você ama.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center bg-viva-primary text-white font-semibold px-10 py-5 rounded-full hover:brightness-110 transition-all shadow-xl hover:shadow-viva-primary/20 hover:-translate-y-1 active:scale-95 text-lg"
                  >
                    Ver produtos
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    href="/quem-somos"
                    className="text-white hover:text-viva-accent-warm font-semibold transition-colors flex items-center gap-2 group text-lg"
                  >
                    Conheça nossa história
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
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
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-wide font-display">
            <MessageCircle className="w-5 h-5 text-viva-blue" />
            ATENDIMENTO POR CHAT OU WHATSAPP
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
                <div className="h-1 w-20 bg-viva-primary rounded-full" />
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <Link
                  href={{ pathname: '/', query: { page: page - 1 } }}
                  className={`px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all ${
                    page === 1 
                      ? 'opacity-40 pointer-events-none' 
                      : 'hover:border-viva-primary hover:text-viva-primary'
                  }`}
                >
                  ← Anterior
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={{ pathname: '/', query: { page: p } }}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                        page === p
                          ? 'bg-viva-primary text-white'
                          : 'border border-gray-200 text-viva-muted hover:border-viva-primary hover:text-viva-primary'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                <Link
                  href={{ pathname: '/', query: { page: page + 1 } }}
                  className={`px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all ${
                    page === totalPages 
                      ? 'opacity-40 pointer-events-none' 
                      : 'hover:border-viva-primary hover:text-viva-primary'
                  }`}
                >
                  Próxima →
                </Link>
              </div>
            )}
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
              <h3 className="font-display font-bold text-viva-text text-lg">Atendimento personalizado</h3>
              <p className="text-sm text-viva-muted leading-relaxed">
                Tire suas dúvidas pelo chat na página do produto ou diretamente pelo WhatsApp.
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
                href={{ pathname: '/products', query: { categoria: cat.value } }}
                className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-viva-muted bg-white hover:border-viva-primary hover:text-viva-primary hover:bg-viva-primary/5 transition-all duration-300 shadow-sm"
              >
                {cat.label || cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#0a1f1e] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight">
            Ficou com dúvida sobre algum produto?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mt-4 leading-relaxed">
            Acesse a página do produto e use o chat para tirar dúvidas na hora. <br className="hidden md:block" />
            Prefere o WhatsApp? Também estamos por lá.
          </p>
        </div>
      </section>
    </div>
  )
}

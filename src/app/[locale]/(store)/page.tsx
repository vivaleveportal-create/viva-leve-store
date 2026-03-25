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
      .limit(4)
      .lean(),
    CategoryModel.find({ locale })
      .limit(5)
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Section 1 — Hero */}
      <section className="bg-gradient-to-br from-viva-primary via-[#006b65] to-[#005a55] py-24 px-4 md:py-36 lg:py-40 overflow-hidden relative">
        {/* Decorative Element */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center text-white relative z-10">
          <div className="mb-10 animate-in fade-in zoom-in duration-700">
            <Image 
              src="/logo/logo-white.png" 
              alt="Viva Leve Portal" 
              width={220} 
              height={60} 
              className="h-auto"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold font-display mb-6 tracking-tight leading-tight max-w-4xl">
            Cuide bem de você.
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl leading-relaxed">
            Produtos pensados para quem sabe o valor de viver com qualidade.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-white text-viva-primary hover:bg-viva-accent hover:text-white font-bold px-12 py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 group text-lg"
          >
            Ver produtos
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Section 4 — Trust bar */}
      <section className="bg-viva-teal-dark text-white py-4 border-y border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="max-w-6xl mx-auto flex justify-around gap-8 px-4 items-center">
          <div className="flex items-center gap-3 text-sm font-medium shrink-0">
            <Truck className="w-5 h-5 opacity-80" />
            Entrega garantida pela Logzz
          </div>
          <div className="flex items-center gap-3 text-sm font-medium shrink-0">
            <ShieldCheck className="w-5 h-5 opacity-80" />
            Pagamento seguro via Stripe
          </div>
          <div className="flex items-center gap-3 text-sm font-medium shrink-0">
            <MessageCircle className="w-5 h-5 opacity-80" />
            Suporte via WhatsApp
          </div>
        </div>
      </section>

      {/* Section 2 — Categories */}
      <section className="py-24 px-4 bg-viva-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Escolha por categoria</h2>
            <div className="w-20 h-1.5 bg-viva-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat: any) => {
              const label = cat.label || cat.name;
              const IconComp = categoryIcons[label] || Activity;
              return (
                <Link
                  key={cat._id.toString()}
                  href={`/products?categoria=${cat.slug || cat._id}`}
                  className="bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-viva-primary hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-viva-surface flex items-center justify-center mb-6 group-hover:bg-viva-primary group-hover:text-white transition-colors">
                    <IconComp className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold font-display mb-3 leading-snug">{label}</h3>
                  <div className="mt-auto text-viva-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 mx-auto" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Featured products */}
      {products.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div className="max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-viva-text">Destaques para você</h2>
                <p className="text-lg text-gray-600 leading-relaxed">Seleção exclusiva de produtos para o seu bem-estar.</p>
              </div>
              <Link 
                href="/products" 
                className="hidden md:flex items-center gap-2 text-viva-primary font-bold hover:text-viva-accent-warm hover:underline underline-offset-8 transition-colors text-lg"
              >
                Ver tudo <ArrowRight className="w-5 h-5 font-display" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(products as any[]).map((product) => (
                <ProductCard key={product._id.toString()} product={product} currency={currency} />
              ))}
            </div>
            <div className="mt-12 md:hidden">
              <Link 
                href="/products" 
                className="flex items-center justify-center gap-2 bg-viva-surface text-viva-primary font-bold py-4 rounded-xl text-lg hover:bg-white hover:border-viva-primary border border-transparent transition-all"
              >
                Ver tudo <ArrowRight className="w-5 h-5 font-display" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 5 — WhatsApp CTA */}
      <section className="py-24 px-4 bg-viva-surface text-center">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex p-4 rounded-2xl bg-viva-primary/10 text-viva-primary mb-8">
            <MessageCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-viva-text">Ficou com dúvida?</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Nossa equipe responde pelo WhatsApp e ajuda você a escolher o melhor produto.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-viva-primary hover:bg-viva-primary-hover text-white font-bold px-12 py-5 rounded-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            Falar com a gente
          </a>
        </div>
      </section>
    </div>
  )
}

import { connectMongo } from '@/lib/mongodb'
import ProductModel from '@/lib/models/Product'
import '@/lib/models/Category'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  ExternalLink,
  ShoppingCart
} from 'lucide-react'
import AddToCartButton from './add-to-cart-button'
import ProductGallery from './product-gallery'
import YouTubeEmbed from '@/components/store/youtube-embed'
import ProductChat from '@/components/store/product-chat'
import ProductAnalytics from './product-analytics'
import ProductTestimonials from '@/components/store/product-testimonials'

async function getProduct(slug: string, locale: string) {
  await connectMongo()
  return ProductModel.findOne({ 
    slug: slug,
    locale: locale,
    active: true 
  })
    .populate('category', 'name slug')
    .lean()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const product = await getProduct(slug, locale)
  if (!product) return {}

  const p = product as any
  const images = p.images?.length > 0 ? [p.images[0]] : ['/images/og-image.jpg']

  return {
    title: p.metaTitle || p.name,
    description: p.metaDescription || p.description?.substring(0, 160),
    openGraph: {
      title: p.metaTitle || p.name,
      description: p.metaDescription || p.description?.substring(0, 160),
      images: images,
    },
    twitter: {
      card: 'summary_large_image',
      title: p.metaTitle || p.name,
      description: p.metaDescription || p.description?.substring(0, 160),
      images: images,
    }
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>
}) {
  const { locale, slug } = await params;
  const product = await getProduct(slug, locale)
  if (!product) notFound()

  const p = product as any
  const pName = p.name
  const catName = p.category?.label || p.category?.name || ''
  const deliveryText = p.deliveryDays 
    ? `${p.deliveryDays} dias úteis` 
    : "3 a 7 dias úteis"

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.images,
    description: p.description,
    brand: {
      '@type': 'Brand',
      name: 'Viva Leve Portal'
    },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: p.currency || 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_STORE_URL}/${locale}/products/${slug}`
    }
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-6xl mx-auto px-4 pt-0 pb-6 md:pt-1 md:py-20 lg:py-24">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-16">
          {/* Mobile Title: Visible only on mobile, placed above gallery */}
          <div className="lg:hidden mb-0">
            {catName && (
              <span className="text-viva-accent text-[10px] font-bold uppercase tracking-wider mb-0.5 inline-block">
                {catName}
              </span>
            )}
            <h1 className="text-2xl font-bold text-viva-text tracking-tight leading-tight font-display mb-0.5">
              {pName}
            </h1>
          </div>
          {/* Column Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={p.images} productName={pName} />
          </div>

          {/* Column Right: Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="hidden lg:block mb-6">
              {catName && (
                <span className="bg-viva-accent text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wider inline-block font-display">
                  {catName}
                </span>
              )}
            </div>

            <h1 className="hidden lg:block text-3xl md:text-4xl lg:text-5xl font-bold text-viva-text mb-6 tracking-tight leading-tight font-display">
              {pName}
            </h1>

            <div className="mb-4 lg:mb-8 p-5 lg:p-6 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl lg:text-5xl font-black text-viva-accent-warm">
                {formatPrice(Math.round(p.price * 100), p.currency || 'BRL')}
              </span>
            </div>

            {/* Buy Box - Priority placement on mobile */}
            <div className="mb-6 lg:mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {p.coinzz_url ? (
              <a
                href={p.coinzz_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 bg-viva-primary hover:bg-viva-primary-hover text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-viva-primary/10 text-lg hover:scale-[1.02] active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                Comprar agora
              </a>
            ) : (
              <AddToCartButton
                product={{
                  id: p._id.toString(),
                  name: pName,
                  price: p.price,
                  slug: slug,
                  image: p.images?.[0],
                }}
              />
            )}
            </div>

            {/* Delivery Alert */}
            <div className="flex items-center gap-3 text-viva-blue font-bold text-base lg:text-lg mb-6 lg:mb-8 p-3 lg:p-4 bg-viva-blue/10 rounded-xl">
              <Truck className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Entrega em {deliveryText} via Logzz</span>
            </div>

            {/* Saiba mais (Demo URL) */}
            {(p.demoUrl || p.logzzProductUrl) && (
              <div className="mb-8 lg:mb-10">
                <a 
                  href={p.demoUrl || p.logzzProductUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border-2 border-viva-accent text-viva-accent py-3 lg:py-4 rounded-lg font-bold hover:bg-viva-accent hover:text-white transition-all text-base lg:text-lg"
                >
                  Saiba mais <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-4 lg:space-y-6 pt-6 lg:pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 lg:gap-4 text-viva-text font-medium text-base lg:text-lg leading-relaxed">
                <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-viva-blue shrink-0" />
                Pague na entrega — dinheiro, cartão ou PIX
              </div>
              <div className="flex items-center gap-3 lg:gap-4 text-viva-text font-medium text-base lg:text-lg leading-relaxed">
                <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-viva-blue shrink-0" />
                Entrega nacional garantida pela Logzz
              </div>
              <div className="flex items-center gap-3 lg:gap-4 text-viva-text font-medium text-base lg:text-lg leading-relaxed">
                <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-viva-blue shrink-0" />
                Suporte humano via WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* Video Embed Section */}
        {p.videoUrl && (
          <div className="mt-12 lg:mt-24 pt-10 lg:pt-20 border-t border-gray-100 flex flex-col items-center">
            <h2 className="text-xl lg:text-2xl font-bold mb-8 lg:mb-12 text-center text-viva-text font-display">Veja este produto em ação</h2>
            <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
              <YouTubeEmbed url={p.videoUrl} title={pName} />
            </div>
          </div>
        )}

        {/* Description Section */}
        {p.description && (
          <div className="mt-12 lg:mt-24 pt-10 lg:pt-20 border-t border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-10 text-viva-text font-display">Sobre este produto</h2>
            <div className="prose prose-base lg:prose-lg prose-teal max-w-none text-gray-700 leading-relaxed antialiased whitespace-pre-wrap">
              {p.description}
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        <ProductTestimonials slug={slug} />

        {/* Bottom Buy Button CTA */}
        <div className="mt-16 flex justify-center pb-12">
          <div className="w-full max-w-xl px-4">
            {p.coinzz_url ? (
              <a
                href={p.coinzz_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-16 bg-viva-primary hover:bg-viva-primary-hover text-white font-bold rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-viva-primary/20 text-xl hover:scale-[1.02] active:scale-95 group"
              >
                <ShoppingCart className="w-7 h-7 group-hover:animate-bounce" />
                Quero comprar agora!
              </a>
            ) : (
              <AddToCartButton
                product={{
                  id: p._id.toString(),
                  name: pName,
                  price: p.price,
                  slug: slug,
                  image: p.images?.[0],
                }}
              />
            )}
            <p className="text-center text-gray-400 text-sm mt-4 font-medium italic">
              🔒 Pagamento seguro via Logzz • Receba em casa e pague na entrega
            </p>
          </div>
        </div>
      </div>
      <ProductAnalytics 
        productId={p._id.toString()} 
        productName={pName} 
        productSlug={slug} 
      />
      <ProductChat productSlug={slug} productName={pName} />
    </div>
  )
}

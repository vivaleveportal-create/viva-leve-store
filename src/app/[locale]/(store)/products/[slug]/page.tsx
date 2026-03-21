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
  ExternalLink 
} from 'lucide-react'
import AddToCartButton from './add-to-cart-button'
import ProductGallery from './product-gallery'
import YouTubeEmbed from '@/components/store/youtube-embed'

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
  const catName = p.category?.name || ''
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
      
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Column Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={p.images} productName={pName} />
          </div>

          {/* Column Right: Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6">
              {catName && (
                <span className="bg-viva-accent text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wider inline-block">
                  {catName}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-viva-text mb-6 tracking-tight leading-tight">
              {pName}
            </h1>

            <div className="mb-8 p-6 bg-viva-surface rounded-2xl flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black text-viva-text">
                {formatPrice(Math.round(p.price * 100), p.currency || 'BRL')}
              </span>
            </div>

            {/* Delivery Alert */}
            <div className="flex items-center gap-3 text-viva-green-deep font-bold text-lg mb-8 p-4 bg-viva-green-deep/10 rounded-xl">
              <Truck className="w-6 h-6" />
              <span>Entrega em {deliveryText} via Logzz</span>
            </div>

            {/* Buy Box */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AddToCartButton
                product={{
                  id: p._id.toString(),
                  name: pName,
                  price: p.price,
                  slug: slug,
                  image: p.images?.[0],
                }}
              />
            </div>

            {/* Saiba mais (Demo URL) */}
            {(p.demoUrl || p.logzzProductUrl) && (
              <div className="mb-10">
                <a 
                  href={p.demoUrl || p.logzzProductUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border-2 border-viva-accent text-viva-accent py-4 rounded-lg font-bold hover:bg-viva-accent hover:text-white transition-all text-lg"
                >
                  Saiba mais <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-6 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4 text-viva-text font-medium text-lg leading-relaxed">
                <ShieldCheck className="w-6 h-6 text-viva-teal-mid shrink-0" />
                Pagamento 100% seguro via Stripe
              </div>
              <div className="flex items-center gap-4 text-viva-text font-medium text-lg leading-relaxed">
                <Truck className="w-6 h-6 text-viva-teal-mid shrink-0" />
                Entrega nacional garantida pela Logzz
              </div>
              <div className="flex items-center gap-4 text-viva-text font-medium text-lg leading-relaxed">
                <MessageCircle className="w-6 h-6 text-viva-teal-mid shrink-0" />
                Suporte humano via WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* Video Embed Section */}
        {p.videoUrl && (
          <div className="mt-24 pt-20 border-t border-gray-100 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-12 text-center text-viva-text">Veja este produto em ação</h2>
            <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl">
              <YouTubeEmbed url={p.videoUrl} title={pName} />
            </div>
          </div>
        )}

        {/* Description Section */}
        {p.description && (
          <div className="mt-24 pt-20 border-t border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-viva-text">Sobre este produto</h2>
            <div className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed text-xl whitespace-pre-wrap">
              {p.description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

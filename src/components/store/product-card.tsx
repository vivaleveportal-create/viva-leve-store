import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    slug: string
    price: number
    images?: string[]
    category?: { name?: string; label?: string }
  }
  currency: string
}

export default function ProductCard({ product, currency }: ProductCardProps) {
  const categoryLabel = product.category?.label || product.category?.name

  return (
    <Link
      href={`/products/${product.slug}` as any}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
    >
      {/* Wrapper de Imagem */}
      <div className="relative aspect-square overflow-hidden bg-viva-surface">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}

        {/* Badge Categoria (Sobre a imagem) */}
        {categoryLabel && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-bold text-viva-primary tracking-[0.1em] uppercase bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
              {categoryLabel}
            </span>
          </div>
        )}

        {/* Botão de Ação (Hover) */}
        <div className="absolute bottom-4 right-4 z-10 w-11 h-11 rounded-full bg-viva-primary text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 shadow-lg cursor-pointer">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1 space-y-2">
        <h3 className="font-display text-base font-semibold text-viva-text line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-viva-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="pt-1">
          <span className="text-xl font-bold text-viva-accent-warm tabular-nums">
            {formatPrice(Math.round(product.price * 100), currency)}
          </span>
        </div>
      </div>
    </Link>
  )
}

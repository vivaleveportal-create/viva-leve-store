import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
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
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-viva-primary/20 hover:shadow-[0_8px_30px_-8px_rgba(0,117,110,0.12)] transition-all duration-300 overflow-hidden"
    >
      {/* Product Image */}
      <div className="aspect-[4/5] relative bg-viva-surface overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-viva-teal-mid/20">
            <ArrowRight className="w-12 h-12 -rotate-45" />
          </div>
        )}
        
        {/* Category Badge */}
        {categoryLabel && (
          <div className="absolute top-4 left-4">
            <span className="bg-viva-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              {categoryLabel}
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-viva-text line-clamp-2 group-hover:text-viva-primary transition-colors duration-200 leading-tight mb-4 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-black text-viva-text">
            {formatPrice(Math.round(product.price * 100), currency)}
          </span>
          <span className="text-sm font-semibold text-viva-primary group-hover:text-viva-accent-warm transition-colors flex items-center gap-1">
            Ver produto
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

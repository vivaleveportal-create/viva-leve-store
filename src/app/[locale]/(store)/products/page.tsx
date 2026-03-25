import { connectMongo } from '@/lib/mongodb'
import ProductModel from '@/lib/models/Product'
import CategoryModel from '@/lib/models/Category'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Truck, Search, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/store/product-card'

async function getProducts(locale: string, categoria?: string, q?: string) {
  await connectMongo()
  const query: any = { active: true, locale }

  if (categoria) {
    const cat = await CategoryModel.findOne({ 
      $or: [{ slug: categoria }, { _id: categoria.length === 24 ? categoria : null }], 
      locale 
    }).catch(() => null)
    if (cat) query.category = cat._id
  }

  if (q) {
    query.name = { $regex: q, $options: 'i' }
  }

  return ProductModel.find(query)
    .populate('category', 'name label slug')
    .sort({ featured: -1, createdAt: -1 })
    .limit(50)
    .lean()
}

async function getCategories(locale: string) {
  await connectMongo()
  return CategoryModel.find({ locale }).sort({ order: 1, label: 1 }).lean()
}

export default async function ProductsPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>
  params: Promise<{ locale: string }>
}) {
  const { categoria, q } = await searchParams
  const { locale } = await params
  
  const [products, categories] = await Promise.all([
    getProducts(locale, categoria, q),
    getCategories(locale),
  ])

  const currency = locale === 'en' ? 'USD' : 'BRL'

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-4xl font-bold text-viva-text font-display">Nossos Produtos</h1>
          <form action="/products" className="relative w-full md:w-96">
            <input 
              name="q"
              type="text"
              defaultValue={q}
              placeholder="O que você procura?"
              className="w-full h-14 pl-12 pr-4 bg-viva-surface border-2 border-transparent focus:border-viva-primary rounded-xl text-lg outline-none transition-all shadow-sm hover:shadow-md focus:shadow-md"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-viva-muted w-6 h-6" />
          </form>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <Link
            href="/products"
            className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
              !categoria
                ? 'bg-viva-primary text-white shadow-md'
                : 'bg-gray-50 text-viva-muted border border-gray-200 hover:border-viva-primary hover:text-viva-primary'
            }`}
          >
            Todos
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat._id.toString()}
              href={`/products?categoria=${cat.value}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                categoria === cat.value
                  ? 'bg-viva-primary text-white shadow-md'
                  : 'bg-gray-50 text-viva-muted border border-gray-200 hover:border-viva-primary hover:text-viva-primary'
              }`}
            >
              {cat.label || cat.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="mb-8 opacity-40">
              <Image src="/cart.png" alt="Cesta vazia" width={200} height={200} />
            </div>
            <h2 className="text-2xl font-bold text-viva-text mb-2">Nenhum produto encontrado.</h2>
            <p className="text-lg text-gray-500 mb-8">Tente ajustar seus filtros ou busca.</p>
            <Link 
              href="/products" 
              className="bg-viva-primary text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {(products as any[]).map((product) => (
              <ProductCard key={product._id.toString()} product={product} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { connectMongo } from '@/lib/mongodb'
import ProductModel from '@/lib/models/Product'
import CategoryModel from '@/lib/models/Category'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Truck, Search, ArrowRight, Check } from 'lucide-react' // Added Check icon

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
    .populate('category', 'name slug')
    .sort({ featured: -1, createdAt: -1 })
    .limit(12)
    .lean()
}

async function getCategories(locale: string) {
  await connectMongo()
  return CategoryModel.find({ locale }).sort({ name: 1 }).lean()
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
          <h1 className="text-4xl font-bold text-viva-text font-serif">Nossos Produtos</h1>
          <form action="/products" className="relative w-full md:w-96">
            <input 
              name="q"
              type="text"
              defaultValue={q}
              placeholder="O que você procura?"
              className="w-full h-14 pl-12 pr-4 bg-viva-surface border-2 border-transparent focus:border-viva-primary rounded-xl text-lg outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-viva-teal-mid w-6 h-6" />
          </form>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <Link
            href="/products"
            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-lg transition-all ${
              !categoria
                ? 'bg-viva-primary text-white shadow-lg'
                : 'bg-viva-surface text-viva-teal-dark hover:bg-viva-teal-light/10'
            }`}
          >
            Todos
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat._id.toString()}
              href={`/products?categoria=${cat.slug}`}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-lg transition-all ${
                categoria === cat.slug
                  ? 'bg-viva-primary text-white shadow-lg'
                  : 'bg-viva-surface text-viva-teal-dark hover:bg-viva-teal-light/10'
              }`}
            >
              {cat.name}
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
              <Link
                key={product._id.toString()}
                href={`/products/${product.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-viva-primary/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="aspect-square relative bg-viva-surface overflow-hidden rounded-t-2xl">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-viva-teal-mid/20">
                      <Truck className="w-16 h-16" />
                    </div>
                  )}
                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-viva-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-viva-text mb-4 line-clamp-2 leading-tight group-hover:text-viva-primary transition-colors min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-viva-green-deep font-bold text-sm mb-4">
                      <div className="w-2 h-2 rounded-full bg-viva-green-deep animate-pulse" />
                      Entrega via Logzz
                    </div>

                    <div className="flex flex-col gap-4">
                      <span className="text-2xl font-black text-viva-text">
                        {formatPrice(Math.round(product.price * 100), currency)}
                      </span>
                      <span className="w-full flex items-center justify-center gap-2 bg-viva-surface group-hover:bg-viva-primary text-viva-primary group-hover:text-white border-2 border-viva-primary py-3 rounded-xl font-bold transition-all">
                        Ver produto
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

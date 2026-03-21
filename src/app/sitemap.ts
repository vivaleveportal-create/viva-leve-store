import { MetadataRoute } from 'next'
import { connectMongo } from '@/lib/mongodb'
import ProductModel from '@/lib/models/Product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3000'

  // Fetch all active products
  await connectMongo()
  const products = await ProductModel.find({ active: true }).select('slug locale updatedAt').lean()

  const productUrls = products.map((p: any) => ({
    url: `${baseUrl}/${p.locale}/products/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticUrls = ['pt', 'en'].flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${lang}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ])

  return [...staticUrls, ...productUrls]
}

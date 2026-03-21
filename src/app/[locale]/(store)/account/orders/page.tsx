import { cookies } from 'next/headers'
import { verifyUserToken } from '@/lib/user-auth'
import { connectMongo } from '@/lib/mongodb'
import OrderModel from '@/lib/models/Order'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { Download, Package } from 'lucide-react'

async function getUserOrders(userId: string) {
  await connectMongo()
  return OrderModel.find({ user: userId, status: 'paid' })
    .populate({
      path: 'products',
      select: 'name price slug',
    })
    .sort({ createdAt: -1 })
    .lean()
}

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')?.value

  if (!token) redirect('/sign-in?redirect=/account/orders')

  const payload = verifyUserToken(token)
  if (!payload) redirect('/sign-in?redirect=/account/orders')

  const orders = await getUserOrders(payload.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum pedido ainda</p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-viva-primary hover:bg-viva-primary-hover text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-viva-primary/10 text-lg hover:scale-105"
            >
              Começar a cuidar de você
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
          {(orders as unknown as Array<{
            _id: { toString(): string }
            total: number
            createdAt: Date
            products: Array<{
              _id: { toString(): string }
              name: string
              price: number
              digitalFile?: { _id: { toString(): string }; name: string }
            }>
          }>).map((order) => (
            <div
              key={order._id.toString()}
              className="bg-white border rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    Pedido #{order._id.toString().slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                </div>
                <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
              </div>
              <div className="divide-y">
                {order.products.map((product) => (
                  <div
                    key={product._id.toString()}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(Math.round(product.price * 100))}
                      </p>
                    </div>
                    {/* No download link for physical products */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

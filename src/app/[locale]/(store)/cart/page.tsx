'use client'

import { useCartStore } from '@/lib/stores/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const router = useRouter()

  async function handleCheckout() {
    if (!customerName.trim() || !phone.trim()) {
      toast.error('Por favor, preencha seu nome e WhatsApp para continuarmos.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productIds: items.map((i) => i.id),
          customerName,
          phone
        }),
      })

      if (res.status === 401) {
        router.push('/sign-in?redirect=/cart')
        return
      }

      const data = await res.json()
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Erro ao criar sessão de pagamento')
      }
    } catch {
      toast.error('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center bg-viva-surface min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingCart className="w-20 h-20 text-viva-teal-mid/30 mb-8" />
        <h1 className="text-3xl font-bold text-viva-text mb-4 font-serif">Seu carrinho está vazio</h1>
        <p className="text-xl text-gray-500 mb-10 leading-relaxed">Adicione produtos para continuar suas compras e cuidar de você.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-3 bg-viva-primary hover:bg-viva-primary-hover text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-viva-primary/10 text-xl hover:scale-105"
        >
          Ver produtos <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl font-black text-viva-text mb-12 tracking-tight font-serif">Minha Cestinha</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-24 h-24 bg-viva-surface rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-2" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-viva-teal-mid/20">
                  <ShoppingBag className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-viva-text mb-1 truncate">{item.name}</h3>
              <p className="text-2xl font-black text-viva-primary">
                {formatPrice(Math.round(item.price * 100))}
              </p>
            </div>
            <button
              onClick={() => {
                removeItem(item.id)
                toast.info('Item removido')
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-full hover:bg-red-50"
              aria-label="Remover item"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-viva-text mb-6 font-serif">Informações de Contato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-viva-text/70 ml-1">
              Seu Nome Completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ex: Maria Oliveira"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-viva-surface border-2 border-transparent focus:border-viva-primary focus:bg-white outline-none transition-all text-viva-text font-medium"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-bold text-viva-text/70 ml-1">
              WhatsApp (com DDD)
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Ex: 21 98888-7777"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-viva-surface border-2 border-transparent focus:border-viva-primary focus:bg-white outline-none transition-all text-viva-text font-medium"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-viva-surface border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-viva-teal-mid/5">
        <div className="flex justify-between items-center text-2xl font-black text-viva-text mb-10 pb-8 border-b border-gray-200/50">
          <span>Total</span>
          <span className="text-4xl text-viva-primary">{formatPrice(Math.round(total() * 100))}</span>
        </div>
        <button
          id="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-16 bg-viva-primary hover:bg-viva-primary-hover text-white font-black rounded-2xl transition-all disabled:opacity-60 shadow-xl shadow-viva-primary/10 text-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finalizar minha compra'}
        </button>
        <p className="text-lg text-center text-gray-500 mt-8 leading-relaxed">
          O próximo passo será informar seu endereço <br className="hidden md:block" /> e escolher a forma de pagamento de forma segura.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useCartStore } from '@/lib/stores/cart'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  slug: string
  image?: string
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCartStore()
  const inCart = items.some((i) => i.id === product.id)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: product.image,
    })
    setAdded(true)
    toast.success(`${product.name} adicionado ao carrinho`)
    setTimeout(() => setAdded(false), 2000)
  }

  if (inCart || added) {
    return (
      <div className="w-full h-14 bg-viva-accent/10 border border-viva-accent/30 text-viva-green-deep font-semibold rounded-lg flex items-center justify-center gap-2">
        <Check className="w-6 h-6" />
        No carrinho
      </div>
    )
  }

  return (
    <button
      id="add-to-cart-btn"
      onClick={handleAdd}
      className="w-full h-14 bg-viva-primary hover:bg-viva-primary-hover text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-viva-primary/10 text-lg hover:scale-[1.02] active:scale-95"
    >
      <ShoppingCart className="w-6 h-6" />
      Adicionar ao carrinho
    </button>
  )
}

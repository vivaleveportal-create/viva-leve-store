import { CheckCircle, ArrowRight, Truck } from 'lucide-react'
import Link from 'next/link'
import PurchaseAnalytics from './purchase-analytics'

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-viva-surface">
      <PurchaseAnalytics orderId={searchParams.orderId} />
      <div className="text-center max-w-lg bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-viva-teal-mid/5 border border-viva-surface">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-viva-accent/10 rounded-full mb-8">
          <CheckCircle className="w-12 h-12 text-viva-accent" />
        </div>
        <h1 className="text-4xl font-black text-viva-text mb-6 tracking-tight leading-tight font-serif">
          Tudo certo! <br/> Sua compra foi confirmada.
        </h1>
        <p className="text-xl text-gray-700 mb-4 leading-relaxed">
          Obrigado por confiar no <strong>Viva Leve Portal</strong>. <br/> Estamos cuidando de tudo com muito carinho para você.
        </p>
        
        <div className="bg-viva-surface rounded-2xl p-6 mb-10 flex items-start gap-4 text-left border border-gray-100">
          <Truck className="w-8 h-8 text-viva-primary shrink-0 mt-1" />
          <p className="text-lg text-viva-text leading-snug">
            Em breve, você receberá um link de rastreio direto da <strong>Logzz</strong> no seu e-mail para acompanhar a entrega até a sua porta.
          </p>
        </div>

        {searchParams.orderId && (
          <p className="text-lg text-viva-teal-dark mb-10 font-bold bg-viva-surface py-2 px-6 rounded-full inline-block border border-gray-100">
            Nº do Pedido: #{searchParams.orderId.slice(-6).toUpperCase()}
          </p>
        )}
        
        <div className="flex flex-col gap-4">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-3 bg-viva-primary hover:bg-viva-primary-hover text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-viva-primary/10 text-xl hover:scale-[1.02]"
          >
            Ver meus pedidos <ArrowRight className="w-6 h-6" />
          </Link>
          
          <a
            href="https://wa.me/5521982266075"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-green-50 text-[#25D366] border-2 border-[#25D366] font-black px-8 py-4 rounded-2xl transition-all text-lg hover:scale-[1.02]"
          >
            Alguma dúvida sobre seu pedido? <br className="md:hidden" /> Chame no WhatsApp 💬
          </a>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-3 text-gray-600 hover:text-gray-900 font-bold px-10 py-4 transition-colors text-lg"
          >
            Continuar navegando
          </Link>
        </div>
      </div>
    </div>
  )
}

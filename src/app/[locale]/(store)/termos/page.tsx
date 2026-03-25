import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Confira nossos termos e condições gerais para compras no Viva Leve Portal.',
}

export default function TermsPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://vivaleveportal.com.br'

  return (
    <div className="bg-white py-16 md:py-24 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-viva-text mb-12">
          Termos de Uso e Condições Gerais
        </h1>
        
        <div className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed font-body">
          <p className="font-bold underline mb-8">Última atualização: 25 de Março de 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">1. Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao acessar o site <strong>{storeName}</strong> ({storeUrl}), você concorda com estes Termos de Uso e todas as leis aplicáveis. Se você não concorda com qualquer um desses termos, não use nosso serviço.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">2. Processo de Compra e Pagamento</h2>
            <p className="mb-4">
              Nossa plataforma utiliza o provedor <strong>Stripe</strong> para processamento de pagamentos on-line. Seus dados financeiros são criptografados e não ficam arquivados em nosso servidor. Aceitamos cartões de crédito, Pix e boleto.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">3. Logística e Entrega (Logzz)</h2>
            <p className="mb-4">
              Como operamos com parceiros logísticos através da rede <strong>Logzz</strong>, a entrega é feita em todo o território nacional. Oferecemos a opção de <strong>Cash on Delivery (Envio com Pagamento na Entrega)</strong> em diversas regiões, conforme disponibilidade informada no checkout.
            </p>
            <p className="mb-4">
              O prazo médio de entrega varia de 3 a 10 dias úteis após a confirmação do pedido, conforme as especificações de cada produto.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">4. Política de Trocas e Devoluções</h2>
            <p className="mb-4">
              Seguimos as leis de direito do consumidor vigentes no Brasil, incluindo o direito de arrependimento de 7 dias úteis para pedidos on-line. Produtos devem estar com embalagem original e sem sinais de uso para a devolução do valor integral.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">5. Responsabilidades</h2>
            <p className="mb-4">
              Lembre-se de sempre consultar seu médico ou especialista antes do uso de massageadores, aparelhos de saúde ou qualquer item que impacte sua condição clínica. O <strong>{storeName}</strong> não se responsabiliza pelo uso inadequado dos itens vendidos.
            </p>
          </section>

          <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-8 justify-between items-center text-sm text-gray-500 italic">
            <p>© 2026 {storeName}. Direitos reservados.</p>
            <p>Gerido por Portal Viva Leve Store (Logzz Partners)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TermsPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'

  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-viva-text mb-8">
          Termos de Uso
        </h1>
        
        <div className="prose prose-lg text-viva-muted max-w-none space-y-8 leading-relaxed font-body">
          <p className="font-bold border-b border-gray-100 pb-4 mb-10">Última atualização: 25 de Março de 2026</p>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">1. Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao acessar o site <strong>{storeName}</strong>, você concorda com estes Termos de Uso e todas as leis aplicáveis. Se você não concorda com qualquer um desses termos, não use nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">2. Pagamento e Segurança</h2>
            <p className="mb-4">
              Nossa plataforma utiliza o provedor <strong>Stripe</strong> para processamento de pagamentos on-line. Seus dados financeiros são criptografados e não ficam arquivados em nosso servidor. Aceitamos cartões de crédito, Pix e boleto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">3. Logística e Entrega (Logzz)</h2>
            <p className="mb-4">
              As entregas são realizadas via rede **Logzz** em todo o território nacional. Oferecemos a modalidade **Cash on Delivery (Pagamento na Entrega)** em diversas regiões atendidas, conforme informações no checkout.
            </p>
            <p className="mb-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
              O prazo médio de entrega é de 3 a 7 dias úteis após a confirmação do pedido.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">4. Política de Trocas e Devoluções</h2>
            <p className="mb-4">
              Seguimos as leis de direito do consumidor vigentes no Brasil, incluindo o direito de arrependimento em até 7 dias úteis. Produtos devem estar com embalagem original e sem sinais de uso para a devolução total do valor.
            </p>
          </section>

          <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col items-center justify-between text-xs text-viva-muted">
            <p>© 2026 {storeName}. Gerido por Portal Viva Leve Store (Logzz Partners)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

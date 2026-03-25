export default function PrivacyPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'

  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-viva-text mb-8 text-center md:text-left">
          Política de Privacidade (LGPD)
        </h1>
        
        <div className="prose prose-lg text-viva-muted max-w-none text-gray-700 leading-relaxed space-y-8 font-body">
          <p className="font-bold border-b border-gray-100 pb-4 mb-10 text-xl font-display text-viva-primary underline decoration-viva-accent decoration-4">Última atualização: 25 de Março de 2026</p>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">1. Transparência de Dados</h2>
            <p className="mb-4">
              Sua privacidade no <strong>{storeName}</strong> é prioridade absoluta. Atuamos em plena conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, assegurando que seus dados pessoais sejam utilizados única e exclusivamente para finalidades de compra, entrega e suporte humano personalizado.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">2. Coleta Responsável</h2>
            <p className="mb-4">
              Para processar seu pedido via Logzz e Stripe, coletamos informacões como: Nome completo, CPF, E-mail, Telefone/WhatsApp e Endereço de Entrega. Nunca armazenamos dados de cartões de crédito em nossos servidores; todos os dados sensíveis são processados diretamente pela infraestrutura segura da Stripe.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">3. Comunicação via WhatsApp</h2>
            <p className="mb-4">
              Utilizamos seu número de WhatsApp para informar o status do seu pedido através de nossos parceiros de automação logística e para suporte humano direto de nossa equipe, conforme sua autorização no ato da compra. Em nenhum momento compartilhamos sua lista de contatos para fins comerciais externos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">4. Direitos do Titular</h2>
            <p className="mb-4">
              De acordo com a LGPD, você tem o direito de acessar seus dados, solicitar a correção de dados incompletos ou inexatos, e requerer a exclusão total dos seus dados de nossa base a qualquer momento (salvo obrigações legais de manutenção de registros fiscais).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">5. Segurança Cibernética</h2>
            <p className="mb-4">
              Utilizamos certificados SSL em todo o portal e protocolos de criptografia de ponta a ponta para proteger as informações que você nos envia. Nosso banco de dados é monitorado 24 horas por dia para evitar acessos não autorizados.
            </p>
          </section>

          <div className="mt-20 pt-8 border-t border-gray-100 text-sm text-gray-500 italic flex justify-center">
            <p>Para dúvidas sobre privacidade, envie um e-mail para privacidade@vivaleveportal.com.br.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

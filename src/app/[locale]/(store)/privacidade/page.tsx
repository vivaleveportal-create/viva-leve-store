import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Saiba como o Viva Leve Portal protege seus dados de acordo com a LGPD.',
}

export default function PrivacyPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'

  return (
    <div className="bg-white py-16 md:py-24 px-4 min-h-screen font-body">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-viva-text mb-12">
          Política de Privacidade (LGPD)
        </h1>
        
        <div className="prose prose-lg prose-teal max-w-none text-gray-700 leading-relaxed">
          <p className="font-bold underline mb-10">Última atualização: 25 de Março de 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">1. Transparência de Dados</h2>
            <p className="mb-4">
              A privacidade dos nossos clientes no <strong>{storeName}</strong> é prioridade absoluta. Atuamos em plena conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, assegurando que seus dados pessoais sejam utilizados única e exclusivamente para finalidades de compra, entrega e suporte.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">2. Quais dados coletamos?</h2>
            <p className="mb-4">
              Para processar seu pedido via Logzz e Stripe, coletamos informacões como: Nome completo, CPF, E-mail, Telefone/WhatsApp e Endereço de Entrega. Nunca armazenamos dados de cartões de crédito em nossos servidores; tais dados são transacionados diretamente pela infraestrutura da Stripe.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">3. Uso do WhatsApp</h2>
            <p className="mb-4">
              Utilizamos seu número de WhatsApp para informar o status do seu pedido via parceiros de automação e para suporte humano direto de nossa equipe, conforme sua autorização no checkout. Em nenhum momento compartilhamos sua lista de contatos para fins comerciais.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">4. Seus Direitos</h2>
            <p className="mb-4">
              De acordo com a LGPD, você tem o direito de:
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Acessar seus dados pessoais sob nosso cuidado;</li>
                <li>Solicitar a correção de dados incompletos ou inexatos;</li>
                <li>Requerer a exclusão total dos seus dados de nossa base (salvo os dados mantidos por obrigações legais);</li>
                <li>Revogar seu consentimento para o processamento a qualquer momento.</li>
              </ul>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-6">5. Segurança da Informação</h2>
            <p className="mb-4">
              Utilizamos certificados SSL em todo o site e protocolos de criptografia de ponta a ponta para proteger as informações que você nos envia. Nosso banco de dados é monitorado 24 horas para evitar acessos não autorizados.
            </p>
          </section>

          <div className="mt-20 pt-8 border-t border-gray-100 text-sm text-gray-500 italic">
            <p>Para dúvidas sobre privacidade, envie um e-mail para privacidade@vivaleveportal.com.br.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

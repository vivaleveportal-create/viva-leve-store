import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fale Conosco | Viva Leve Portal',
  description: 'Tem dúvidas ou sugestões? Nossa equipe está pronta para ajudar você.',
}

export default function ContatoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 bg-white">
      <h1 className="text-5xl font-black text-viva-text mb-10 tracking-tight font-serif">Estamos aqui para ouvir você</h1>
      
      <div className="prose prose-teal lg:prose-xl max-w-none text-gray-700 space-y-8 leading-relaxed">
        <p className="text-xl text-gray-600">
          Seu bem-estar é a nossa prioridade. Se você tiver qualquer dúvida sobre um produto, precisar de ajuda com a sua entrega ou simplesmente quiser dar uma sugestão, saiba que estamos de braços abertos para conversar.
        </p>

        <section>
          <h2 className="text-3xl font-bold text-viva-text mt-12 mb-6 font-serif">Como entrar em contato</h2>
          <p className="text-xl text-gray-600">
            A forma mais simples de falar conosco é através do nosso e-mail oficial. Respondemos com todo o carinho em até 48 horas úteis.
            <br /><br />
            <strong>E-mail: suporte@vivaleveportal.com.br</strong>
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-viva-text mt-12 mb-6 font-serif">Acompanhamento de Pedidos</h2>
          <p className="text-xl text-gray-600">
            Se você já fez uma compra e quer saber onde está o seu pacote, lembre-se que você recebeu um link de rastreio direto da <strong>Logzz</strong> no seu e-mail. Caso não encontre, nossa equipe pode localizar para você rapidinho.
          </p>
        </section>

        <section className="bg-viva-surface p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-bold text-viva-teal-dark mb-4">Dica importante</h2>
          <p className="text-viva-text text-lg">
            Para que possamos ajudar você mais rápido, lembre-se de informar o número do seu pedido ou o e-mail que você usou na hora da compra.
          </p>
        </section>
      </div>
    </div>
  )
}

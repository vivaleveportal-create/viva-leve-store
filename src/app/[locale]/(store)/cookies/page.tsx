import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Saiba como utilizamos os cookies para melhorar sua experiência no Viva Leve Portal.',
}

export default function CookiesPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'

  return (
    <div className="bg-white py-16 md:py-24 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-viva-text mb-12">
          Política de Cookies
        </h1>
        
        <div className="prose prose-lg text-gray-700 max-w-none space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-4">O que são Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto salvos no seu navegador para "lembrar" certas informações sobre você durante a navegação. Eles são essenciais para o funcionamento básico de qualquer e-commerce moderno.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-4">Como o {storeName} usa Cookies?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essenciais:</strong> Para manter os itens no seu carrinho de compras e sua sessão de login ativa.</li>
              <li><strong>Analíticos:</strong> Para entender quais produtos são mais visitados e melhorar nossa curadoria.</li>
              <li><strong>Funcionais:</strong> Para lembrar suas preferências, como idioma do site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-4">Como recusar ou limpar Cookies?</h2>
            <p>
              Você pode, a qualquer momento, limpar o cache do seu navegador ou desativar o uso de cookies nas configurações de privacidade. Lembre-se que, ao desativar cookies essenciais, o processo de finalização de compra pode não funcionar corretamente.
            </p>
          </section>

          <section className="bg-viva-blue/5 p-8 rounded-2xl border border-viva-blue/10 text-gray-600 italic">
            <p>
              A transparência é o nosso propósito. Continuar navegando no {storeName} implica que você aceita o uso desses recursos para uma melhor experiência de compra.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function CookiesPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Viva Leve Portal'

  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-viva-text mb-8">
          Política de Cookies
        </h1>
        
        <div className="prose prose-lg text-viva-muted max-w-none space-y-8 leading-relaxed font-body">
          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">O que são Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto salvos no seu navegador para "lembrar" certas informações sobre você durante a navegação. Eles são essenciais para o funcionamento básico de qualquer e-commerce moderno.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">Como o {storeName} usa Cookies?</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Essenciais:</strong> Para manter os itens no seu carrinho de compras e sua sessão de login ativa.</li>
              <li><strong>Analíticos:</strong> Para entender quais produtos são mais visitados e melhorar nossa curadoria.</li>
              <li><strong>Funcionais:</strong> Para lembrar suas preferências, como idioma do site e escolhas de navegação.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-viva-primary mb-4">Como recusar ou limpar Cookies?</h2>
            <p>
              Você pode, a qualquer momento, limpar o cache do seu navegador ou desativar o uso de cookies nas configurações de privacidade. Lembre-se que, ao desativar cookies essenciais, o processo de finalização de compra pode não funcionar corretamente.
            </p>
          </section>

          <section className="bg-viva-blue/5 p-8 rounded-2xl border border-viva-blue/10 text-viva-muted italic text-center text-sm">
            <p className="max-w-xl mx-auto">
              A transparência é o nosso propósito. Continuar navegando no {storeName} implica que você aceita o uso desses recursos para uma melhor experiência de compra.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

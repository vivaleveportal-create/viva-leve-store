import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quem Somos',
  description: 'Conheça o Viva Leve Portal e nossa missão de tornar a vida mais simples e saudável.',
}

export default function AboutPage() {
  return (
    <div className="bg-white py-16 md:py-24 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-viva-text mb-12">
          Quem Somos
        </h1>
        
        <div className="prose prose-lg text-gray-600 max-w-none space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-4">Nossa Missão</h2>
            <p>
              O <strong>Viva Leve Portal</strong> nasceu com o propósito de levar as melhores soluções em saúde, bem-estar e praticidade para o seu lar. Acreditamos que <strong>viver bem não precisa ser complicado</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-4">Por que existimos</h2>
            <p>
              Nossa equipe faz uma curadoria rigorosa de produtos físicos — desde massageadores ergonômicos até robôs inteligentes que cuidam da sua casa. Focamos em itens que geram impacto real na qualidade de vida de quem busca conforto e longevidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-viva-primary mb-4">Nossos Valores</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Transparência:</strong> Informações claras em cada etapa da sua compra.</li>
              <li><strong>Qualidade:</strong> Produtos testados e com garantia de entrega nacional.</li>
              <li><strong>Acolhimento:</strong> Atendimento próximo e humano para resolver qualquer dúvida.</li>
              <li><strong>Inovação:</strong> O que há de melhor no mercado de tecnologia para saúde.</li>
            </ul>
          </section>

          <section className="bg-viva-surface p-8 rounded-2xl border border-viva-primary/10">
            <h2 className="text-2xl font-bold font-display text-viva-text mb-4 underline decoration-viva-accent decoration-4">Viva Leve</h2>
            <p>
              Estamos aqui para ser o seu portal de confiança. Seja bem-vindo à nossa casa.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

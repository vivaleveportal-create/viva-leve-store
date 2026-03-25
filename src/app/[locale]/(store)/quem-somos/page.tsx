import { Link } from '@/i18n/routing'

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-viva-text mb-8">
          Quem Somos
        </h1>
        
        <div className="prose prose-lg text-viva-muted max-w-none space-y-6 leading-relaxed">
          <p>
            O <strong>Viva Leve Portal</strong> é uma curadoria especializada em facilitar a vida de quem busca bem-estar, saúde e praticidade no ambiente doméstico.
          </p>
          <p>
            Nascemos com a missão de que <strong>viver bem não precisa ser complicado</strong>. Por isso, selecionamos apenas produtos que realmente agregam valor ao seu dia a dia, desde tecnologia para relaxamento até utilidades que economizam seu tempo.
          </p>
          <p>
            Operamos com transparência total: nossas entregas são garantidas pela rede <strong>Logzz</strong> e todos os pagamentos são processados com segurança máxima via <strong>Stripe</strong>.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
            <Link href="/products" className="bg-viva-primary text-white px-10 py-5 rounded-full font-bold shadow-xl hover:brightness-110 transition-all">
              Conhecer Produtos
            </Link>
            <Link href="/contato" className="text-viva-primary font-bold hover:underline">
              Fale com nossa equipe
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

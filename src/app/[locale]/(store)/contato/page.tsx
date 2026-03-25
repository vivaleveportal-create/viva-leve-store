import { MessageCircle, Mail } from 'lucide-react'

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || ''
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}` : '#'

  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-viva-text mb-8">
          Fale Conosco
        </h1>
        
        <p className="text-xl text-viva-muted mb-12 leading-relaxed">
          Nossa equipe de suporte está à sua disposição. Respondemos de forma próxima e humana, sem robôs, de segunda a sexta, das 9h às 18h.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-8 bg-viva-primary/5 border border-viva-primary/10 rounded-2xl hover:bg-viva-primary hover:text-white transition-all group"
          >
            <MessageCircle className="w-12 h-12 text-viva-primary group-hover:text-white mb-6" />
            <h3 className="font-display text-xl font-bold mb-2">WhatsApp</h3>
            <p className="text-sm opacity-80 mb-6">Atendimento rápido e personalizado para suas dúvidas.</p>
            <span className="text-sm font-bold mt-auto underline">Chamar Agora →</span>
          </a>

          <div className="flex flex-col p-8 bg-gray-50 border border-gray-100 rounded-2xl">
            <Mail className="w-12 h-12 text-viva-primary mb-6" />
            <h3 className="font-display text-xl font-bold mb-2">E-mail</h3>
            <p className="text-viva-muted text-sm mb-6">Envie suas sugestões, feedbacks ou parcerias por e-mail.</p>
            <a href="mailto:contato@vivaleveportal.com.br" className="text-viva-primary hover:text-viva-primary-hover font-bold mt-auto leading-relaxed">
              contato@vivaleveportal.com.br
            </a>
          </div>
        </div>

        <div className="bg-[#f5f5f0] p-8 rounded-2xl border border-gray-100 flex items-center justify-between text-sm text-viva-muted">
           <p><strong>Atenção:</strong> Sábado e Domingo atendemos conforme disponibilidade de escala reduzida.</p>
        </div>
      </div>
    </div>
  )
}

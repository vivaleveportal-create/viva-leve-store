import { Metadata } from 'next'
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com nossa equipe de atendimento no WhatsApp ou por e-mail.',
}

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || ''
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}` : '#'

  return (
    <div className="bg-white py-16 md:py-24 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-viva-text mb-12">
          Fale Conosco
        </h1>
        
        <p className="text-xl text-gray-500 mb-12 leading-relaxed">
          Nossa equipe de suporte está pronta para te atender. Respondemos em até 24 horas úteis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-8 bg-viva-primary/5 border border-viva-primary/10 rounded-2xl hover:bg-viva-primary hover:text-white transition-all group"
          >
            <div className="w-12 h-12 bg-viva-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">WhatsApp</h3>
            <p className="text-sm opacity-80 mb-4 font-medium">Atendimento rápido e humano para tirar dúvidas.</p>
            <span className="text-sm font-bold mt-auto underline group-hover:no-underline">Chamar Agora →</span>
          </a>

          <div className="flex flex-col p-8 bg-viva-surface border border-gray-100 rounded-2xl">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-viva-text" />
            </div>
            <h3 className="text-xl font-bold font-display text-viva-text mb-2">E-mail</h3>
            <p className="text-gray-500 text-sm mb-4">Envie sua dúvida, sugestão ou feedback por e-mail.</p>
            <a href="mailto:suporte@vivaleveportal.com.br" className="text-viva-primary font-bold mt-auto hover:text-viva-accent-warm transition-colors">
              suporte@vivaleveportal.com.br
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t pt-12 text-gray-600">
          <div className="flex gap-4">
            <Clock className="w-6 h-6 text-viva-primary shrink-0" />
            <div>
              <h4 className="font-bold text-viva-text mb-2">Horário de Atendimento</h4>
              <p className="text-sm">Segunda a Sexta: 09:00 às 18:00</p>
              <p className="text-sm">Sábado: 09:00 às 13:00</p>
            </div>
          </div>
          <div className="flex gap-4 cursor-default">
            <MapPin className="w-6 h-6 text-viva-primary shrink-0" />
            <div>
              <h4 className="font-bold text-viva-text mb-2">Sede Digital</h4>
              <p className="text-sm italic">Entregas nacionais garantidas via parceiros logísticos Logzz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

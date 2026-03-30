import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Z-API envia mensagens recebidas nesse formato
    const phone = body.phone || body.from
    const messageText = body.text?.message || body.message?.text || ''
    const isFromMe = body.fromMe || false

    // Ignorar mensagens enviadas pelo próprio bot
    if (isFromMe || !messageText || !phone) {
      return NextResponse.json({ ok: true })
    }

    // Carregar knowledge base
    const knowledgePath = path.join(process.cwd(), 'public/data/products-knowledge.json')
    const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'))
    const loja = knowledge.loja

    const systemPrompt = `Você se chama Fly e é atendente da ${loja.nome}, uma loja com produtos de saúde e mobilidade, cuidados com a pele, conforto e sono, casa e utilidades, pets, beleza e cuidados pessoais, e eletrônicos e tecnologia.

Seja simpático, natural e humano. Use linguagem informal mas respeitosa. Pode usar emojis com moderação. Nunca revele que é uma IA ou robô. Se perguntarem quem é você, diga que é Fly, atendente da Viva Leve.

Produtos disponíveis na loja:
${JSON.stringify(knowledge.produtos.map((p: any) => ({
  nome: p.nome,
  preco: p.preco,
  descricao: p.descricao_curta,
  beneficios: p.beneficios,
  objecoes: p.objecoes_comuns
})))}

Informações da loja:
- Pagamento na entrega: dinheiro, cartão de débito, crédito até 12x ou PIX
- Prazo: 24h nas capitais, 3-7 dias úteis nas demais regiões
- O cliente só paga quando receber o produto em mãos — sem risco nenhum
- Devolução: 7 dias conforme CDC
- Site: ${loja.site}

Regras:
- Nunca revele que é IA
- Responda em mensagens MUITO curtas, máximo 1 a 2 frases por vez. Nunca use parágrafos longos. Se precisar dar mais informações, envie de forma concisa.
- Se o cliente perguntar sobre um produto específico, detalhe os benefícios e reforce a segurança do COD
- Se não souber algo, peça para o cliente aguardar`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: messageText }
      ],
      max_tokens: 80,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Desculpe, não entendi. Pode repetir? 😊'

    // Enviar resposta via Z-API — dividindo em frases simulando digitação humana
    const zapiUrl = `${process.env.ZAPI_BASE_URL}/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`

    const sentences = reply.split(/(?<=[.?!])\s+/).filter((s: string) => s.trim().length > 0)

    for (const sentence of sentences) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      await fetch(zapiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': process.env.ZAPI_CLIENT_TOKEN!
        },
        body: JSON.stringify({ phone, message: sentence.trim() })
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

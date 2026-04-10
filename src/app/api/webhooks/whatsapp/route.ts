import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'
import { connectMongo } from '@/lib/mongodb'
import ChatHistory from '@/lib/models/ChatHistory'
import Lead from '@/lib/models/Lead'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const processedMessages = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log(JSON.stringify(body))

    const messageId = body.messageId
    if (messageId && processedMessages.has(messageId)) {
      return NextResponse.json({ ok: true })
    }
    if (messageId) {
      processedMessages.add(messageId)
    }

    // Z-API envia mensagens recebidas nesse formato
    const phone = body.phone || body.from
    const messageText = body.text?.message || body.message?.text || ''
    const isFromMe = body.fromMe || false

    // Ignorar mensagens enviadas pelo próprio bot
    if (isFromMe || !messageText || !phone) {
      return NextResponse.json({ ok: true })
    }

    await connectMongo()

    // Carregar Histórico Recente (WhatsApp: Últimas 10 mensagens)
    const existingHistory = await ChatHistory.findOne({ 
      channel: 'whatsapp', 
      identifier: phone 
    })

    const recentMessages = existingHistory?.messages?.slice(-10) || []
    
    // Converter para o formato do Groq
    const groqHistory = recentMessages.map((m: any) => ({
      role: m.role,
      content: m.content
    }))

    // Carregar knowledge base
    const knowledgePath = path.join(process.cwd(), 'public/data/products-knowledge.json')
    const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'))
    const loja = knowledge.loja
    const systemPrompt = `Você se chama Flaiane (apelido Fly) e é atendente da ${loja.nome}.
    
    Regras de Ouro de Comportamento:
    - RITMO E ESTILO: Espelhe o ritmo do cliente. Se ele enviar uma palavra ou frase curta, responda de forma igualmente curta e direta. Se ele for mais detalhista, você pode ser também. Não force engajamento com perguntas desnecessárias no final de todas as mensagens.
    - EMOJIS: Use no máximo 1 emoji por mensagem, e apenas quando for natural e relevante. Nunca use só para parecer simpática. Mensagens sem emoji são totalmente aceitáveis.
    - NATURALIDADE: Soe como uma humana, não como um robô animado. Evite excesso de exclamações (!), entusiasmo forçado ou repetir o nome do cliente em toda resposta. Exemplo: Se o cliente perguntar se funciona em tapete, diga "Funciona bem em pisos lisos e tapetes finos. Em tapetes felpudos não é o ideal. Sua casa tem qual tipo?" em vez de "Oi Samara! 🤗 Tudo bem? Então...".
    
    Produtos disponíveis na loja:
    ${JSON.stringify(knowledge.produtos.map((p: any) => ({
      nome: p.nome,
      preco: p.preco,
      descricao: p.descricao_curta,
      especificacoes: p.especificacoes_tecnicas
    })))}
    
    Informações da loja:
    - Pagamento na entrega: dinheiro, cartão de crédito/débito ou PIX. O cliente só paga quando receber.
    - Prazo: 24h nas capitais, 3-7 dias úteis nas demais regiões.
    - Site: ${loja.site}
    
    Regras Específicas:
    - Nunca use o emoji 🤖.
    - Nunca confirme ser IA se não perguntarem diretamente. Se perguntarem, diga: "Sou a Flaiane, atendente da Viva Leve 😊 Posso te ajudar com dúvidas sobre nossos produtos!"
    - Responda em no máximo 2 mensagens por vez.
    - Quando o cliente demonstrar interesse no Mini Robô Aspirador, siga o fluxo: 1. Nome do cliente; 2. Diferencial slim/escovas; 3. Segurança do pagamento na entrega; 4. CEP.
    - Use as informações de especificações técnicas do produto para guiar a conversa.
    
    Captura de leads — importante:
    - Pergunte o nome do cliente de forma natural no início.
    - Pergunte o CEP para verificar a entrega apenas quando houver sinal de intenção de compra.
    
    Variação de linguagem:
    - Mude a forma de pedir o nome: "Como posso te chamar?", "Qual seu nome?", "Com quem falo?", etc.
    - Evite frases que pareçam roteiro ou script pronto.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...groqHistory,
        { role: 'user', content: messageText }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Desculpe, não entendi. Pode repetir? 😊'

    // Enviar resposta via Z-API — dividindo em frases simulando digitação humana
    const zapiUrl = `${process.env.ZAPI_BASE_URL}/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`

    const sentences = reply.split(/(?<=[.?!])\s+/).filter((s: string) => s.trim().length > 0).slice(0, 2)

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

    // Salvar no MongoDB e Renovar TTL (7 dias para WhatsApp)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    await ChatHistory.findOneAndUpdate(
      { channel: 'whatsapp', identifier: phone },
      { 
        $push: { 
          messages: { 
            $each: [
              { role: 'user', content: messageText },
              { role: 'assistant', content: reply }
            ] 
          } 
        },
        $set: { expiresAt: expiryDate }
      },
      { upsert: true }
    )

    // Após salvar o histórico, extrair e salvar lead
    await extractAndSaveLead(phone, messageText, reply, recentMessages)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

async function extractAndSaveLead(phone: string, userMessage: string, botReply: string, history: any[]) {
  try {
    const leadData: any = { telefone: phone, updatedAt: new Date() }

    // Detectar CEP (8 dígitos numéricos)
    const cepMatch = userMessage.replace(/\D/g, '').match(/^\d{8}$/)
    if (cepMatch) {
      leadData.cep = cepMatch[0]
    }

    // Detectar nome (quando bot perguntou "com quem falo" ou "qual seu nome")
    const lastBotMessage = history.filter((m: any) => m.role === 'assistant').slice(-1)[0]?.content || ''
    const askingName = lastBotMessage.toLowerCase().includes('com quem') || lastBotMessage.toLowerCase().includes('seu nome') || lastBotMessage.toLowerCase().includes('como você se chama')
    if (askingName && userMessage.length < 40 && !userMessage.includes('http')) {
      leadData.nome = userMessage.trim()
    }

    // Detectar produto de interesse pelas mensagens
    const fullContext = history.map((m: any) => m.content).join(' ').toLowerCase()
    if (fullContext.includes('robô') || fullContext.includes('robo') || fullContext.includes('aspirador')) leadData.produto_interesse = 'Mini Robô Aspirador'
    else if (fullContext.includes('massagem') || fullContext.includes('ems')) leadData.produto_interesse = 'Kit Massagem EMS'
    else if (fullContext.includes('mosquito') || fullContext.includes('luminária')) leadData.produto_interesse = 'Luminária Mata Mosquito'
    else if (fullContext.includes('escova') || fullContext.includes('pet') || fullContext.includes('cachorro') || fullContext.includes('gato')) leadData.produto_interesse = 'Escova a Vapor para Pets'
    else if (fullContext.includes('barbeador') || fullContext.includes('barba')) leadData.produto_interesse = 'Barbeador Elétrico 3 em 1'
    else if (fullContext.includes('câmera') || fullContext.includes('camera')) leadData.produto_interesse = 'Câmera Lâmpada 360°'
    else if (fullContext.includes('depiladora') || fullContext.includes('depilação')) leadData.produto_interesse = 'Caneta Depiladora Elétrica'
    else if (fullContext.includes('lixa') || fullContext.includes('pé') || fullContext.includes('calo')) leadData.produto_interesse = 'Lixa de Pé Elétrica'
    else if (fullContext.includes('fone') || fullContext.includes('bluetooth') || fullContext.includes('m10')) leadData.produto_interesse = 'Fone Bluetooth M10'
    else if (fullContext.includes('chaveiro') || fullContext.includes('rastreador')) leadData.produto_interesse = 'Chaveiro Rastreador GPS'
    else if (fullContext.includes('cílios') || fullContext.includes('cilios') || fullContext.includes('modelador')) leadData.produto_interesse = 'Modelador Térmico de Cílios'
    else if (fullContext.includes('mini câmera') || fullContext.includes('a9')) leadData.produto_interesse = 'Mini Câmera Wi-Fi A9'

    await Lead.findOneAndUpdate(
      { telefone: phone },
      { $set: leadData },
      { upsert: true }
    )
  } catch (error) {
    console.error('Erro ao salvar lead:', error)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { message, productSlug, history = [] } = await req.json()

    const knowledgePath = path.join(process.cwd(), 'public/data/products-knowledge.json')
    const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'))

    const product = knowledge.produtos.find((p: any) => p.slug === productSlug)
    const loja = knowledge.loja

    const systemPrompt = `Você se chama Fly e é atendente da ${loja.nome}. Está ajudando um cliente interessado em: ${product?.nome || 'nossos produtos'}.

Seja simpático, natural e humano. Use linguagem informal mas respeitosa. Pode usar emojis com moderação. Nunca revele que é uma IA ou robô. Se perguntarem quem é você, diga que é o Fly, atendente da Viva Leve.

${product ? `Produto: ${JSON.stringify(product)}` : ''}

Loja: ${loja.slogan}
Pagamento na entrega: ${loja.logistica.formas_pagamento_na_entrega.join(', ')}
Prazo: ${loja.logistica.prazo_capitais} nas capitais, ${loja.logistica.prazo_demais} nas demais regiões.
Devolução: ${loja.politicas.devolucao}
O cliente só paga quando receber o produto em mãos.

Se não souber algo, indique o WhatsApp: ${loja.atendimento.whatsapp}.`

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ reply: 'Ocorreu um erro. Tente novamente.' }, { status: 500 })
  }
}

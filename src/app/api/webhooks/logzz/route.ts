import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.status !== 'em_rota') {
      return NextResponse.json({ ok: true })
    }

    const nome = body.customer?.name?.split(' ')[0] || 'cliente'
    const telefone = body.customer?.phone?.replace(/\D/g, '')
    const produto = body.items?.[0]?.name || 'seu produto'
    const valor = body.total_amount

    if (!telefone) {
      return NextResponse.json({ error: 'Telefone não encontrado' }, { status: 400 })
    }

    const mensagem = `Oi ${nome}! 📦 Sua entrega da *Viva Leve* está a caminho e chega hoje!\n\nProduto: *${produto}*\nValor a pagar na entrega: *R$ ${valor}*\n\nTenha o valor separado para pagar direto ao entregador — dinheiro, cartão ou PIX 😊\n\nQualquer dúvida é só chamar aqui!`

    const zapiUrl = `${process.env.ZAPI_BASE_URL}/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`

    await fetch(zapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': process.env.ZAPI_CLIENT_TOKEN!
      },
      body: JSON.stringify({ phone: telefone, message: mensagem })
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook Logzz error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

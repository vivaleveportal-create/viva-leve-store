import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import CoinzzWebhook from '@/lib/models/CoinzzWebhook'
import { sendWhatsAppMessage } from '@/lib/services/zapi'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const headers = Object.fromEntries(req.headers.entries())

    await connectMongo()

    // 1. Discovery & Parsing (Flexible approach)
    // Tentativa de extrair campos comuns de diversas plataformas
    const orderId = payload?.order_id || payload?.id || payload?.transaction_id || 'N/A'
    const productName = payload?.product_name || payload?.items?.[0]?.name || payload?.product?.name || 'Produto não identificado'
    const totalAmount = payload?.total_amount || payload?.amount || payload?.price || 0
    const status = payload?.status || payload?.order_status || 'unknown'
    
    const customer = payload?.customer || payload?.buyer || payload?.client || {}
    const customerName = customer?.name || payload?.customer_name || payload?.buyer_name || 'Cliente'
    const customerPhone = customer?.phone || customer?.mobile || payload?.phone || payload?.customer_phone || ''
    const customerEmail = customer?.email || payload?.email || payload?.customer_email || ''

    // 2. Gravar no MongoDB (Discovery Mode: rawPayload é o mais importante agora)
    const webhookDoc = await CoinzzWebhook.create({
      rawPayload: payload,
      headers: headers,
      orderId,
      productName,
      customerName,
      customerPhone,
      customerEmail,
      totalAmount,
      status
    })

    // 3. Notificação via WhatsApp via Z-API (se o telefone existir)
    let whatsappSent = false
    if (customerPhone) {
      const message = `🚀 *Nova Venda Coinzz!*\n\n` +
                      `👤 *Cliente:* ${customerName}\n` +
                      `📦 *Produto:* ${productName}\n` +
                      `💰 *Valor:* R$ ${totalAmount}\n` +
                      `📊 *Status:* ${status}\n` +
                      `🆔 *Pedido:* ${orderId}\n\n` +
                      `Confira o painel para mais detalhes.`
      
      const targetPhone = '+5521982266075' // Número solicitado: +55 21 98226-6075
      const zapiResult = await sendWhatsAppMessage(targetPhone, message)
      
      if (zapiResult) {
        whatsappSent = true
      }
    }

    // Atualiza status local
    webhookDoc.processed = true
    webhookDoc.whatsappSent = whatsappSent
    await webhookDoc.save()

    // 4. Retornar 200 para a Coinzz
    return NextResponse.json({ ok: true, message: 'Webhook received and logged' }, { status: 200 })

  } catch (error: any) {
    console.error('❌ Webhook Coinzz Error:', error)
    
    // Mesmo com erro, tentamos logar a falha se possível
    try {
      await connectMongo()
      await CoinzzWebhook.create({
        rawPayload: { error: 'Failed to parse JSON or internal error' },
        error: error?.message || 'Unknown error'
      })
    } catch (e) {
      console.error('❌ Failed to log error in MongoDB:', e)
    }

    // Respondemos 200 ou 400? Algumas plataformas preferem 200 para não repetir loop se o erro for nosso código
    // mas 500 é o correto para erro interno. Usaremos 500 para alertar se houver falha de código.
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Permitir GET apenas para teste rápido de endpoint (opcional)
export async function GET() {
  return NextResponse.json({ message: 'Coinzz Webhook Endpoint is Active' })
}

import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import CoinzzWebhook from '@/lib/models/CoinzzWebhook'
import { sendWhatsAppMessage } from '@/lib/services/zapi'
import { sendInternalSaleNotificationEmail } from '@/lib/email'

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
    const paymentMethod = payload?.payment_method || payload?.payment?.method || payload?.payment_type || 'N/A'
    const status = payload?.status || payload?.order_status || 'unknown'

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(totalAmount)
    
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
      paymentMethod,
      status
    })

    // 3. Notificações Simultâneas (Email e WhatsApp)
    let whatsappSent = false
    let emailSent = false

    // WhatsApp para o número solicitado
    const targetWhatsApp = '5521988714006'
    const whatsappMessage = `🚀 *Nova Venda Viva Leve!*\n\n` +
                          `👤 *Cliente:* ${customerName}\n` +
                          `📦 *Produto:* ${productName}\n` +
                          `💰 *Valor:* ${formattedValue}\n` +
                          `💳 *Pagamento:* ${paymentMethod}\n` +
                          `📊 *Status:* ${status}\n` +
                          `🆔 *Pedido:* ${orderId}\n\n` +
                          `Confira o painel para mais detalhes.`

    // Email para o endereço solicitado
    const emailData = {
      productName,
      formattedValue,
      customerName,
      paymentMethod,
      status,
      orderId
    }

    try {
      // Executamos ambos, permitindo que falhem independentemente
      const [whatsappResult, emailResult] = await Promise.allSettled([
        sendWhatsAppMessage(targetWhatsApp, whatsappMessage),
        sendInternalSaleNotificationEmail(emailData)
      ])

      if (whatsappResult.status === 'fulfilled' && whatsappResult.value) {
        whatsappSent = true
      }
      if (emailResult.status === 'fulfilled') {
        emailSent = true
      }
    } catch (notifyError) {
      console.error('⚠️ Notification Error:', notifyError)
    }

    // Atualiza status local
    webhookDoc.processed = true
    webhookDoc.whatsappSent = whatsappSent
    webhookDoc.emailSent = emailSent
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

import nodemailer from 'nodemailer'

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
        secure: process.env.EMAIL_SMTP_PORT === '465',
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS,
        },
    })
}

const FROM = process.env.EMAIL_FROM ?? 'noreply@example.com'
const STORE = process.env.NEXT_PUBLIC_STORE_NAME ?? 'Minha Loja'
const BASE = process.env.NEXT_PUBLIC_STORE_URL ?? ''

export async function sendVerificationEmail(
    to: string,
    token: string
): Promise<void> {
    const url = `${BASE}/verify-email?token=${token}`
    await createTransporter().sendMail({
        from: `${STORE} <${FROM}>`,
        to,
        subject: `Verifique seu email — ${STORE}`,
        html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Verifique seu email</h2>
        <p>Clique no botão abaixo para confirmar sua conta em ${STORE}.</p>
        <a href="${url}" style="display:inline-block;background:#ec4899;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
          Verificar email
        </a>
        <p style="margin-top:16px;color:#6b7280;font-size:13px">
          Se você não criou uma conta, ignore este email.
        </p>
      </div>
    `,
    })
}

export async function sendReceiptEmail(
    to: string,
    order: {
        id: string
        products: { name: string; price: number }[]
        total: number
    }
): Promise<void> {
    const productRows = order.products
        .map(
            (p) =>
                `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6">${p.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right">
            R$ ${(p.price / 100).toFixed(2).replace('.', ',')}
          </td>
        </tr>`
        )
        .join('')

    await createTransporter().sendMail({
        from: `${STORE} <${FROM}>`,
        to,
        subject: `Recibo do seu pedido #${order.id.slice(-6).toUpperCase()} — ${STORE}`,
        html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Obrigado pela sua compra! 🎉</h2>
        <p>Seu pedido foi confirmado. Acesse seus arquivos abaixo.</p>
        <table style="width:100%;border-collapse:collapse">
          ${productRows}
          <tr>
            <td style="padding:12px 0;font-weight:700">Total</td>
            <td style="padding:12px 0;font-weight:700;text-align:right">
              R$ ${(order.total / 100).toFixed(2).replace('.', ',')}
            </td>
          </tr>
        </table>
        <a href="${BASE}/account/orders"
           style="display:inline-block;margin-top:16px;background:#ec4899;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
          Ver pedido e baixar arquivos
        </a>
      </div>
    `,
    })
}

export async function sendPasswordResetEmail(
    to: string,
    token: string
): Promise<void> {
    const url = `${BASE}/reset-password?token=${token}`
    await createTransporter().sendMail({
        from: `${STORE} <${FROM}>`,
        to,
        subject: `Redefinir senha — ${STORE}`,
        html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Redefinir senha</h2>
        <p>Clique no botão abaixo para criar uma nova senha. O link expira em 1 hora.</p>
        <a href="${url}" style="display:inline-block;background:#ec4899;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
          Redefinir senha
        </a>
      </div>
    `,
    })
}
export async function sendInternalSaleNotificationEmail(
    data: {
        productName: string
        formattedValue: string
        customerName: string
        paymentMethod: string
        status: string
        orderId: string
    }
): Promise<void> {
    const to = 'toticavalcanti@hotmail.com'
    
    await createTransporter().sendMail({
        from: `${STORE} <${FROM}>`,
        to,
        subject: `🚀 Venda Realizada: ${data.productName} — ${STORE}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0;padding:0;font-family:'Inter', sans-serif;background-color:#f4f7f6;">
        <div style="background-color:#f4f7f6;padding:40px 20px;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
            <!-- Top Accent Bar -->
            <div style="height:8px;background:linear-gradient(90deg, #00756e, #80b023, #ea7b33);"></div>
            
            <!-- Header -->
            <div style="padding:40px 30px;text-align:center;background-color:#ffffff;">
               <div style="margin-bottom:20px;">
                  <span style="font-family:'Fraunces', serif;font-size:28px;color:#00756e;font-weight:700;">Viva Leve</span>
                  <span style="font-family:'Fraunces', serif;font-size:28px;color:#ea7b33;font-weight:700;">Portal</span>
               </div>
               <h1 style="font-family:'Fraunces', serif;color:#111827;margin:0;font-size:24px;letter-spacing:-0.02em;">🚀 Nova Venda Realizada!</h1>
               <p style="color:#6b7280;margin-top:10px;font-size:16px;">Um novo pagamento foi processado com sucesso.</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding:0 40px 40px 40px;">
              <div style="background-color:#f9fafb;border-radius:12px;padding:30px;border:1px solid #f1f5f9;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:12px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f1f5f9;">Produto</td>
                    <td style="padding:12px 0;color:#111827;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${data.productName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f1f5f9;">Valor</td>
                    <td style="padding:12px 0;color:#80b023;font-weight:700;text-align:right;font-size:20px;border-bottom:1px solid #f1f5f9;">${data.formattedValue}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f1f5f9;">Cliente</td>
                    <td style="padding:12px 0;color:#111827;text-align:right;border-bottom:1px solid #f1f5f9;">${data.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #f1f5f9;">Pagamento</td>
                    <td style="padding:12px 0;color:#ea7b33;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${data.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;color:#6b7280;font-size:14px;">Status</td>
                    <td style="padding:12px 0;text-align:right;">
                      <span style="background-color:#dcfce7;color:#166534;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;">${data.status}</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-top:35px;text-align:center;">
                <a href="${BASE}/admin/orders" style="display:inline-block;background-color:#00756e;color:#ffffff;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 4px 12px rgba(0,117,110,0.2);">Ver Pedido Detalhado</a>
              </div>
              
              <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:30px;">ID do Pedido: ${data.orderId}</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color:#f9fafb;padding:25px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Viva Leve Portal. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    })
}

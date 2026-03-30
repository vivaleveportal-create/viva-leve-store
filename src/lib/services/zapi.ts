interface ZAPISendTextResponse {
  messageId: string
  status: string
}

export async function sendWhatsAppMessage(phone: string, message: string) {
  const instanceId = process.env.ZAPI_INSTANCE_ID
  const token = process.env.ZAPI_TOKEN
  const baseUrl = process.env.ZAPI_BASE_URL || 'https://api.z-api.io'
  const clientToken = process.env.ZAPI_CLIENT_TOKEN

  if (!instanceId || !token) {
    console.warn('Z-API credentials missing. Skipping message.')
    return null
  }

  // Limpar o número do telefone (deixar apenas dígitos)
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Garantir código do país (Brasil 55 se não houver)
  const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone

  try {
    const url = `${baseUrl}/instances/${instanceId}/token/${token}/send-text`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientToken ? { 'Client-Token': clientToken } : {}),
      },
      body: JSON.stringify({
        phone: finalPhone,
        message: message,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Z-API Error:', errorData)
      return null
    }

    const data: ZAPISendTextResponse = await response.json()
    return data
  } catch (error) {
    console.error('Failed to send WhatsApp message via Z-API:', error)
    return null
  }
}

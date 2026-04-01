import { Schema, model, models } from 'mongoose'

const CoinzzWebhookSchema = new Schema(
    {
        // Log bruto da requisição
        rawPayload: { type: Object, required: true },
        headers: { type: Object },
        
        // Dados extraídos (Discovery Mode)
        orderId: { type: String, index: true },
        productName: { type: String },
        customerName: { type: String },
        customerPhone: { type: String },
        customerEmail: { type: String },
        totalAmount: { type: Number },
        paymentMethod: { type: String },
        status: { type: String },
        
        // Metadata do sistema
        processed: { type: Boolean, default: false },
        whatsappSent: { type: Boolean, default: false },
        emailSent: { type: Boolean, default: false },
        error: { type: String }
    },
    { timestamps: true }
)

export default models.CoinzzWebhook || model('CoinzzWebhook', CoinzzWebhookSchema)

import { Schema, model, models } from 'mongoose'
import './User'
import './Product'

const OrderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        total: { type: Number, required: true },
        currency: { type: String, default: 'BRL' },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded', 'processing', 'shipped', 'delivered', 'canceled', 'logzz_failed'],
            default: 'pending',
        },
        shippingAddress: {
            street: String,
            number: String,
            complement: String,
            neighborhood: String,
            city: String,
            state: String,
            zipCode: String,
        },
        stripeSessionId: { type: String, index: true },
        stripePaymentIntentId: { type: String },
        logzzOrderId: { type: String, index: true },
        receiptEmailSent: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export default models.Order || model('Order', OrderSchema)

import { Schema, model, models } from 'mongoose'
import './Category'

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        locale: { type: String, enum: ['pt', 'en'], default: 'pt' },
        slug: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'BRL' },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        images: [{ type: String }],
        logzzProductId: { type: String, index: true },
        logzzProductUrl: { type: String },
        active: { type: Boolean, default: true },
        featured: { type: Boolean, default: false },
        stripeProductId: { type: String },
        stripePriceId: { type: String },
        metaTitle: { type: String },
        metaDescription: { type: String },
        videoUrl: { type: String },
        deliveryDays: { type: Number, default: 7 },
        demoUrl: { type: String },
        coinzz_url: { type: String },
    },
    { timestamps: true }
)

ProductSchema.index({ active: 1, featured: 1 })
ProductSchema.index({ category: 1, active: 1 })
ProductSchema.index({ slug: 1, locale: 1 }, { unique: true })

export default models.Product || model('Product', ProductSchema)

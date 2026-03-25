import mongoose, { Schema, model } from 'mongoose'

const CategorySchema = new Schema(
    {
        label: { type: String, required: true },
        locale: { type: String, enum: ['pt', 'en'], default: 'pt' },
        value: { type: String, required: true, lowercase: true },
        description: { type: String, default: '' },
        active: { type: Boolean, default: true },
        parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
)

CategorySchema.index({ value: 1, locale: 1 }, { unique: true })

export default mongoose.models.Category || model('Category', CategorySchema)

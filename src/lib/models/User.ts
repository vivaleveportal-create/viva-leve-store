import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String },
        password: { type: String, select: false },
        address: {
            street: String,
            number: String,
            complement: String,
            neighborhood: String,
            city: String,
            state: String,
            zipCode: String,
        },
        _verified: { type: Boolean, default: false },
        verificationToken: { type: String, select: false },
        googleId: { type: String, sparse: true },
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
)

export default models.User || model('User', UserSchema)

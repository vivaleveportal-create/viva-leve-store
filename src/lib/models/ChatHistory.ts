import { Schema, model, models } from 'mongoose'

/**
 * ChatHistory Model - Memória de curto prazo para atendimentos Fly
 * Suporta canais 'whatsapp' e 'website' com TTL dinâmico
 */
const ChatHistorySchema = new Schema(
    {
        channel: { 
            type: String, 
            enum: ['whatsapp', 'website'], 
            required: true,
            index: true
        },
        // Telefone no WhatsApp ou UUID de Cookie no Site
        identifier: { 
            type: String, 
            required: true, 
            index: true 
        },
        messages: [
            {
                role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now }
            }
        ],
        // Campo para TTL (expiração automática do MongoDB)
        expiresAt: { 
            type: Date, 
            required: true, 
            index: { expires: 0 } // Expira no momento exato definido na data
        }
    },
    { timestamps: true }
)

export default models.ChatHistory || model('ChatHistory', ChatHistorySchema)

import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema({
  telefone: { type: String, required: true },
  nome: { type: String },
  cep: { type: String },
  cidade: { type: String },
  produto_interesse: { type: String },
  canal: { type: String, default: 'whatsapp' },
  status: { type: String, default: 'novo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema)

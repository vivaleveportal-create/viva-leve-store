import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnalyticsSession extends Document {
  session_id: string
  started_at: Date
  last_seen_at: Date
  product_id?: string
  traffic_source?: string
  device_type?: string
  utm_source?: string
  utm_campaign?: string
  converted: boolean
  whatsapp_clicked: boolean
  chat_used: boolean
}

const analyticsSessionSchema = new Schema<IAnalyticsSession>({
  session_id: { type: String, required: true, unique: true, index: true },
  started_at: { type: Date, default: Date.now, index: true },
  last_seen_at: { type: Date, default: Date.now, index: true },
  product_id: { type: String, index: true },
  traffic_source: { type: String },
  device_type: { type: String },
  utm_source: { type: String },
  utm_campaign: { type: String },
  converted: { type: Boolean, default: false },
  whatsapp_clicked: { type: Boolean, default: false },
  chat_used: { type: Boolean, default: false },
}, { collection: 'analytics_sessions' })

const AnalyticsSessionModel: Model<IAnalyticsSession> = mongoose.models.AnalyticsSession || mongoose.model<IAnalyticsSession>('AnalyticsSession', analyticsSessionSchema)

export default AnalyticsSessionModel

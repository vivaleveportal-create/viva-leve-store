import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnalyticsEvent extends Document {
  session_id: string
  user_id?: string
  product_id?: string
  event_type: string
  event_payload?: Record<string, any>
  source: 'site' | 'chat' | 'whatsapp'
  created_at: Date
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>({
  session_id: { type: String, required: true, index: true },
  user_id: { type: String, index: true },
  product_id: { type: String, index: true },
  event_type: { type: String, required: true, index: true },
  event_payload: { type: Schema.Types.Mixed },
  source: { type: String, enum: ['site', 'chat', 'whatsapp'], required: true },
  created_at: { type: Date, default: Date.now, index: true },
}, { collection: 'analytics_events' })

const AnalyticsEventModel: Model<IAnalyticsEvent> = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema)

export default AnalyticsEventModel

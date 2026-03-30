import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import AnalyticsEventModel from '@/lib/models/AnalyticsEvent'
import AnalyticsSessionModel from '@/lib/models/AnalyticsSession'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, session_id, product_id, payload, source = 'site' } = body

    if (!event_type || !session_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectMongo()

    // 1. Save the event
    await AnalyticsEventModel.create({
      event_type,
      session_id,
      product_id,
      event_payload: payload,
      source,
      created_at: new Date()
    })

    // 2. Upsert/Update the session to keep it alive and capture first-touch details
    // We update last_seen_at and set started_at if it's the first time
    await AnalyticsSessionModel.findOneAndUpdate(
      { session_id },
      { 
        $set: { last_seen_at: new Date() },
        $setOnInsert: { 
          started_at: new Date(),
          product_id, // Store the landing product if available
          // In a real scenario, we'd extract UTMs from headers/payload here
        }
      },
      { upsert: true, new: true }
    )

    // 3. Special handling for some events to update session flags
    if (event_type === 'whatsapp_click') {
      await AnalyticsSessionModel.updateOne({ session_id }, { $set: { whatsapp_clicked: true } })
    } else if (event_type === 'chat_opened' || event_type === 'chat_message_sent') {
      await AnalyticsSessionModel.updateOne({ session_id }, { $set: { chat_used: true } })
    } else if (event_type === 'purchase_completed') {
      await AnalyticsSessionModel.updateOne({ session_id }, { $set: { converted: true } })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

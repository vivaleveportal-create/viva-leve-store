import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import ChatHistory from '@/lib/models/ChatHistory'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const channel = searchParams.get('channel')
    const date = searchParams.get('date')

    await connectMongo()

    let query: any = {}
    if (channel && channel !== 'all') {
      query.channel = channel
    }
    
    if (date) {
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      query.updatedAt = { $gte: start, $lte: end }
    }

    const conversations = await ChatHistory.find(query)
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

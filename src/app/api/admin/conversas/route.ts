import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import ChatHistory from '@/lib/models/ChatHistory'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const password = process.env.ADMIN_PASSWORD

    if (!password || authHeader !== `Bearer ${password}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectMongo()

    // Buscar todas as conversas, ordenar por data de atualização (mais recente primeiro)
    const conversations = await ChatHistory.find({})
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

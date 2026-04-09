import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const product = searchParams.get('product')

    await connectMongo()

    let query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (product && product !== 'all') {
      query.produto_interesse = { $regex: product, $options: 'i' }
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Leads API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

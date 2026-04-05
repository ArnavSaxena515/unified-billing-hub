import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

const REDIS_KEY = 'billing:contracts'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedRecords = Array.isArray(body) ? body : [body]
    const validRecords = parsedRecords.filter((r) => r && typeof r === 'object' && Object.keys(r).length > 0)
    
    if (validRecords.length === 0) {
      return NextResponse.json({ success: true, received: 0, note: 'Empty payload ignored' })
    }

    // RPUSH is atomic — no race condition
    await Promise.all(
      validRecords.map(record => 
        redis.rpush(REDIS_KEY, JSON.stringify(record))
      )
    )
    // Set TTL on the list
    await redis.expire(REDIS_KEY, 3600)

    return NextResponse.json({ success: true, received: validRecords.length })
  } catch {
    return NextResponse.json(
      { error: 'Failed to store data' },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

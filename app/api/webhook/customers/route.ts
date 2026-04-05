import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

const REDIS_KEY = 'billing:customers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newRecords = Array.isArray(body) ? body : [body]
    const existing = ((await redis.get(REDIS_KEY)) as unknown[]) || []
    const updated = [...existing, ...newRecords]
    await redis.set(REDIS_KEY, updated, { ex: 3600 })
    return NextResponse.json({
      success: true,
      received: newRecords.length,
      total: updated.length,
    })
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

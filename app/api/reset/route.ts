import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

export async function POST() {
  try {
    await Promise.all([
      redis.del('billing:customers'),
      redis.del('billing:contracts'),
      redis.del('billing:invoices'),
      redis.del('billing:vendors'),
      redis.del('billing:revrec'),
    ])
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to reset' },
      { status: 500 },
    )
  }
}

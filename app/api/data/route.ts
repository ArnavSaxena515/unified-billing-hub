import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

export async function GET() {
  try {
    const [customers, contracts, invoices, vendors] = await Promise.all([
      redis.get('billing:customers'),
      redis.get('billing:contracts'),
      redis.get('billing:invoices'),
      redis.get('billing:vendors'),
    ])

    const c = (customers as unknown[]) || []
    const co = (contracts as unknown[]) || []
    const i = (invoices as unknown[]) || []
    const v = (vendors as unknown[]) || []

    return NextResponse.json({
      customers: c,
      contracts: co,
      invoices: i,
      vendors: v,
      counts: {
        customers: c.length,
        contracts: co.length,
        invoices: i.length,
        vendors: v.length,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    )
  }
}

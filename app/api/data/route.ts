import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

export async function GET() {
  try {
    const [customers, contracts, invoices, vendors, revrec] = await Promise.all([
      redis.hvals('billing:customers'),
      redis.hvals('billing:contracts'),
      redis.hvals('billing:invoices'),
      redis.hvals('billing:vendors'),
      redis.hvals('billing:revrec'),
    ])

    // Each item is a JSON string, parse them
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parse = (list: any[]) => list.map(item => typeof item === 'string' ? JSON.parse(item) : item)

    const c = parse(customers || [])
    const co = parse(contracts || [])
    const i = parse(invoices || [])
    const v = parse(vendors || [])
    const r = parse(revrec || [])

    return NextResponse.json({
      customers: c,
      contracts: co,
      invoices: i,
      vendors: v,
      revrec: r,
      counts: {
        customers: c.length,
        contracts: co.length,
        invoices: i.length,
        vendors: v.length,
        revrec: r.length,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    )
  }
}

import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newRecords = Array.isArray(body) ? body : [body]

    const validRecords = newRecords.filter((r: any) => r && typeof r === 'object' && Object.keys(r).length > 0)

    if (validRecords.length === 0) {
      return NextResponse.json({ success: true, received: 0, note: 'Empty payload ignored' })
    }

    const hashData: Record<string, string> = {}
    validRecords.forEach((record: any) => {
      const key = `${record["Source"] || "unknown"}:${record["Contract ID"] || ""}:${record["Performance Obligation"] || ""}`
      hashData[key] = JSON.stringify(record)
    })

    await redis.hset('billing:revrec', hashData)
    await redis.expire('billing:revrec', 3600)

    return NextResponse.json({ success: true, received: newRecords.length })
  } catch (error) {
    console.error('Rev rec webhook error:', error)
    return NextResponse.json({ error: 'Failed to store data' }, { status: 500 })
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

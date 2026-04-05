import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

const REDIS_KEY = 'billing:vendors'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedRecords = Array.isArray(body) ? body : [body]
    const validRecords = parsedRecords.filter((r) => r && typeof r === 'object' && Object.keys(r).length > 0)
    
    // Normalize records — handle both original format and NetSuite format
    const normalized = validRecords.map(record => {
      // Check if it's the NetSuite workflow format (has source_system field)
      if (record.source_system === 'netsuite' || record.vendor_id || record.company_name) {
        return {
          "Source": "NetSuite",
          "Source ID": record.source_id || record.vendor_id || "",
          "Vendor Name": record.company_name || record.primary_contact_name || "",
          "Vendor ID": record.vendor_id || "",
          "Email": record.email || "",
          "Phone": record.phone_e164 || "",
          "Address": [record.address_street, record.address_city, record.address_state, record.address_zip, record.address_country].filter(Boolean).join(", "),
          "Payment Terms": record.payment_terms_days ? "Net " + record.payment_terms_days : "",
          "Status": record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : "Active",
          "Currency": record.currency_code || "USD",
          "Contact": record.primary_contact_name || "",
          "Subsidiary": record.subsidiary_name || "",
          "Outstanding Balance": record.outstanding_balance_amount || "0",
          "Fax": record.fax || "",
          "Created Date": record.created_date || ""
        }
      }
      // Otherwise it's the original format — pass through as-is
      return record
    })

    if (normalized.length === 0) {
      return NextResponse.json({ success: true, received: 0, note: 'Empty payload ignored' })
    }

    // RPUSH is atomic — no race condition
    await Promise.all(
      normalized.map(record => 
        redis.rpush(REDIS_KEY, JSON.stringify(record))
      )
    )
    // Set TTL on the list
    await redis.expire(REDIS_KEY, 3600)

    return NextResponse.json({ success: true, received: normalized.length })
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

import { NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newRecords = Array.isArray(body) ? body : [body]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalized = newRecords.map((record: any) => {
      // Null check the record entirely first to prevent errors
      if (!record || typeof record !== 'object') return record;

      if (record.source_system || record.vendor_id || record.company_name) {
        const parts = [
          record.address_street || "",
          record.address_city || "",
          record.address_state || "",
          record.address_zip || "",
          record.address_country || ""
        ].filter(Boolean)

        const status = record.status || record["Status"] || "active"

        return {
          "Source": "NetSuite",
          "Source ID": record.source_id || record.vendor_id || "",
          "Vendor Name": record.company_name || record.primary_contact_name || record["Vendor Name"] || "",
          "Vendor ID": record.vendor_id || record["Vendor ID"] || "",
          "Email": record.email || record["Email"] || "",
          "Phone": record.phone_e164 || record["Phone"] || "",
          "Address": parts.join(", ") || record["Address"] || "",
          "Payment Terms": record.payment_terms_days ? "Net " + record.payment_terms_days : record["Payment Terms"] || "",
          "Status": typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : "Active",
          "Currency": record.currency_code || record["Currency"] || "USD",
          "Contact": record.primary_contact_name || record["Contact"] || "",
          "Subsidiary": record.subsidiary_name || record["Subsidiary"] || "",
          "Outstanding Balance": record.outstanding_balance_amount || record["Outstanding Balance"] || "0",
          "Fax": record.fax || record["Fax"] || "",
          "Created Date": record.created_date || record["Created Date"] || ""
        }
      }
      return record
    })

    // Filter out empties that don't belong
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = normalized.filter((r: any) => r && Object.keys(r).length > 0)
    
    if (filtered.length === 0) {
      return NextResponse.json({ success: true, received: 0, note: 'Empty payload ignored' })
    }

    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered.map((record: any) =>
        redis.rpush('billing:vendors', JSON.stringify(record))
      )
    )
    await redis.expire('billing:vendors', 3600)

    return NextResponse.json({ success: true, received: filtered.length })
  } catch (error) {
    console.error('Vendor webhook error:', error)
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

import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const res = await fetch('https://sapis.gocobalt.io/api/v1/workflow/69d22c6885f406c12762e50e/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REFOLD_API_KEY!,
        'linked_account_id': process.env.REFOLD_LINKED_ACCOUNT_ID!,
        'slug': process.env.REFOLD_WORKFLOW_SLUG!,
        'config_id': 'OPTIONAL',
        'sync_execution': 'false',
      },
      body: JSON.stringify({}),
    })

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger Chargebee sync' }, { status: 500 })
  }
}

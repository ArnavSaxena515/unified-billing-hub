import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const res = await fetch('https://sapis.gocobalt.io/api/v1/workflow/69ce9a2d85f406c1275f7115/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REFOLD_API_KEY || 'tk42aa441c-7f2a-4f76-a08f-3a1f99fc4df0',
        'linked_account_id': process.env.REFOLD_LINKED_ACCOUNT_ID || 'cobalt_test_user',
        'slug': process.env.REFOLD_WORKFLOW_SLUG || 'Coba-6128',
        'config_id': 'OPTIONAL',
        'sync_execution': 'false'
      },
      body: JSON.stringify({}),
    })

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { error: 'Failed to trigger NetSuite sync' },
      { status: 500 },
    )
  }
}

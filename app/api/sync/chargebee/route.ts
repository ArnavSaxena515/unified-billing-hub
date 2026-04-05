import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const res = await fetch('https://sapis.gocobalt.io/api/v1/workflow/69d22c6885f406c12762e50e/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'tk42aa441c-7f2a-4f76-a08f-3a1f99fc4df0',
        'linked_account_id': 'cobalt_test_user',
        'slug': 'Coba-6128',
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

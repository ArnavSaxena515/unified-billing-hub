import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const res = await fetch('https://sapis.gocobalt.io/api/v1/workflow/69d370e985f406c12765827a/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REFOLD_API_KEY!,
        'linked_account_id': process.env.REFOLD_LINKED_ACCOUNT_ID!,
        'slug': process.env.REFOLD_WORKFLOW_SLUG!,
      },
      body: JSON.stringify({}),
    })

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger Stripe sync' }, { status: 500 })
  }
}

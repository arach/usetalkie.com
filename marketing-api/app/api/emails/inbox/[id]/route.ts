import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
  }

  const { id } = await params

  const res = await fetch(`https://api.resend.com/emails/received/${id}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Resend API error: ${text}` }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  // Resend SDK doesn't have emails.list() — use the REST API directly
  const params = new URLSearchParams()
  const limit = request.nextUrl.searchParams.get('limit') || '50'
  params.set('limit', limit)
  const after = request.nextUrl.searchParams.get('after')
  if (after) params.set('after', after)

  const res = await fetch(`https://api.resend.com/emails?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Resend API error: ${text}` }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}

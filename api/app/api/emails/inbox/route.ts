import { NextRequest, NextResponse } from 'next/server'

const INBOX_DOMAIN = process.env.INBOX_DOMAIN || 'mail.usetalkie.com'

export async function GET(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
  }

  const params = new URLSearchParams()
  // Fetch more than needed since we filter by domain client-side
  params.set('limit', '100')
  const after = request.nextUrl.searchParams.get('after')
  if (after) params.set('after', after)

  const res = await fetch(`https://api.resend.com/emails/received?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Resend API error: ${text}` }, { status: res.status })
  }

  const data = await res.json()

  // Filter to only emails sent to the inbox subdomain
  if (data.data && Array.isArray(data.data)) {
    data.data = data.data.filter((email: { to: string | string[] }) => {
      const recipients = Array.isArray(email.to) ? email.to : [email.to]
      return recipients.some((addr: string) =>
        addr.toLowerCase().includes(`@${INBOX_DOMAIN}`)
      )
    })
  }

  return NextResponse.json(data)
}

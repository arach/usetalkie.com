import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
  }

  const { to, subject, body, inReplyTo } = await request.json()

  if (!to || !subject || !body) {
    return NextResponse.json({ error: 'Missing to, subject, or body' }, { status: 400 })
  }

  const inboxFrom = process.env.INBOX_FROM_EMAIL || 'Talkie Support <support@mail.usetalkie.com>'

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: inboxFrom,
    to,
    subject,
    text: body,
    ...(inReplyTo && {
      headers: {
        'In-Reply-To': inReplyTo,
        References: inReplyTo,
      },
    }),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id })
}

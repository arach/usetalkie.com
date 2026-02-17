import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getTemplate } from '@/lib/emails/templates'

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
  }

  const { templateSlug, to } = await request.json()

  if (!templateSlug || !to) {
    return NextResponse.json({ error: 'Missing templateSlug or to' }, { status: 400 })
  }

  const template = getTemplate(templateSlug)
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Arach Tchoupani <arach@mail.usetalkie.com>',
    to,
    subject: template.subject,
    html: template.renderHtml({ email: to }),
    text: template.renderText({ email: to }),
    replyTo: 'arach@usetalkie.com',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id })
}

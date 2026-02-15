import { NextRequest, NextResponse } from 'next/server'
import { getTemplate } from '@/lib/emails/templates'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('template')
  if (!slug) {
    return NextResponse.json({ error: 'Missing template parameter' }, { status: 400 })
  }

  const template = getTemplate(slug)
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const html = template.renderHtml({ email: 'preview@example.com' })
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

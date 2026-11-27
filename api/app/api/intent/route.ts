import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { intents } from '@/lib/db/schema'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const topics = new Set(['api-reference', 'talkieserver', 'tailscale'])

export async function POST(request: NextRequest) {
  try {
    const fields = await request.json().catch(() => null)
    const email = typeof fields?.email === 'string' ? fields.email.trim().toLowerCase() : ''
    const intent = typeof fields?.intent === 'string' ? fields.intent.trim().toLowerCase().replace(/\s+/g, '-') : ''
    if (fields?.honeypot) return NextResponse.json({ success: true }, { headers })
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !topics.has(intent)) {
      return NextResponse.json({ error: 'Enter an email address and a supported topic.' }, { status: 400, headers })
    }
    // A docs request grants permission for this topic only.
    await db.insert(intents).values({ email, intent, source: 'docs' })
    return NextResponse.json({ success: true }, { headers })
  } catch {
    return NextResponse.json({ error: 'Could not save your request.' }, { status: 503, headers })
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers })
}

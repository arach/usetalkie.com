import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { feedbackThreads } from '@/lib/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY)
const corsHeaders = { 'Access-Control-Allow-Origin': '*' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Generate short unique ID for feedback thread
function generateThreadId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function POST(request: NextRequest) {
  try {
    const { feedback, email, url, userAgent } = await request.json()
    const feedbackText = typeof feedback === 'string' ? feedback.trim() : ''
    const senderEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const pageUrl = typeof url === 'string' ? url : ''
    const browserUserAgent = typeof userAgent === 'string' ? userAgent : ''

    if (!feedbackText) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!senderEmail || !emailPattern.test(senderEmail)) {
      return NextResponse.json(
        { error: 'A valid email is required so I can follow up.' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Generate unique thread ID
    const threadId = generateThreadId()

    // Store feedback thread in database
    await db.insert(feedbackThreads).values({
      id: threadId,
      senderEmail,
      feedback: feedbackText,
      url: pageUrl || null,
      userAgent: browserUserAgent || null,
    })

    const safeFeedbackText = escapeHtml(feedbackText)
    const safeSenderEmail = escapeHtml(senderEmail)
    const safePageUrl = escapeHtml(pageUrl)
    const safeBrowserUserAgent = escapeHtml(browserUserAgent)

    // Send feedback email with thread ID in From address
    await resend.emails.send({
      from: `Talkie Feedback <feedback+${threadId}@mail.usetalkie.com>`,
      to: 'arach@usetalkie.com',
      replyTo: senderEmail,
      subject: `Feedback from ${senderEmail}`,
      text: `
Feedback: ${feedbackText}

---
From: ${senderEmail}
URL: ${pageUrl || 'Unknown'}
User Agent: ${browserUserAgent || 'Unknown'}
      `.trim(),
      html: `
<div style="font-family: -apple-system, sans-serif; max-width: 600px;">
  <div style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
    <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">From</div>
    <div style="font-size: 16px; font-weight: 600;">
      <a href="mailto:${safeSenderEmail}" style="color: #10b981; text-decoration: none;">${safeSenderEmail}</a>
    </div>
  </div>

  <h2 style="color: #10b981; margin-top: 0;">Feedback</h2>
  <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 16px; margin: 16px 0;">
    <p style="margin: 0; white-space: pre-wrap;">${safeFeedbackText}</p>
  </div>

  <div style="font-size: 12px; color: #9ca3af; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
    <div><strong>URL:</strong> <a href="${safePageUrl}" style="color: #10b981;">${safePageUrl || 'Unknown'}</a></div>
    <div style="margin-top: 4px;"><strong>User Agent:</strong> ${safeBrowserUserAgent || 'Unknown'}</div>
  </div>
</div>
      `.trim(),
    })

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { feedbackThreads } from '@/lib/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

// Generate short unique ID for feedback thread
function generateThreadId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export async function POST(request: NextRequest) {
  try {
    const { feedback, email, url, userAgent } = await request.json()

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      )
    }

    // Generate unique thread ID
    const threadId = generateThreadId()

    // Store feedback thread in database
    await db.insert(feedbackThreads).values({
      id: threadId,
      senderEmail: email || 'anonymous',
      feedback: feedback.trim(),
      url: url || null,
      userAgent: userAgent || null,
    })

    // Send feedback email with thread ID in From address
    await resend.emails.send({
      from: `Talkie Feedback <feedback+${threadId}@mail.usetalkie.com>`,
      to: 'arach@usetalkie.com',
      replyTo: email && email !== 'anonymous' ? email : undefined,
      subject: `Feedback from ${email || 'Anonymous user'}`,
      text: `
Feedback: ${feedback}

---
From: ${email || 'Anonymous'}
URL: ${url || 'Unknown'}
User Agent: ${userAgent || 'Unknown'}
      `.trim(),
      html: `
<div style="font-family: -apple-system, sans-serif; max-width: 600px;">
  <div style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
    <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">From</div>
    <div style="font-size: 16px; font-weight: 600;">
      ${email && email !== 'anonymous'
        ? `<a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>`
        : '<span style="color: #9ca3af;">Anonymous</span>'}
    </div>
  </div>

  <h2 style="color: #10b981; margin-top: 0;">Feedback</h2>
  <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 16px; margin: 16px 0;">
    <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
  </div>

  <div style="font-size: 12px; color: #9ca3af; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
    <div><strong>URL:</strong> <a href="${url}" style="color: #10b981;">${url || 'Unknown'}</a></div>
    <div style="margin-top: 4px;"><strong>User Agent:</strong> ${userAgent || 'Unknown'}</div>
  </div>
</div>
      `.trim(),
    })

    return NextResponse.json({ success: true }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
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

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { feedbackThreads } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    // Extract thread ID from To address (feedback+abc123@mail.usetalkie.com)
    const toAddress = payload.to || ''
    const match = toAddress.match(/feedback\+([a-z0-9]+)@/)

    if (!match) {
      console.error('Invalid To address format:', toAddress)
      return NextResponse.json({ error: 'Invalid address format' }, { status: 400 })
    }

    const threadId = match[1]

    // Look up original feedback thread
    const [thread] = await db
      .select()
      .from(feedbackThreads)
      .where(eq(feedbackThreads.id, threadId))
      .limit(1)

    if (!thread) {
      console.error('Thread not found:', threadId)
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    if (thread.senderEmail === 'anonymous') {
      console.log('Cannot reply to anonymous feedback')
      return NextResponse.json({ error: 'Cannot reply to anonymous feedback' }, { status: 400 })
    }

    // Extract reply content (text or html)
    const replyText = payload.text || payload.html || 'No content'

    // Forward reply from arach@usetalkie.com to original sender
    await resend.emails.send({
      from: 'Arach <arach@usetalkie.com>',
      to: thread.senderEmail,
      subject: `Re: Your Talkie feedback`,
      text: replyText,
      html: payload.html || null,
      // Set Reply-To so future replies go directly to arach
      replyTo: 'arach@usetalkie.com',
    })

    // Mark thread as replied
    await db
      .update(feedbackThreads)
      .set({ replied: true })
      .where(eq(feedbackThreads.id, threadId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inbound email error:', error)
    return NextResponse.json(
      { error: 'Failed to process inbound email' },
      { status: 500 }
    )
  }
}

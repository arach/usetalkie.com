import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { addToAudience, sendWelcomeSequence } from '@/lib/emails/service'

// Simple in-memory rate limiting
const submissions = new Map<string, { count: number; firstSubmission: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_SUBMISSIONS_PER_IP = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = submissions.get(ip)

  if (!record) {
    submissions.set(ip, { count: 1, firstSubmission: now })
    return false
  }

  if (now - record.firstSubmission > RATE_LIMIT_WINDOW) {
    submissions.set(ip, { count: 1, firstSubmission: now })
    return false
  }

  record.count++
  return record.count > MAX_SUBMISSIONS_PER_IP
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const { email, useCase, referralSource, honeypot, formLoadTime, utm } = await request.json()

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    // Timing check
    if (formLoadTime && (Date.now() - formLoadTime) < 2000) {
      return NextResponse.json({ success: true })
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    // Upsert contact into DB
    const existing = await db
      .select({ id: contacts.id })
      .from(contacts)
      .where(eq(contacts.email, cleanEmail))
      .limit(1)

    const isNew = existing.length === 0

    if (isNew) {
      await db.insert(contacts).values({
        email: cleanEmail,
        status: 'contact',
        useCase: useCase || null,
        source: referralSource || 'direct',
        utmSource: utm?.utm_source || null,
        utmMedium: utm?.utm_medium || null,
        utmCampaign: utm?.utm_campaign || null,
      })
    } else {
      // Update use_case, source, and UTM if not already set
      await db
        .update(contacts)
        .set({
          useCase: useCase || undefined,
          source: referralSource || undefined,
          utmSource: utm?.utm_source || undefined,
          utmMedium: utm?.utm_medium || undefined,
          utmCampaign: utm?.utm_campaign || undefined,
        })
        .where(eq(contacts.email, cleanEmail))
    }

    // Sync to Resend and send emails (only for new contacts)
    let emailSent = false
    if (process.env.RESEND_API_KEY && isNew) {
      emailSent = true

      // Add to Resend audience
      const resendContactId = await addToAudience(cleanEmail)
      if (resendContactId) {
        await db
          .update(contacts)
          .set({ resendContactId })
          .where(eq(contacts.email, cleanEmail))
          .catch((err) => console.error('Failed to store resend_contact_id:', err))
      }

      // Send welcome email + follow-up in background
      waitUntil(sendWelcomeSequence({ email: cleanEmail, useCase }))
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list!",
      emailSent,
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
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

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getTemplate } from '@/lib/emails/templates'

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
    const { email, useCase, honeypot, formLoadTime, utm } = await request.json()

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
        source: 'early_access',
        utmSource: utm?.utm_source || null,
        utmMedium: utm?.utm_medium || null,
        utmCampaign: utm?.utm_campaign || null,
      })
    } else {
      // Update use_case and UTM if not already set
      await db
        .update(contacts)
        .set({
          useCase: useCase || undefined,
          utmSource: utm?.utm_source || undefined,
          utmMedium: utm?.utm_medium || undefined,
          utmCampaign: utm?.utm_campaign || undefined,
        })
        .where(eq(contacts.email, cleanEmail))
    }

    // Sync to Resend audience + send welcome email (only for new contacts)
    let emailSent = false
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)

        // Add contact to Resend audience and store the contact ID
        const audienceId = process.env.RESEND_SEGMENT_ID
        if (audienceId) {
          const result = await resend.contacts.create({
            email: cleanEmail,
            audienceId,
            unsubscribed: false,
          }).catch((err) => {
            console.error('Failed to add contact:', err)
            return null
          })

          // Store resend_contact_id back to DB
          if (result?.data?.id) {
            await db
              .update(contacts)
              .set({ resendContactId: result.data.id })
              .where(eq(contacts.email, cleanEmail))
              .catch((err) => console.error('Failed to store resend_contact_id:', err))
          }
        }

        // Only send welcome email for new contacts
        if (isNew) {
          const templateSlug = useCase === 'mac' ? 'welcome-mac' : 'welcome-ios'
          const welcome = getTemplate(templateSlug) || getTemplate('welcome')!
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Arach Tchoupani <arach@mail.usetalkie.com>',
            to: cleanEmail,
            bcc: process.env.NOTIFY_EMAIL || 'notifs@usetalkie.com',
            subject: welcome.subject,
            html: welcome.renderHtml({ email: cleanEmail }),
            text: welcome.renderText({ email: cleanEmail }),
            replyTo: 'arach@usetalkie.com',
          })

          emailSent = true
          console.log(`Welcome email sent to ${cleanEmail}`)

          // Schedule follow-up email for 24 hours later
          const followUp = getTemplate('follow-up')
          if (followUp) {
            const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'Arach Tchoupani <arach@mail.usetalkie.com>',
              to: cleanEmail,
              subject: followUp.subject,
              html: followUp.renderHtml({ email: cleanEmail }),
              text: followUp.renderText({ email: cleanEmail }),
              replyTo: 'arach@usetalkie.com',
              scheduledAt,
            })
            console.log(`Follow-up email scheduled for ${cleanEmail} at ${scheduledAt}`)
          }
        }
      } catch (emailError) {
        console.error('Resend email error:', emailError)
      }
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

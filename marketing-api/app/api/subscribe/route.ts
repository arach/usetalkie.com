import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Simple in-memory rate limiting
const submissions = new Map<string, { count: number; firstSubmission: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_SUBMISSIONS_PER_IP = 3

const TESTFLIGHT_URL = 'https://marketing.usetalkie.com/testflight?ref=welcome-email'

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

function getWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Talkie</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #141414; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #222;">
              <div style="display: inline-block; background: #10b981; width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 24px;">🎙️</div>
              <h1 style="margin: 16px 0 0; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Talkie</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Thanks for signing up! You're one of the first to get early access to Talkie — voice-to-text that actually works.
              </p>
              <p style="margin: 0 0 24px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Ready to try it? Download the TestFlight beta and start dictating in seconds:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="${TESTFLIGHT_URL}" style="display: inline-block; background: #10b981; color: #000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Download TestFlight Beta
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; color: #fff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">What you get:</p>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #a1a1a1; font-size: 14px; line-height: 1.8;">
                  <li>Local AI transcription — nothing leaves your device</li>
                  <li>Works in any app with a global hotkey</li>
                  <li>Smart paste — text goes where your cursor was</li>
                  <li>iPhone & Watch capture (coming soon)</li>
                </ul>
              </div>
              <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                Questions or feedback? Just reply to this email — I read everything.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #222; text-align: center;">
              <p style="margin: 0 0 8px; color: #666; font-size: 12px;">
                Arach · Founder of Talkie
              </p>
              <p style="margin: 0; color: #444; font-size: 11px;">
                <a href="https://usetalkie.com" style="color: #10b981; text-decoration: none;">usetalkie.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function getWelcomeEmailText(): string {
  return `Welcome to Talkie!

Thanks for signing up! You're one of the first to get early access to Talkie — voice-to-text that actually works.

Ready to try it? Download the TestFlight beta:
${TESTFLIGHT_URL}

What you get:
• Local AI transcription — nothing leaves your device
• Works in any app with a global hotkey
• Smart paste — text goes where your cursor was
• iPhone & Watch capture (coming soon)

Questions or feedback? Just reply to this email — I read everything.

— Arach, Founder of Talkie
https://usetalkie.com`
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

    // Forward to Formspree
    const formspreeId = process.env.FORMSPREE_ID || 'mkgaanoo'
    const formspreePromise = fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        useCase: useCase || 'not_specified',
        source: 'early_access',
        timestamp: new Date().toISOString(),
        utm_source: utm?.utm_source,
        utm_medium: utm?.utm_medium,
        utm_campaign: utm?.utm_campaign,
        _subject: `Talkie Early Access: ${useCase || 'not_specified'}`,
      }),
    })

    // Send welcome email
    let emailSent = false
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Talkie <hello@usetalkie.com>',
          to: cleanEmail,
          subject: 'Welcome to Talkie — Your TestFlight is ready',
          html: getWelcomeEmailHtml(cleanEmail),
          text: getWelcomeEmailText(),
          replyTo: 'hey@usetalkie.com',
        })

        emailSent = true
        console.log(`Welcome email sent to ${cleanEmail}`)
      } catch (emailError) {
        console.error('Resend email error:', emailError)
      }
    }

    await formspreePromise

    return NextResponse.json({
      success: true,
      message: "You're on the list!",
      emailSent,
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
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

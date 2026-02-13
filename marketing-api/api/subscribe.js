/**
 * Email subscription API endpoint for Vercel
 * Deploy separately from the static site
 *
 * Flow:
 * 1. Validate & spam protection
 * 2. Save to Formspree (storage/backup)
 * 3. Send welcome email with TestFlight link via Resend
 *
 * Spam protection:
 * - Honeypot field
 * - Timing check (submissions < 2s are likely bots)
 * - Basic rate limiting
 * - Email validation
 */

import { Resend } from 'resend'

// Simple in-memory rate limiting (resets on cold start)
const submissions = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_SUBMISSIONS_PER_IP = 3

// TestFlight link via our redirect
const TESTFLIGHT_URL = 'https://marketing.usetalkie.com/testflight?ref=welcome-email'

function getRateLimitKey(ip) {
  return `${ip}`
}

function isRateLimited(ip) {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const record = submissions.get(key)

  if (!record) {
    submissions.set(key, { count: 1, firstSubmission: now })
    return false
  }

  // Reset if window has passed
  if (now - record.firstSubmission > RATE_LIMIT_WINDOW) {
    submissions.set(key, { count: 1, firstSubmission: now })
    return false
  }

  // Increment and check
  record.count++
  return record.count > MAX_SUBMISSIONS_PER_IP
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Welcome email HTML template
function getWelcomeEmailHtml(email) {
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
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #222;">
              <div style="display: inline-block; background: #10b981; width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 24px;">🎙️</div>
              <h1 style="margin: 16px 0 0; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Talkie</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Thanks for signing up! You're one of the first to get early access to Talkie — voice-to-text that actually works.
              </p>

              <p style="margin: 0 0 24px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Ready to try it? Download the TestFlight beta and start dictating in seconds:
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="${TESTFLIGHT_URL}" style="display: inline-block; background: #10b981; color: #000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Download TestFlight Beta
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What to expect -->
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

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #222; text-align: center;">
              <p style="margin: 0 0 8px; color: #666; font-size: 12px;">
                Arach · Founder of Talkie
              </p>
              <p style="margin: 0; color: #444; font-size: 11px;">
                <a href="https://usetalkie.com" style="color: #10b981; text-decoration: none;">usetalkie.com</a>
                &nbsp;·&nbsp;
                <a href="https://x.com/usetalkieapp" style="color: #666; text-decoration: none;">@usetalkieapp</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- Unsubscribe -->
        <p style="margin: 24px 0 0; color: #444; font-size: 11px; text-align: center;">
          You're receiving this because you signed up for early access at usetalkie.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Plain text version
function getWelcomeEmailText() {
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

https://usetalkie.com
`
}

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
               req.headers['x-real-ip'] ||
               'unknown'

    // Rate limiting
    if (isRateLimited(ip)) {
      res.status(429).json({ error: 'Too many requests. Please try again later.' })
      return
    }

    const { email, useCase, honeypot, formLoadTime, utm } = req.body

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      // Return success to not tip off bots
      res.status(200).json({ success: true })
      return
    }

    // Timing check - if form submitted in < 2 seconds, likely a bot
    const submissionTime = Date.now()
    if (formLoadTime && (submissionTime - formLoadTime) < 2000) {
      // Return success to not tip off bots
      res.status(200).json({ success: true })
      return
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' })
      return
    }

    const cleanEmail = email.toLowerCase().trim()

    // Prepare submission data
    const submission = {
      email: cleanEmail,
      useCase: useCase || 'not_specified',
      source: 'early_access',
      timestamp: new Date().toISOString(),
      utm: utm || {},
      ip: ip !== 'unknown' ? ip.substring(0, 10) + '...' : null,
    }

    // Forward to Formspree as storage/backup
    const formspreeId = process.env.FORMSPREE_ID || 'mkgaanoo'
    const formspreePromise = fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: submission.email,
        useCase: submission.useCase,
        source: submission.source,
        timestamp: submission.timestamp,
        utm_source: submission.utm?.utm_source,
        utm_medium: submission.utm?.utm_medium,
        utm_campaign: submission.utm?.utm_campaign,
        _subject: `Talkie Early Access: ${submission.useCase}`,
      }),
    })

    // Send welcome email via Resend
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
        // Don't fail the request if email fails - they're still subscribed
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping welcome email')
    }

    // Wait for Formspree
    const formspreeResponse = await formspreePromise
    if (!formspreeResponse.ok) {
      console.error('Formspree error:', await formspreeResponse.text())
      // Don't fail - the email might still have been sent
    }

    res.status(200).json({
      success: true,
      message: "You're on the list!",
      emailSent,
    })

  } catch (error) {
    console.error('Subscription error:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

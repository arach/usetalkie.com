/**
 * Email subscription API endpoint for Vercel
 * Deploy separately from the static site
 *
 * Spam protection:
 * - Honeypot field
 * - Timing check (submissions < 2s are likely bots)
 * - Basic rate limiting
 * - Email validation
 */

// Simple in-memory rate limiting (resets on cold start)
const submissions = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_SUBMISSIONS_PER_IP = 3

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

    // Prepare submission data
    const submission = {
      email: email.toLowerCase().trim(),
      useCase: useCase || 'not_specified',
      source: 'early_access',
      timestamp: new Date().toISOString(),
      utm: utm || {},
      ip: ip !== 'unknown' ? ip.substring(0, 10) + '...' : null,
    }

    // Forward to Formspree as storage
    const formspreeId = process.env.FORMSPREE_ID || 'mkgaanoo'

    const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
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

    if (!formspreeResponse.ok) {
      console.error('Formspree error:', await formspreeResponse.text())
      res.status(500).json({ error: 'Failed to save. Please try again.' })
      return
    }

    res.status(200).json({
      success: true,
      message: "You're on the list!"
    })

  } catch (error) {
    console.error('Subscription error:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

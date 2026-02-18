import { Resend } from 'resend'
import { getTemplate } from './templates'
import { EMAIL_CONFIG, getWelcomeTemplateSlug } from './config'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendWelcomeEmailParams {
  email: string
  useCase?: string
}

export interface SendFollowUpEmailParams {
  email: string
  scheduledAt: Date
}

/**
 * Send welcome email to new subscriber
 * Returns a promise that resolves when email is sent
 */
export async function sendWelcomeEmail({ email, useCase }: SendWelcomeEmailParams) {
  const templateSlug = getWelcomeTemplateSlug(useCase)
  const template = getTemplate(templateSlug) || getTemplate('welcome')!

  await resend.emails.send({
    from: EMAIL_CONFIG.from,
    to: email,
    bcc: EMAIL_CONFIG.bcc,
    subject: template.subject,
    html: template.renderHtml({ email }),
    text: template.renderText({ email }),
    replyTo: EMAIL_CONFIG.replyTo,
  })

  console.log(`Welcome email (${templateSlug}) sent to ${email}`)
}

/**
 * Schedule follow-up email for subscriber
 * Sends 24 hours after welcome email
 */
export async function sendFollowUpEmail({ email, scheduledAt }: SendFollowUpEmailParams) {
  const template = getTemplate('follow-up')
  if (!template) {
    console.warn('Follow-up template not found')
    return
  }

  await resend.emails.send({
    from: EMAIL_CONFIG.from,
    to: email,
    subject: template.subject,
    html: template.renderHtml({ email }),
    text: template.renderText({ email }),
    replyTo: EMAIL_CONFIG.replyTo,
    scheduledAt: scheduledAt.toISOString(),
  })

  console.log(`Follow-up email scheduled for ${email} at ${scheduledAt.toISOString()}`)
}

/**
 * Add contact to Resend audience
 * Returns the contact ID if successful
 */
export async function addToAudience(email: string): Promise<string | null> {
  const audienceId = process.env.RESEND_SEGMENT_ID
  if (!audienceId) {
    console.warn('RESEND_SEGMENT_ID not configured')
    return null
  }

  try {
    const result = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })

    return result?.data?.id || null
  } catch (err) {
    console.error('Failed to add contact to Resend audience:', err)
    return null
  }
}

/**
 * Send welcome email immediately and schedule follow-up for 24h later
 * Runs in background, does not block
 */
export async function sendWelcomeSequence({ email, useCase }: SendWelcomeEmailParams) {
  try {
    // Send welcome email immediately
    await sendWelcomeEmail({ email, useCase })

    // Wait 2s then schedule follow-up for 24h from now
    await new Promise((r) => setTimeout(r, 2000))
    const followUpDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await sendFollowUpEmail({ email, scheduledAt: followUpDate })
  } catch (err) {
    console.error('Email sequence error:', err)
  }
}

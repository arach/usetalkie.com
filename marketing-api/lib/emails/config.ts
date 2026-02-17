/**
 * Email configuration and constants
 */

export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'Arach Tchoupani <arach@mail.usetalkie.com>',
  replyTo: 'arach@usetalkie.com',
  bcc: process.env.NOTIFY_EMAIL || 'notifs@usetalkie.com',
}

/**
 * Use case to template mapping
 * Determines which welcome email template to send based on user's use case
 */
export const MAC_USE_CASES = ['dictation', 'coding', 'workflows']

export function getWelcomeTemplateSlug(useCase?: string): 'welcome-mac' | 'welcome-ios' {
  return useCase && MAC_USE_CASES.includes(useCase) ? 'welcome-mac' : 'welcome-ios'
}

const TESTFLIGHT_URL = 'https://marketing.usetalkie.com/testflight?ref=welcome-email'
const MAC_DOWNLOAD_URL = 'https://usetalkie.com/dl?ref=welcome-email'
const QR_IMAGE_URL = 'https://marketing.usetalkie.com/images/testflight-qr.png'
const ICON_URL = 'https://usetalkie.com/talkie-icon.png'

export interface EmailTemplate {
  slug: string
  name: string
  description: string
  subject: string
  variables: string[]
  renderHtml: (vars: Record<string, string>) => string
  renderText: (vars: Record<string, string>) => string
}

// Shared mono style string for reuse
const mono = "font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace"

function emailShell(body: string) {
  return `<!DOCTYPE html>
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
            <td style="padding: 28px 32px 20px; text-align: center; border-bottom: 1px solid #222;">
              <img src="${ICON_URL}" alt="Talkie" width="40" height="40" style="border-radius: 10px;" />
              <h1 style="margin: 12px 0 0; color: #fff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; ${mono}; text-transform: uppercase;">TALKIE</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px 32px;">
${body}
              <p style="margin: 24px 0 0; color: #555; font-size: 13px; line-height: 1.6;">
                Questions or feedback? Just reply to this email - I read everything.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid #222; text-align: center;">
              <p style="margin: 0 0 6px; color: #555; font-size: 12px;">
                Arach, Founder of Talkie
              </p>
              <p style="margin: 0;">
                <a href="https://usetalkie.com" style="color: #10b981; text-decoration: none; ${mono}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">usetalkie.com</a>
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

function ctaButton(href: string, label: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 4px 0 24px;">
                    <a href="${href}" style="display: inline-block; background: #fff; color: #000; ${mono}; font-size: 11px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1.5px;">
                      ${label}
                    </a>
                  </td>
                </tr>
              </table>`
}

function secondaryButton(href: string, label: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 24px;">
                    <a href="${href}" style="display: inline-block; background: #fff; color: #000; ${mono}; font-size: 10px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1.5px;">
                      ${label}
                    </a>
                  </td>
                </tr>
              </table>`
}

function qrBlock() {
  return `<table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 24px;">
                    <p style="margin: 0 0 10px; color: #555; ${mono}; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Scan for TestFlight</p>
                    <img src="${QR_IMAGE_URL}" alt="TestFlight QR Code" width="120" height="120" style="border-radius: 8px;" />
                  </td>
                </tr>
              </table>`
}

function featureList(items: string[]) {
  const lis = items.map((i) => `                  <li>${i}</li>`).join('\n')
  return `<div style="background: #1a1a1a; border-radius: 10px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #fff; ${mono}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">What you get</p>
                <ul style="margin: 0; padding: 0 0 0 18px; color: #a1a1a1; font-size: 14px; line-height: 2;">
${lis}
                </ul>
              </div>`
}

// --- iOS Welcome ---

const welcomeIosTemplate: EmailTemplate = {
  slug: 'welcome-ios',
  name: 'Welcome - iOS',
  description: 'Sent when someone signs up via the iPhone/TestFlight CTA. Prioritizes TestFlight, includes Mac download as secondary.',
  subject: 'Welcome to Talkie - Your TestFlight is ready',
  variables: ['email'],
  renderHtml: () => emailShell(`
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Thanks for signing up! You're one of the first to get early access to Talkie - voice-to-text that actually works.
              </p>
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                This is super early, so any feedback is incredibly appreciated. Found a bug? Have an idea? Press <strong style="color: #10b981;">⌘K</strong> on the website or just reply to this email - I read everything and respond to everyone.
              </p>
              <p style="margin: 0 0 24px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Get the TestFlight beta on your iPhone and start dictating in seconds:
              </p>
              ${ctaButton(TESTFLIGHT_URL, 'Download TestFlight Beta')}
              ${qrBlock()}
              ${featureList([
                'Voice memos with fully local transcription',
                'Easy sync to iCloud and your Mac',
                'Beautiful keyboard with voice dictation',
                'Works with iPhone &amp; Apple Watch',
              ])}
              <div style="margin-top: 24px; padding: 16px; background: #1a1a1a; border-radius: 10px; text-align: center;">
                <p style="margin: 0 0 10px; color: #777; font-size: 13px;">Also available on Mac</p>
                ${secondaryButton(MAC_DOWNLOAD_URL, 'Download for Mac')}
              </div>
`),
  renderText: () => `Welcome to Talkie!

Thanks for signing up! You're one of the first to get early access to Talkie - voice-to-text that actually works.

Get the TestFlight beta on your iPhone:
${TESTFLIGHT_URL}

What you get:
- Voice memos with fully local transcription
- Easy sync to iCloud and your Mac
- Beautiful keyboard with voice dictation
- Works with iPhone & Apple Watch

Also available on Mac:
${MAC_DOWNLOAD_URL}

Questions or feedback? Just reply to this email - I read everything.

- Arach, Founder of Talkie
https://usetalkie.com`,
}

// --- Mac Welcome ---

const welcomeMacTemplate: EmailTemplate = {
  slug: 'welcome-mac',
  name: 'Welcome - Mac',
  description: 'Sent when someone signs up via the Mac download CTA. Prioritizes Mac download, includes TestFlight as secondary.',
  subject: 'Welcome to Talkie - Your download is ready',
  variables: ['email'],
  renderHtml: () => emailShell(`
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Thanks for signing up! You're one of the first to get early access to Talkie - voice-to-text that actually works.
              </p>
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                This is super early, so any feedback is incredibly appreciated. Found a bug? Have an idea? Press <strong style="color: #10b981;">⌘K</strong> on the website or just reply to this email - I read everything and respond to everyone.
              </p>
              <p style="margin: 0 0 24px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Download Talkie for Mac and start dictating in seconds:
              </p>
              ${ctaButton(MAC_DOWNLOAD_URL, 'Download Talkie for Mac')}
              ${featureList([
                'Local AI transcription - nothing leaves your device',
                'Works in any app with a global hotkey',
                'Smart paste - text goes where your cursor was',
                'Menu bar app - always one keystroke away',
              ])}
              <div style="margin-top: 24px; padding: 16px; background: #1a1a1a; border-radius: 10px; text-align: center;">
                <p style="margin: 0 0 10px; color: #777; font-size: 13px;">Take it mobile</p>
                ${secondaryButton(TESTFLIGHT_URL, 'Get iPhone TestFlight')}
                ${qrBlock()}
              </div>
`),
  renderText: () => `Welcome to Talkie!

Thanks for signing up! You're one of the first to get early access to Talkie - voice-to-text that actually works.

Download Talkie for Mac:
${MAC_DOWNLOAD_URL}

What you get:
- Local AI transcription - nothing leaves your device
- Works in any app with a global hotkey
- Smart paste - text goes where your cursor was
- Menu bar app - always one keystroke away

Take it mobile - get iPhone TestFlight:
${TESTFLIGHT_URL}

Questions or feedback? Just reply to this email - I read everything.

- Arach, Founder of Talkie
https://usetalkie.com`,
}

// --- Follow-up (24h after signup) ---

const followUpTemplate: EmailTemplate = {
  slug: 'follow-up',
  name: 'Follow-up (24h)',
  description: 'Sent 24 hours after signup. Asks for feedback and checks if setup went smoothly.',
  subject: 'How\'s Talkie working for you?',
  variables: ['email'],
  renderHtml: () => emailShell(`
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Hey! Just checking in - you signed up for Talkie yesterday and I wanted to make sure everything is working smoothly.
              </p>
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Have you had a chance to try it out? I'd genuinely love to hear how it's going - what's working, what's not, what you wish it did differently.
              </p>
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                If you ran into any issues getting set up, just reply to this email and I'll help you out personally.
              </p>
              <div style="background: #1a1a1a; border-radius: 10px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #fff; ${mono}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Quick links</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 6px 0;">
                      <a href="${MAC_DOWNLOAD_URL}" style="color: #10b981; text-decoration: none; font-size: 14px;">Download Talkie for Mac</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">
                      <a href="${TESTFLIGHT_URL}" style="color: #10b981; text-decoration: none; font-size: 14px;">Get iPhone TestFlight</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">
                      <a href="https://usetalkie.com/docs" style="color: #10b981; text-decoration: none; font-size: 14px;">Setup guide & docs</a>
                    </td>
                  </tr>
                </table>
              </div>
`),
  renderText: () => `How's Talkie working for you?

Hey! Just checking in - you signed up for Talkie yesterday and I wanted to make sure everything is working smoothly.

Have you had a chance to try it out? I'd genuinely love to hear how it's going - what's working, what's not, what you wish it did differently.

If you ran into any issues getting set up, just reply to this email and I'll help you out personally.

Quick links:
- Download Talkie for Mac: ${MAC_DOWNLOAD_URL}
- Get iPhone TestFlight: ${TESTFLIGHT_URL}
- Setup guide & docs: https://usetalkie.com/docs

- Arach, Founder of Talkie
https://usetalkie.com`,
}

// Keep the old 'welcome' slug as an alias for iOS (backwards compat with existing subscribe flow)
const welcomeLegacyTemplate: EmailTemplate = {
  ...welcomeIosTemplate,
  slug: 'welcome',
  name: 'Welcome (default)',
  description: 'Default welcome email - same as iOS variant. Used when platform is not specified.',
}

export const templates: EmailTemplate[] = [
  welcomeLegacyTemplate,
  welcomeIosTemplate,
  welcomeMacTemplate,
  followUpTemplate,
]

export function getTemplate(slug: string): EmailTemplate | undefined {
  return templates.find((t) => t.slug === slug)
}

export function getTemplateMetadata() {
  return templates.map(({ slug, name, description, subject, variables }) => ({
    slug,
    name,
    description,
    subject,
    variables,
  }))
}

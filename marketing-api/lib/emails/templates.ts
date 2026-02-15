const TESTFLIGHT_URL = 'https://marketing.usetalkie.com/testflight?ref=welcome-email'

export interface EmailTemplate {
  slug: string
  name: string
  description: string
  subject: string
  variables: string[]
  renderHtml: (vars: Record<string, string>) => string
  renderText: (vars: Record<string, string>) => string
}

const welcomeTemplate: EmailTemplate = {
  slug: 'welcome',
  name: 'Welcome Email',
  description: 'Sent to new subscribers after early access signup. Includes TestFlight download link.',
  subject: 'Welcome to Talkie - Your TestFlight is ready',
  variables: ['email'],
  renderHtml: () => `<!DOCTYPE html>
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
              <img src="https://usetalkie.com/talkie-icon.png" alt="Talkie" width="40" height="40" style="border-radius: 10px;" />
              <h1 style="margin: 12px 0 0; color: #fff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace; text-transform: uppercase;">TALKIE</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px 32px;">
              <p style="margin: 0 0 18px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Thanks for signing up! You're one of the first to get early access to Talkie - voice-to-text that actually works.
              </p>
              <p style="margin: 0 0 24px; color: #a1a1a1; font-size: 15px; line-height: 1.6;">
                Ready to try it? Download the TestFlight beta and start dictating in seconds:
              </p>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 4px 0 28px;">
                    <a href="${TESTFLIGHT_URL}" style="display: inline-block; background: #fff; color: #000; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace; font-size: 11px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1.5px;">
                      Download TestFlight Beta
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Feature list -->
              <div style="background: #1a1a1a; border-radius: 10px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #fff; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">What you get</p>
                <ul style="margin: 0; padding: 0 0 0 18px; color: #a1a1a1; font-size: 14px; line-height: 2;">
                  <li>Local AI transcription - nothing leaves your device</li>
                  <li>Works in any app with a global hotkey</li>
                  <li>Smart paste - text goes where your cursor was</li>
                  <li>iPhone &amp; Watch capture (coming soon)</li>
                </ul>
              </div>
              <p style="margin: 24px 0 0; color: #555; font-size: 13px; line-height: 1.6;">
                Questions or feedback? Just reply to this email - I read everything.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid #222; text-align: center;">
              <p style="margin: 0 0 6px; color: #555; font-size: 12px;">
                Arach · Founder of Talkie
              </p>
              <p style="margin: 0;">
                <a href="https://usetalkie.com" style="color: #10b981; text-decoration: none; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">usetalkie.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  renderText: () => `Welcome to Talkie!

Thanks for signing up! You're one of the first to get early access to Talkie - voice-to-text that actually works.

Ready to try it? Download the TestFlight beta:
${TESTFLIGHT_URL}

What you get:
• Local AI transcription - nothing leaves your device
• Works in any app with a global hotkey
• Smart paste - text goes where your cursor was
• iPhone & Watch capture (coming soon)

Questions or feedback? Just reply to this email - I read everything.

- Arach, Founder of Talkie
https://usetalkie.com`,
}

export const templates: EmailTemplate[] = [welcomeTemplate]

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

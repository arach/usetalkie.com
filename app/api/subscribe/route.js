import { Resend } from 'resend'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)

    // Handle already subscribed
    if (error.message?.includes('already exists')) {
      return Response.json({ success: true, message: 'Already subscribed' })
    }

    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

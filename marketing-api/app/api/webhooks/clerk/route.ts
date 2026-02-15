import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

interface ClerkWebhookEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  // Verify webhook signature
  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await request.text()

  let event: ClerkWebhookEvent
  try {
    const wh = new Webhook(webhookSecret)
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'user.created') {
      const primaryEmail = event.data.email_addresses[0]?.email_address?.toLowerCase()
      if (!primaryEmail) {
        return NextResponse.json({ received: true })
      }

      // Look up existing contact by email
      const existing = await db
        .select()
        .from(contacts)
        .where(eq(contacts.email, primaryEmail))
        .limit(1)

      if (existing.length > 0) {
        // Contact exists — promote to active
        await db
          .update(contacts)
          .set({
            status: 'active',
            clerkUserId: event.data.id,
            firstName: event.data.first_name || existing[0].firstName,
            lastName: event.data.last_name || existing[0].lastName,
            convertedAt: new Date(),
          })
          .where(eq(contacts.email, primaryEmail))
      } else {
        // New user from Clerk — insert as active
        await db.insert(contacts).values({
          email: primaryEmail,
          status: 'active',
          clerkUserId: event.data.id,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          source: 'clerk_signup',
          convertedAt: new Date(),
        })
      }
    }

    if (event.type === 'user.deleted') {
      const clerkUserId = event.data.id
      if (clerkUserId) {
        await db
          .update(contacts)
          .set({ status: 'churned' })
          .where(eq(contacts.clerkUserId, clerkUserId))
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

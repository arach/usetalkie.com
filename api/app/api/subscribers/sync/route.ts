import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isDevMode } from '@/lib/dev-auth'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function checkAuth() {
  if (isDevMode()) return true
  const { userId } = await auth()
  return !!userId
}

export async function POST() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_SEGMENT_ID

  if (!resendKey || !audienceId) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
  }

  try {
    const resend = new Resend(resendKey)
    const { data, error } = await resend.contacts.list({ audienceId })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch from Resend' }, { status: 500 })
    }

    const resendContacts = data?.data || []
    let imported = 0
    let updated = 0

    for (const contact of resendContacts) {
      const email = contact.email.toLowerCase().trim()

      const existing = await db
        .select({ id: contacts.id })
        .from(contacts)
        .where(eq(contacts.email, email))
        .limit(1)

      if (existing.length > 0) {
        await db
          .update(contacts)
          .set({
            resendContactId: contact.id,
            emailUnsubscribed: contact.unsubscribed,
          })
          .where(eq(contacts.email, email))
        updated++
      } else {
        await db.insert(contacts).values({
          email,
          status: 'contact',
          firstName: contact.first_name || null,
          lastName: contact.last_name || null,
          source: 'resend_import',
          resendContactId: contact.id,
          emailUnsubscribed: contact.unsubscribed,
          createdAt: new Date(contact.created_at),
        })
        imported++
      }
    }

    return NextResponse.json({ imported, updated, total: resendContacts.length })
  } catch (error) {
    console.error('Resend sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

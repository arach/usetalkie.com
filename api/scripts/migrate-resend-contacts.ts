/**
 * One-time migration script to import existing Resend contacts into the contacts DB.
 *
 * Usage:
 *   npx tsx scripts/migrate-resend-contacts.ts
 *
 * Required env vars:
 *   RESEND_API_KEY - Resend API key
 *   RESEND_SEGMENT_ID - Resend audience ID
 *   POSTGRES_URL - (prod only) set to use Vercel Postgres, unset for local PGlite
 */

import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { contacts } from '../lib/db/schema'

const INIT_SQL = `
DO $$ BEGIN
  CREATE TYPE contact_status AS ENUM ('contact', 'active', 'churned');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  status contact_status NOT NULL DEFAULT 'contact',
  clerk_user_id VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  use_case VARCHAR(255),
  source VARCHAR(255),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  resend_contact_id VARCHAR(255),
  email_unsubscribed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at TIMESTAMPTZ
);
`

async function createDb() {
  if (process.env.POSTGRES_URL) {
    const { sql } = require('@vercel/postgres')
    const { drizzle } = require('drizzle-orm/vercel-postgres')
    return drizzle(sql)
  } else {
    const { PGlite } = require('@electric-sql/pglite')
    const { drizzle } = require('drizzle-orm/pglite')
    const client = new PGlite('.pglite')
    await client.exec(INIT_SQL)
    return drizzle(client)
  }
}

async function main() {
  const resendKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_SEGMENT_ID

  if (!resendKey || !audienceId) {
    console.error('Missing RESEND_API_KEY or RESEND_SEGMENT_ID')
    process.exit(1)
  }

  const resend = new Resend(resendKey)
  const db = await createDb()

  console.log('Fetching contacts from Resend...')
  const { data, error } = await resend.contacts.list({ audienceId })

  if (error) {
    console.error('Failed to fetch Resend contacts:', error)
    process.exit(1)
  }

  const resendContacts = data?.data || []
  console.log(`Found ${resendContacts.length} contacts in Resend`)

  let imported = 0
  let skipped = 0

  for (const contact of resendContacts) {
    const email = contact.email.toLowerCase().trim()

    // Check if already exists
    const existing = await db
      .select({ id: contacts.id })
      .from(contacts)
      .where(eq(contacts.email, email))
      .limit(1)

    if (existing.length > 0) {
      // Update resend_contact_id if missing
      await db
        .update(contacts)
        .set({
          resendContactId: contact.id,
          emailUnsubscribed: contact.unsubscribed,
        })
        .where(eq(contacts.email, email))
      skipped++
      continue
    }

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

  console.log(`Done! Imported: ${imported}, Updated: ${skipped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

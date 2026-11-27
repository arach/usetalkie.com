import * as schema from './schema'

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

CREATE TABLE IF NOT EXISTS feedback_threads (
  id VARCHAR(12) PRIMARY KEY,
  sender_email VARCHAR(255) NOT NULL,
  feedback VARCHAR(5000) NOT NULL,
  url VARCHAR(500),
  user_agent VARCHAR(500),
  replied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "intents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"intent" varchar(255) NOT NULL,
	"message" text,
	"source" varchar(255),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "intents_email_idx" ON "intents" USING btree ("email");
CREATE INDEX IF NOT EXISTS "intents_intent_idx" ON "intents" USING btree ("intent");
CREATE INDEX IF NOT EXISTS "intents_created_at_idx" ON "intents" USING btree ("created_at");
`

function createDb() {
  if (process.env.NODE_ENV === 'production') {
    const { sql } = require('@vercel/postgres') as typeof import('@vercel/postgres')
    const { drizzle } = require('drizzle-orm/vercel-postgres') as typeof import('drizzle-orm/vercel-postgres')
    return drizzle(sql, { schema })
  } else {
    const { PGlite } = require('@electric-sql/pglite') as typeof import('@electric-sql/pglite')
    const { drizzle } = require('drizzle-orm/pglite') as typeof import('drizzle-orm/pglite')
    const client = new PGlite('.pglite')
    client.exec(INIT_SQL).catch((err: Error) =>
      console.error('PGlite schema init failed:', err)
    )
    return drizzle(client, { schema })
  }
}

// Lazy-initialize db only when accessed (prevents build-time connections)
let _db: ReturnType<typeof createDb> | null = null

export function getDb() {
  if (!_db) {
    _db = createDb()
  }
  return _db
}

// Legacy export for backward compatibility (lazy-initialized)
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof createDb>]
  }
})

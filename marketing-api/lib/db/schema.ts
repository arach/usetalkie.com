import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const contactStatusEnum = pgEnum('contact_status', [
  'contact',
  'active',
  'churned',
])

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    status: contactStatusEnum('status').notNull().default('contact'),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).unique(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    useCase: varchar('use_case', { length: 255 }),
    source: varchar('source', { length: 255 }),
    utmSource: varchar('utm_source', { length: 255 }),
    utmMedium: varchar('utm_medium', { length: 255 }),
    utmCampaign: varchar('utm_campaign', { length: 255 }),
    resendContactId: varchar('resend_contact_id', { length: 255 }),
    emailUnsubscribed: boolean('email_unsubscribed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    convertedAt: timestamp('converted_at', { withTimezone: true }),
  },
  (table) => [
    index('contacts_email_idx').on(table.email),
    index('contacts_clerk_user_id_idx').on(table.clerkUserId),
    index('contacts_status_idx').on(table.status),
    index('contacts_created_at_idx').on(table.createdAt),
  ]
)

export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert

// Feedback threads for reply routing
export const feedbackThreads = pgTable(
  'feedback_threads',
  {
    id: varchar('id', { length: 12 }).primaryKey(), // Short unique ID (e.g., 'a7b2c9d4e5f6')
    senderEmail: varchar('sender_email', { length: 255 }).notNull(),
    feedback: varchar('feedback', { length: 5000 }).notNull(),
    url: varchar('url', { length: 500 }),
    userAgent: varchar('user_agent', { length: 500 }),
    replied: boolean('replied').notNull().default(false), // Track if user replied
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('feedback_threads_created_at_idx').on(table.createdAt),
    index('feedback_threads_replied_idx').on(table.replied),
  ]
)

export type FeedbackThread = typeof feedbackThreads.$inferSelect
export type NewFeedbackThread = typeof feedbackThreads.$inferInsert

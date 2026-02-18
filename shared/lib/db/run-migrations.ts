#!/usr/bin/env node
/**
 * Run database migrations - Explicit migration runner
 * - Tracks applied migrations
 * - Only runs pending ones
 * - ALERTS on failures (exits with code 1)
 * - Gracefully handles "no migrations" case
 */

import { drizzle } from 'drizzle-orm/vercel-postgres'
import { migrate } from 'drizzle-orm/vercel-postgres/migrator'
import { sql } from '@vercel/postgres'
import * as fs from 'fs'
import * as path from 'path'

async function runMigrations() {
  console.log('🔄 Running database migrations...')

  // Skip if no database URL (local dev without postgres)
  if (!process.env.POSTGRES_URL && process.env.NODE_ENV !== 'production') {
    console.log('⚠️  No POSTGRES_URL found - skipping migrations (using PGlite for local dev)')
    console.log('   Migrations will run automatically on first deployment')
    return
  }

  // Check if migrations folder exists
  const migrationsPath = path.join(process.cwd(), 'drizzle')
  if (!fs.existsSync(migrationsPath)) {
    console.log('✅ No migrations folder - database schema is up to date')
    return
  }

  // Count migration files
  const migrationFiles = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'))
  if (migrationFiles.length === 0) {
    console.log('✅ No migration files - database schema is up to date')
    return
  }

  console.log(`📋 Found ${migrationFiles.length} migration file(s)`)
  console.log('🔍 Checking which migrations need to run...')

  try {
    const db = drizzle(sql)

    // Drizzle's migrate() automatically:
    // - Tracks applied migrations in __drizzle_migrations table
    // - Only runs pending migrations
    // - Is idempotent (safe to run multiple times)
    await migrate(db, { migrationsFolder: './drizzle' })

    console.log('✅ Database migrations complete - all up to date!')
  } catch (error: any) {
    // Check if it's a "no migrations to run" message (not an error)
    if (error.message?.includes('No migrations')) {
      console.log('✅ Database already up to date - no pending migrations')
      return
    }

    // ALERT: Actual migration failure
    console.error('\n❌ MIGRATION FAILED!')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('Error:', error.message || error)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('\nThis is a critical error. Database may be in an inconsistent state.')
    console.error('Please review the error above and fix before deploying.\n')
    process.exit(1)
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ UNEXPECTED ERROR!')
    console.error(error)
    process.exit(1)
  })

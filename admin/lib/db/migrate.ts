import { drizzle } from 'drizzle-orm/vercel-postgres'
import { migrate } from 'drizzle-orm/vercel-postgres/migrator'
import { sql } from '@vercel/postgres'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Smart migration runner
 * - Tracks which migrations have been applied (using Drizzle's __drizzle_migrations table)
 * - Only runs new migrations
 * - Polite output
 */
async function runMigrations() {
  // Skip if no database URL (local dev without postgres)
  if (!process.env.POSTGRES_URL && process.env.NODE_ENV !== 'production') {
    console.log('ℹ️  No POSTGRES_URL found, skipping migrations (using PGlite)')
    process.exit(0)
  }

  // Check if migrations folder exists
  const migrationsPath = path.join(process.cwd(), 'drizzle')
  if (!fs.existsSync(migrationsPath)) {
    console.log('ℹ️  No migrations folder found, nothing to run')
    process.exit(0)
  }

  // Count migration files
  const migrationFiles = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'))
  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found, nothing to run')
    process.exit(0)
  }

  console.log(`🔍 Checking for pending migrations... (${migrationFiles.length} total)`)

  try {
    const db = drizzle(sql)

    // Drizzle's migrate() automatically tracks applied migrations
    // and only runs pending ones
    await migrate(db, { migrationsFolder: './drizzle' })

    console.log('✅ Database is up to date!')
    process.exit(0)
  } catch (error: any) {
    // Check if it's a "no migrations to run" situation (not an error)
    if (error.message?.includes('No migrations')) {
      console.log('✅ Database is already up to date!')
      process.exit(0)
    }

    console.error('❌ Migration failed:', error.message || error)
    process.exit(1)
  }
}

runMigrations()

import { db } from './index'
import { sql } from 'drizzle-orm'

export interface MigrationRecord {
  id: number
  hash: string
  created_at: number
}

/**
 * Get list of applied migrations from Drizzle's tracking table
 */
export async function getAppliedMigrations(): Promise<MigrationRecord[]> {
  try {
    // Query Drizzle's internal migrations table
    const result = await db.execute(sql`
      SELECT id, hash, created_at
      FROM __drizzle_migrations
      ORDER BY created_at DESC
    `)

    return result.rows as unknown as MigrationRecord[]
  } catch (error) {
    // Table might not exist yet if no migrations have run
    console.error('Failed to fetch migrations:', error)
    return []
  }
}

/**
 * Get migration status summary
 */
export async function getMigrationStatus() {
  const applied = await getAppliedMigrations()

  return {
    totalApplied: applied.length,
    lastMigration: applied[0] || null,
    migrations: applied,
  }
}

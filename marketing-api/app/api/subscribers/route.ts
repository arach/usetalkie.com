import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isDevMode } from '@/lib/dev-auth'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq, ilike, sql, desc, count } from 'drizzle-orm'

async function checkAuth() {
  if (isDevMode()) return true
  const { userId } = await auth()
  return !!userId
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Build query
    let query = db.select().from(contacts).$dynamic()

    if (search) {
      query = query.where(ilike(contacts.email, `%${search}%`))
    }

    if (status && ['contact', 'active', 'churned'].includes(status)) {
      query = query.where(eq(contacts.status, status as 'contact' | 'active' | 'churned'))
    }

    const rows = await query.orderBy(desc(contacts.createdAt))

    // Stats aggregation
    const stats = await db
      .select({
        status: contacts.status,
        count: count(),
      })
      .from(contacts)
      .groupBy(contacts.status)

    const totalContacts = stats.reduce((sum, s) => sum + s.count, 0)
    const statusCounts = Object.fromEntries(stats.map((s) => [s.status, s.count]))

    return NextResponse.json({
      contacts: rows,
      stats: {
        total: totalContacts,
        contact: statusCounts.contact || 0,
        active: statusCounts.active || 0,
        churned: statusCounts.churned || 0,
      },
    })
  } catch (error) {
    console.error('Failed to list subscribers:', error)
    return NextResponse.json({ error: 'Failed to list subscribers' }, { status: 500 })
  }
}

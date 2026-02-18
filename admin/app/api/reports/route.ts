import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isDevMode } from '@/lib/dev-auth'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { ilike, desc, sql } from 'drizzle-orm'

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

    // Build query
    let query = db.select().from(reports).$dynamic()

    if (search) {
      query = query.where(
        sql`${reports.id} ILIKE ${`%${search}%`} OR ${reports.userDescription} ILIKE ${`%${search}%`}`
      )
    }

    const allReports = await query.orderBy(desc(reports.createdAt))

    // Calculate stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = {
      total: allReports.length,
      withErrors: allReports.filter(
        (r) => r.contextInfo && (r.contextInfo as any).lastError
      ).length,
      today: allReports.filter(
        (r) => new Date(r.createdAt) >= today
      ).length,
    }

    return NextResponse.json({
      reports: allReports,
      stats,
    })
  } catch (error) {
    console.error('Failed to list reports:', error)
    return NextResponse.json(
      { error: 'Failed to list reports' },
      { status: 500 }
    )
  }
}

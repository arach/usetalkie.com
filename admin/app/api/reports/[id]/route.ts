import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isDevMode } from '@/lib/dev-auth'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function checkAuth() {
  if (isDevMode()) return true
  const { userId } = await auth()
  return !!userId
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const report = await db
      .select()
      .from(reports)
      .where(eq(reports.id, params.id))
      .limit(1)

    if (report.length === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json(report[0])
  } catch (error) {
    console.error('Failed to get report:', error)
    return NextResponse.json(
      { error: 'Failed to get report' },
      { status: 500 }
    )
  }
}

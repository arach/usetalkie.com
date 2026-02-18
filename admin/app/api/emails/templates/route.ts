import { NextResponse } from 'next/server'
import { getTemplateMetadata } from '@/lib/emails/templates'

export async function GET() {
  return NextResponse.json({ templates: getTemplateMetadata() })
}

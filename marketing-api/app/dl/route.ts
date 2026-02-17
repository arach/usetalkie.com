import { NextRequest, NextResponse } from 'next/server'

const GITHUB_DMG_URL =
  'https://github.com/arach/usetalkie.com/releases/latest/download/Talkie.dmg'

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref') || 'direct'

  return NextResponse.redirect(GITHUB_DMG_URL, {
    status: 302,
    headers: {
      'X-Download-Source': ref,
    },
  })
}

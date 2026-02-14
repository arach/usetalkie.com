import { NextRequest, NextResponse } from 'next/server'

const TESTFLIGHT_URL = 'https://testflight.apple.com/join/B5Dmg9M8'

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref')

  if (ref) {
    console.log(`TestFlight redirect: ref=${ref}`)
  }

  return NextResponse.redirect(TESTFLIGHT_URL, 302)
}

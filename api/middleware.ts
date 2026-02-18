import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/subscribe(.*)',
  '/testflight(.*)',
  '/api/testflight(.*)',
  '/api/webhooks/clerk(.*)',
])

function devMiddleware(request: NextRequest) {
  return NextResponse.next()
}

// In development, bypass Clerk entirely for fast local iteration.
// NODE_ENV is set by Next.js itself — production builds always use 'production',
// so this cannot be activated in prod even if other env vars are tampered with.
const handler = process.env.NODE_ENV === 'development'
  ? devMiddleware
  : clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect()
      }
    })

export default handler

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

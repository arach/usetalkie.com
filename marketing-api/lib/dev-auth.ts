/**
 * Dev Auth Bypass
 *
 * Allows bypassing Clerk authentication in local development.
 * This is TAMPER-PROOF in production:
 * - Only activates when NODE_ENV === 'development' (set by Next.js, not user-configurable in prod builds)
 * - Next.js production builds (`next build` + `next start`) always set NODE_ENV to 'production'
 * - Vercel deployments always have NODE_ENV='production'
 * - Even if someone manually sets BYPASS_AUTH=true in prod, it won't work without NODE_ENV=development
 */

const DEV_USER = {
  firstName: 'Dev',
  lastName: 'Admin',
  email: 'dev@localhost',
  imageUrl: '',
  userId: 'dev_local_user',
} as const

export function isDevMode(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function getDevUser() {
  return DEV_USER
}

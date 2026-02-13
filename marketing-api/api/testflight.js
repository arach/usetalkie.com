/**
 * TestFlight Redirect
 * Redirects to Apple TestFlight with optional tracking
 *
 * GET /testflight - Redirects to TestFlight
 * GET /testflight?ref=email - Track source
 */

const TESTFLIGHT_URL = 'https://testflight.apple.com/join/B5Dmg9M8'

export default async function handler(req, res) {
  const { ref } = req.query

  // Optional: Log for analytics
  if (ref) {
    console.log(`TestFlight redirect: ref=${ref}, time=${new Date().toISOString()}`)
  }

  // Redirect to TestFlight
  res.redirect(302, TESTFLIGHT_URL)
}

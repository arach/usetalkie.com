/**
 * Analytics utilities for tracking conversions and user behavior
 * Uses Google Analytics 4 (gtag)
 */

/**
 * Check if analytics should be disabled
 * Disables if:
 * - localStorage flag is set: localStorage.setItem('disable_analytics', 'true')
 * - URL has ?notrack=1 parameter
 * - Running on localhost (development)
 */
function isTrackingDisabled() {
  if (typeof window === 'undefined') return true

  // Check localStorage flag
  try {
    if (localStorage.getItem('disable_analytics') === 'true') {
      return true
    }
  } catch (e) {
    // localStorage might be disabled
  }

  // Check URL parameter
  const params = new URLSearchParams(window.location.search)
  if (params.get('notrack') === '1') {
    return true
  }

  // Check if localhost/development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return true
  }

  return false
}

// Ensure gtag is available and tracking is enabled
const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag && !isTrackingDisabled()) {
    window.gtag(...args)
  }
}

/**
 * Track a custom event
 * @param {string} eventName - The event name
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params)
}

// ============================================
// CONVERSION EVENTS
// ============================================

/**
 * Track email signup (lead generation)
 * @param {string} useCase - Optional use case selected
 * @param {string} platform - Platform intent: 'mac', 'iphone', 'watch', 'general'
 * @param {string} source - Where signup occurred: 'hero', 'pricing', 'footer', 'about', etc.
 */
export function trackSignup(useCase = null, platform = 'general', source = 'unknown') {
  trackEvent('generate_lead', {
    event_category: 'engagement',
    event_label: 'early_access_signup',
    use_case: useCase,
    platform,
    source,
  })
  // Platform-specific event for easier filtering in GA
  trackEvent(`signup_${platform}`, {
    event_category: 'signup',
    event_label: source,
    use_case: useCase,
  })
  // Also track as conversion
  trackEvent('conversion', {
    send_to: 'G-EP7F8TC801',
    event_category: 'signup',
    platform,
  })
}

/**
 * Track TestFlight click
 * @param {string} source - Where the click originated: 'email', 'website', etc.
 */
export function trackTestFlightClick(source = 'unknown') {
  trackEvent('testflight_click', {
    event_category: 'engagement',
    event_label: source,
  })
}

/**
 * Track download button click
 * @param {string} version - App version being downloaded
 * @param {string} source - Where the click originated (hero, cta, etc)
 */
export function trackDownload(version, source = 'unknown') {
  trackEvent('file_download', {
    event_category: 'engagement',
    event_label: 'mac_app_download',
    file_name: `Talkie-${version}.dmg`,
    source,
  })
}

/**
 * Track video play
 * @param {string} videoName - Name of the video
 * @param {number} duration - Video duration in seconds
 */
export function trackVideoPlay(videoName, duration = 0) {
  trackEvent('video_start', {
    event_category: 'engagement',
    event_label: videoName,
    video_duration: duration,
  })
}

/**
 * Track video completion
 * @param {string} videoName - Name of the video
 * @param {number} percentWatched - Percentage of video watched
 */
export function trackVideoProgress(videoName, percentWatched) {
  trackEvent('video_progress', {
    event_category: 'engagement',
    event_label: videoName,
    percent_watched: percentWatched,
  })
}

// ============================================
// ENGAGEMENT EVENTS
// ============================================

/**
 * Track scroll depth
 * @param {number} percent - Scroll depth percentage (25, 50, 75, 100)
 */
export function trackScrollDepth(percent) {
  trackEvent('scroll', {
    event_category: 'engagement',
    event_label: `${percent}%`,
    percent_scrolled: percent,
  })
}

/**
 * Track CTA click
 * @param {string} ctaName - Name/location of the CTA
 * @param {string} destination - Where the CTA leads
 */
export function trackCTAClick(ctaName, destination) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    destination,
  })
}

/**
 * Track page section view (when section enters viewport)
 * @param {string} sectionName - Name of the section
 */
export function trackSectionView(sectionName) {
  trackEvent('section_view', {
    event_category: 'engagement',
    event_label: sectionName,
  })
}

/**
 * Track external link click
 * @param {string} url - The external URL
 * @param {string} linkText - Text of the link
 */
export function trackExternalLink(url, linkText) {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: linkText,
    link_url: url,
  })
}

/**
 * Track feature tab selection
 * @param {string} tabName - Name of the selected tab
 */
export function trackFeatureTab(tabName) {
  trackEvent('select_content', {
    event_category: 'engagement',
    content_type: 'feature_tab',
    item_id: tabName,
  })
}

// ============================================
// UTM TRACKING
// ============================================

/**
 * Get UTM parameters from URL
 * @returns {object} UTM parameters
 */
export function getUTMParams() {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

/**
 * Store UTM params in sessionStorage for attribution
 */
export function captureUTMParams() {
  if (typeof window === 'undefined') return

  const utmParams = getUTMParams()
  const hasUTM = Object.values(utmParams).some(v => v)

  if (hasUTM) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams))
  }
}

/**
 * Get stored UTM params
 * @returns {object} Stored UTM parameters
 */
export function getStoredUTMParams() {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(sessionStorage.getItem('utm_params') || '{}')
  } catch {
    return {}
  }
}

// ============================================
// ANALYTICS CONTROL (for development/testing)
// ============================================

/**
 * Disable analytics tracking
 * Run in browser console: window.disableAnalytics()
 */
export function disableAnalytics() {
  if (typeof window === 'undefined') return
  localStorage.setItem('disable_analytics', 'true')
  console.log('✅ Analytics disabled. Refresh the page for this to take effect.')
}

/**
 * Enable analytics tracking
 * Run in browser console: window.enableAnalytics()
 */
export function enableAnalytics() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('disable_analytics')
  console.log('✅ Analytics enabled. Refresh the page for this to take effect.')
}

/**
 * Check if analytics is currently disabled
 * Run in browser console: window.isAnalyticsDisabled()
 */
export function checkAnalyticsStatus() {
  const disabled = isTrackingDisabled()
  console.log(`Analytics tracking is ${disabled ? '🔴 DISABLED' : '🟢 ENABLED'}`)
  return disabled
}

// Expose functions globally for easy access in browser console
if (typeof window !== 'undefined') {
  window.disableAnalytics = disableAnalytics
  window.enableAnalytics = enableAnalytics
  window.isAnalyticsDisabled = checkAnalyticsStatus
}

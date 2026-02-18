/**
 * Centralized feature flags for all Talkie apps
 * Used by: usetalkie.com (main site) and marketing-api
 */

export const FEATURES = {
  // Product features
  SHOW_AGENTS: false,           // Talkie for Agents product

  // Documentation
  SHOW_TAILSCALE_DOCS: false,   // Tailscale setup guide

  // Admin/internal
  SHOW_MIGRATION_STATUS: true,  // Show migration info in admin
}

/**
 * Check if a feature is enabled
 * @param {keyof FEATURES} feature - Feature flag name
 * @returns {boolean}
 */
export function isEnabled(feature) {
  return FEATURES[feature] ?? false
}

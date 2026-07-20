/**
 * Canonical external product destinations.
 *
 * Keep store identities here so CTAs, QR codes, and redirect routes cannot
 * drift onto retired listings independently.
 */
export const TALKIE_PHONE_APP = Object.freeze({
  name: 'Talkie Phone',
  appStoreId: '6772218709',
  appStoreUrl: 'https://apps.apple.com/us/app/talkie-phone/id6772218709',
})

export const TALKIE_LICENSE = Object.freeze({
  price: 39,
  currency: 'USD',
  displayPrice: '$39',
  billingLabel: 'one-time',
})

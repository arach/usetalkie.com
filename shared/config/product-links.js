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
  displayPrice: 'Free',
})

/**
 * Canonical commercial plan for the Mac app.
 *
 * The current Mac build does not start or enforce a trial. Keep this object
 * in the planned state until checkout, license delivery, and app enforcement
 * are live and tested together.
 */
export const TALKIE_MAC_OFFER = Object.freeze({
  status: 'planned',
  statusLabel: 'Planned paid offer',
  currentBuildLabel: 'Current free build',
  trialDays: 7,
  trialLabel: '7-day free trial',
  trialStartLabel: 'Starts after the first successful dictation',
  trialRequirementsLabel: 'No Talkie account or payment card to start',
  price: 39,
  currency: 'USD',
  displayPrice: '$39',
  billingLabel: 'one-time',
  deviceLimit: 2,
  deviceLabel: 'Use on up to two Macs',
  updatesLabel: 'Updates for the licensed major version',
  expiryLabel: 'New dictation stops after the trial until you buy a license',
  dataAccessLabel: 'Existing recordings, transcripts, and exports stay available',
  automaticChargeLabel: 'No automatic charge',
})

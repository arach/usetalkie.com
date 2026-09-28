import { metadata as downloadMetadata } from '../downloads/page'

export { default } from '../downloads/page'

// Keep the legacy alias out of the index while sharing canonical page metadata.
export const metadata = {
  ...downloadMetadata,
  robots: { index: false, follow: true },
}

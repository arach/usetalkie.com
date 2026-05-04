// Presets for the <VersionCompare preset="..."> blog component.
//
// MDX-RSC can't evaluate complex JSX expressions in attributes (it parses
// `versions={[...]}` but doesn't safely evaluate the array of object
// literals through to render). Keeping the data here as plain JS, then
// referenced by string key from MDX, sidesteps that limitation while
// keeping the post readable.

const ROOT = '/blog/redesign'

const PRESETS = {
  'hero-before-after': {
    label: 'hero · before / after',
    versions: [
      {
        label: 'Before — donor v1',
        light: `${ROOT}/donor-light-fold.png`,
        dark: `${ROOT}/donor-dark-fold.png`,
        caption: 'rotating device key, flat hero',
      },
      {
        label: 'After — v4 panoramic',
        light: `${ROOT}/v4-amber-light-fold.png`,
        dark: `${ROOT}/v4-amber-dark-fold.png`,
        caption: 'one chassis, three wired bays',
      },
    ],
  },

  'v2-diagnosis': {
    label: 'diagnosis · v2 in both modes',
    versions: [
      {
        label: 'v2 oscilloscope',
        light: `${ROOT}/v2-light-fold.png`,
        dark: `${ROOT}/v2-dark-fold.png`,
        caption: 'dark pops, light goes flat',
      },
    ],
  },

  'round-1-paths': {
    label: 'round 1 · two parallel spikes',
    versions: [
      {
        label: 'Path A — amber chromatic',
        light: `${ROOT}/path-a-light-fold.png`,
        dark: `${ROOT}/path-a-dark-fold.png`,
        caption: 'warm trace, same architecture',
      },
      {
        label: 'Path B — instruments-as-objects',
        light: `${ROOT}/path-b-light-fold.png`,
        dark: `${ROOT}/path-b-dark-fold.png`,
        caption: 'dark chassis in both themes',
      },
    ],
  },

  'round-2-syntheses': {
    label: 'round 2 · three parallel syntheses',
    versions: [
      {
        label: 'v3 — structured',
        light: `${ROOT}/v3-light-fold.png`,
        dark: `${ROOT}/v3-dark-fold.png`,
        caption: 'central card, screenshots flank',
      },
      {
        label: 'v4 — panoramic',
        light: `${ROOT}/v4-light-fold.png`,
        dark: `${ROOT}/v4-dark-fold.png`,
        caption: 'one chassis, three wired bays',
      },
      {
        label: 'v5 — kitchen sink',
        light: `${ROOT}/v5-light-fold.png`,
        dark: `${ROOT}/v5-dark-fold.png`,
        caption: 'too many ideas at half-strength',
      },
    ],
  },

  'palette-pivot': {
    label: 'palette pivot · v4 green-only vs v4 amber/green',
    versions: [
      {
        label: 'v4 — symmetric (green both modes)',
        light: `${ROOT}/v4-light-fold.png`,
        dark: `${ROOT}/v4-dark-fold.png`,
        caption: 'green in light feels recolored',
      },
      {
        label: 'v4 — asymmetric (final)',
        light: `${ROOT}/v4-amber-light-fold.png`,
        dark: `${ROOT}/v4-amber-dark-fold.png`,
        caption: 'each mode is its own room',
      },
    ],
  },
}

export default PRESETS

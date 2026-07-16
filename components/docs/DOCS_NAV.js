import { FEATURES } from '../../shared/config/features'

/**
 * Single source of truth for the v2 docs navigation.
 *
 * Consumed by:
 *   - components/docs/DocsLayout.jsx  (sidebar + prev/next)
 *   - components/docs/DocsIndexPage.jsx  (section grid)
 *
 * Sub-page agents may import { DOCS_NAV, ALL_DOCS } if they need to
 * derive ordering or sibling slugs, but the canonical contract is the
 * <DocsLayout /> wrapper — pages should not duplicate this list.
 */

export const SHOW_TAILSCALE_DOCS = FEATURES.SHOW_TAILSCALE_DOCS

export const DOCS_NAV = [
  {
    label: 'Getting Started',
    items: [
      {
        slug: 'overview',
        title: 'Overview',
        description: 'What Talkie is and how the pieces fit.',
        href: '/docs/overview',
      },
      {
        slug: 'architecture',
        title: 'Architecture',
        description: 'Multi-process design — Talkie, Agent, Engine, Server.',
        href: '/docs/architecture',
      },
      {
        slug: 'lifecycle',
        title: 'Lifecycle',
        description: 'What happens to a recording, phase by phase.',
        href: '/docs/lifecycle',
      },
    ],
  },
  {
    label: 'Developer',
    items: [
      {
        slug: 'cli',
        title: 'CLI',
        description: 'Command-line access to memos, search, and workflows.',
        href: '/docs/cli',
      },
      {
        slug: 'workflows',
        title: 'Workflows',
        description: 'Automated pipelines, step types, template variables.',
        href: '/docs/workflows',
      },
      {
        slug: 'extensibility',
        title: 'Extensibility',
        description: 'Webhooks, integrations, and custom plug-in surfaces.',
        href: '/docs/extensibility',
      },
    ],
  },
  {
    label: 'Data & Setup',
    items: [
      {
        slug: 'data',
        title: 'Data',
        description: 'Where your recordings live, formats, and exports.',
        href: '/docs/data',
      },
      {
        slug: 'bridge-setup',
        title: 'Bridge Setup',
        description: 'Local TalkieServer for iPhone connectivity.',
        href: '/docs/bridge-setup',
      },
      {
        slug: 'tailscale',
        title: 'Tailscale',
        description: 'Secure tunnel between your devices.',
        href: '/docs/tailscale',
        hidden: !SHOW_TAILSCALE_DOCS,
      },
    ],
  },
]

/**
 * Flat ordered list of every doc page in sidebar order, with hidden
 * pages filtered out. Used for prev/next footer navigation and for the
 * index page grid.
 */
export const ALL_DOCS = DOCS_NAV.flatMap((group) =>
  group.items
    .filter((item) => !item.hidden)
    .map((item) => ({ ...item, section: group.label }))
)

/**
 * Find the entry for a given slug. Returns `undefined` for unknown slugs.
 */
export function findDoc(slug) {
  return ALL_DOCS.find((d) => d.slug === slug)
}

/**
 * Resolve previous/next sibling docs in sidebar order. Either may be
 * `null` if the page is at an edge.
 */
export function siblingDocs(slug) {
  const idx = ALL_DOCS.findIndex((d) => d.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? ALL_DOCS[idx - 1] : null,
    next: idx < ALL_DOCS.length - 1 ? ALL_DOCS[idx + 1] : null,
  }
}

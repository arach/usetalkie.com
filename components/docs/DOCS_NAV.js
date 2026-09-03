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
        sections: [
          { id: 'philosophy', title: 'Philosophy' },
          { id: 'design-principles', title: 'Design Principles' },
          { id: 'local-first', title: 'Local-First' },
          { id: 'multi-process', title: 'Multi-Process' },
          { id: 'communication', title: 'Communication' },
        ],
      },
      {
        slug: 'architecture',
        title: 'Architecture',
        description: 'Multi-process design — Talkie, Agent, and the iOS bridge.',
        href: '/docs/architecture',
        sections: [
          { id: 'system-overview', title: 'System Overview' },
          { id: 'components', title: 'Components' },
          { id: 'models', title: 'Models' },
          { id: 'xpc', title: 'XPC' },
          { id: 'lifecycle', title: 'Lifecycle' },
        ],
      },
      {
        slug: 'lifecycle',
        title: 'Lifecycle',
        description: 'What happens to a recording, phase by phase.',
        href: '/docs/lifecycle',
        sections: [
          { id: 'overview', title: 'Overview' },
          { id: 'dictation-lifecycle', title: 'Dictation' },
          { id: 'memo-lifecycle', title: 'Memos' },
          { id: 'extension-points', title: 'Extension Points' },
        ],
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
        sections: [
          { id: 'install', title: 'Installation' },
          { id: 'agent-access', title: 'Agent Access' },
          { id: 'commands', title: 'Commands' },
          { id: 'agents', title: 'For Agents' },
        ],
      },
      {
        slug: 'workflows',
        title: 'Workflows',
        description: 'Automated pipelines, step types, template variables.',
        href: '/docs/workflows',
        sections: [
          { id: 'what-are-workflows', title: 'Overview' },
          { id: 'anatomy', title: 'Anatomy' },
          { id: 'step-types', title: 'Step Types' },
          { id: 'template-variables', title: 'Variables' },
          { id: 'llm-providers', title: 'LLM Providers' },
          { id: 'execution', title: 'Execution' },
        ],
      },
      {
        slug: 'extensibility',
        title: 'Extensibility',
        description: 'Webhooks, integrations, and custom plug-in surfaces.',
        href: '/docs/extensibility',
        sections: [
          { id: 'integration-points', title: 'Integrations' },
          { id: 'webhooks', title: 'Webhooks' },
          { id: 'custom-workflows', title: 'Custom Workflows' },
          { id: 'file-based-context', title: 'File Context' },
        ],
      },
      {
        slug: 'api',
        title: 'API Reference',
        description: 'HTTP endpoints, URL schemes, AppleScript, and Shortcuts.',
        href: '/docs/api',
        sections: [
          { id: 'talkieserver', title: 'TalkieServer' },
          { id: 'url-schemes', title: 'URL Schemes' },
          { id: 'applescript', title: 'AppleScript' },
          { id: 'shortcuts', title: 'Shortcuts' },
        ],
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
        sections: [
          { id: 'philosophy', title: 'Philosophy' },
          { id: 'locations', title: 'Locations' },
          { id: 'models', title: 'Models' },
          { id: 'exports', title: 'Exports' },
          { id: 'sync', title: 'Sync' },
        ],
      },
      {
        slug: 'bridge-setup',
        title: 'Bridge Setup',
        description: 'Local TalkieServer for iPhone connectivity.',
        href: '/docs/bridge-setup',
        sections: [
          { id: 'what-is-talkieserver', title: 'TalkieServer' },
          { id: 'prerequisites', title: 'Prerequisites' },
          { id: 'installation', title: 'Installation' },
          { id: 'troubleshooting', title: 'Troubleshooting' },
        ],
      },
      {
        slug: 'tailscale',
        title: 'Tailscale',
        description: 'Secure tunnel between your devices.',
        href: '/docs/tailscale',
        hidden: !SHOW_TAILSCALE_DOCS,
        sections: [
          { id: 'why-tailscale', title: 'Why Tailscale' },
          { id: 'how-it-works', title: 'How It Works' },
          { id: 'setup', title: 'Setup' },
          { id: 'troubleshooting', title: 'Troubleshooting' },
        ],
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

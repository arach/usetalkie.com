# Integration Pages — Design Pass (report only)

**Scope:** Reusable page structure + component shape for SEO/AEO "Talkie + X" integration pages
(Obsidian, Claude, GitHub, Linear, Notion, Raycast, and future partners).
**Status:** Proposal. No code changed. All recommendations map onto the existing `/workflows` system.
**Date:** 2026-07-08

---

## 1. Positioning: what these pages are (and are not)

Integration pages are **entity landing pages** answering the query *"Does Talkie work with `<tool>`?"*
They sit on a different axis from workflows:

| Surface | Answers | Unit |
|---|---|---|
| `/workflows/<slug>` | *"How do I get speech into a draft/CLI?"* | a **recipe** (steps, template JSON) |
| `/integrations/<slug>` *(proposed)* | *"Can Talkie connect to `<tool>`, and what do I get?"* | a **partner** (capabilities + proof + FAQ) |

They overlap and should **cross-link**: `/integrations/obsidian` links to the existing
`/workflows/voice-memo-to-obsidian`; `/integrations/claude` links to `/workflows/dictate-to-claude`.
The integration page is the top-of-funnel "yes, and here's why" surface; the workflow page is the recipe.

**Recommended route family:** `/integrations` (index) + `/integrations/[slug]` (detail) — a direct
sibling of the workflows collection so it inherits the same build/SEO plumbing.

---

## 2. Reusable page structure (detail page)

Mirror the `WorkflowDetailPage` rhythm exactly: full-bleed sections separated by
`border-t border-edge-faint`, alternating `bg-canvas` / `bg-canvas-alt`, each opened by a numbered
`Eyebrow` kicker, content in `mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20`.

```
┌─ HERO  (bg-canvas, Graticule 0.3) ───────────────────────────────┐
│  ‹ back: "All integrations"  (mono, 10px, hover:text-trace)      │
│  Eyebrow: · <CATEGORY>          e.g. · KNOWLEDGE BASE / · LLM     │
│  H1: headline.lead  /  <em>headline.accent</em>                  │
│  Subhead (border-l-2 border-trace pl-5)                          │
│  ── PAIRING STRIP:  [Talkie mark] ⋈ [Partner logo]  + outcome    │
│     badge + optional prereq badge (Terminal / amber)            │
│  ★ ANSWER LINE — one extractable sentence (AEO canonical fact)   │
└──────────────────────────────────────────────────────────────────┘
│ 01 / WHY CONNECT <TOOL>   (bg-canvas-alt) — editorial "when"     │
│ 02 / HOW IT WORKS         (bg-canvas)     — numbered step list   │
│ 03 / WHAT YOU CAN DO      (bg-canvas-alt) — capability grid      │
│ 04 / SET IT UP            (bg-canvas)     — setup + InstallCard  │
│ 05 / QUESTIONS            (bg-canvas-alt) — FAQ (NEW, AEO)       │
│ RELATED                   (bg-canvas)     — linked workflows     │
│ DOWNLOAD                  (bg-canvas)     — DownloadBay CTA       │
└──────────────────────────────────────────────────────────────────┘
```

### Section-by-section

**HERO.** Reuse the workflow hero wholesale, with two changes:
- Replace the icon *flow strip* with a **pairing strip** — the Talkie mark, a `⋈`/`×` connector,
  and the partner logo. This is the one bespoke atom (see §4, `LogoPair`).
- Add an **answer line** directly under the subhead: a single declarative sentence that is the
  canonical answer to "does Talkie work with X" (e.g. *"Talkie sends any transcript straight into
  your Obsidian vault as a Markdown note — locally, no plugin required."*). This is the string that
  answer engines lift, and it doubles as the `<meta description>` and JSON-LD `description`.

**01 / WHY CONNECT `<TOOL>`.** The `when` editorial block — one paragraph, `text-[17px]`,
`text-ink-muted`. Frame the user's situation, not the feature list.

**02 / HOW IT WORKS.** The exact `<ol>` step-list from `WorkflowDetailPage` (lines 88–122): 3–5 steps,
each a lucide icon in a `rounded-sm border` chip + `0N` index + uppercase mono label + body with
`renderTokens()` so `{{TRANSCRIPT}}` and `@Vault` render as amber phosphor tokens. Vertical connectors
between steps. This is copy-paste reuse; keep `renderTokens` shared.

**03 / WHAT YOU CAN DO.** The two-panel grid from `WorkflowDetailPage` (lines 167–199) generalizes to
a **capability grid** — 2–4 `rounded-sm border border-edge-dim bg-surface p-6` cards, each a capability
("Save as Markdown", "Route by tag", "Pull via CLI") with a bulleted detail list (glow-dot bullets).
For richer partners, include one `ExpandableCaptureTile` showing the result in-app (transcript landed
in Obsidian / an issue opened in Linear).

**04 / SET IT UP.** Reuse the `· SET IT UP ONCE` panel. For CLI-based partners (Claude, GitHub via
`gh`, Raycast script commands) drop in the existing dark **`InstallCard`** (`@talkie/cli`) so the
package-manager tabs + copy control appear — this stays on-brand (it's the panel/screen token family).

**05 / QUESTIONS (new).** 3–5 static Q&A pairs. **Render statically in the DOM** (no accordion behind
JS, or if you want disclosure use `<details>`/`<summary>` so the text is still crawlable). This block
feeds a `FAQPage` JSON-LD graph node and is the single highest-value AEO addition. Style: question in
mono uppercase label or `font-display` sub-head, answer in `text-[14px] text-ink-muted`.

**RELATED.** A small row of links to the matching `/workflows/<slug>` recipes and sibling integrations.
Internal linking density is what makes a collection rank; wire every integration to ≥2 others.

**DOWNLOAD.** `DownloadBay` with a partner-specific caption (same as workflow detail line 204).

---

## 3. Index page (`/integrations`)

Clone the `WorkflowsPage` "Starting Points" section shape (`WorkflowsPage.jsx:387–445`):
- Hero with `Eyebrow` + `font-display` H1 + subhead.
- A grid `grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3` of **`IntegrationCard`** tiles.
- Optional grouping by category eyebrow (`· LLM`, `· KNOWLEDGE BASE`, `· DEV`, `· PRODUCTIVITY`).
- Close with a `DownloadBay` CTA.

Each card: partner logo (small, mono/tinted), name, one-line `body`, an outcome chip, and a hover
phosphor glow (`hover:border-amber/50 hover:shadow-[0_0_22px_-8px_var(--trace-glow)]`) — identical
interaction language to the workflow cards.

---

## 4. Component & atom inventory

| Component | Path | New / reuse | Notes |
|---|---|---|---|
| `IntegrationsPage` | `components/IntegrationsPage.jsx` | **new** | index grid; clone of `WorkflowsPage` starting-points block |
| `IntegrationDetailPage` | `components/IntegrationDetailPage.jsx` | **new** | the 7 sections above; clone of `WorkflowDetailPage` |
| `integrationsData` | `components/integrations/integrationsData.jsx` | **new** | single source of truth (see §5) |
| `LogoPair` | `components/integrations/atoms.jsx` | **new** | Talkie mark `⋈` partner logo; the one bespoke atom |
| `IntegrationCard` | `components/integrations/atoms.jsx` | **new** | index tile |
| `FaqList` | `components/integrations/atoms.jsx` | **new** | static Q&A; also emits the FAQ data for JSON-LD |
| `Eyebrow`, `Graticule` | `components/workflows/atoms.jsx` | **reuse** | import as-is; do not fork |
| `renderTokens` | extract from `WorkflowDetailPage.jsx` | **reuse** | move to a shared util so both surfaces import it |
| step-list `<ol>` | pattern in `WorkflowDetailPage.jsx:88–122` | **reuse** | copy pattern verbatim |
| `DownloadBay` | `components/DownloadBay.jsx` | **reuse** | CTA |
| `InstallCard` | `components/InstallCard.jsx` | **reuse** | CLI partners only |
| `ExpandableCaptureTile` | `components/ExpandableCaptureTile.jsx` | **reuse** | result screenshots; `frame` prop |
| `JsonLd` | `components/JsonLd.jsx` | **reuse** | structured data |

**Refactor note:** `renderTokens()` currently lives inside `WorkflowDetailPage.jsx` (lines 213–232).
Promote it to `components/workflows/tokens.jsx` (or a shared `lib/`) before the second consumer exists,
so token styling stays single-sourced.

---

## 5. Data shape (single source of truth)

`components/integrations/integrationsData.jsx` — same authoring model as `workflowsData.jsx`
(array of objects, lucide icons imported at top, `getIntegration(slug)` + `INTEGRATIONS` exports):

```js
{
  slug: 'obsidian',
  name: 'Obsidian',
  category: 'Knowledge base',          // drives hero eyebrow + index grouping
  logo: '/icons/obsidian.svg',         // partner mark (see §7 asset notes)
  outcome: 'MARKDOWN IN VAULT',
  prereq: null,                        // or 'Requires CLI access' -> amber badge
  headline: { lead: 'Talk to your vault,', accent: 'land it in Obsidian' },
  subhead: 'Speak a note and open it in your Obsidian vault as clean Markdown.',
  answer:  'Talkie saves any transcript into your Obsidian vault as a Markdown note, locally, with no plugin.', // AEO canonical fact
  why:     'You think out loud but your notes live in Obsidian. ...',   // 01
  steps: [                                                              // 02  (HowTo)
    { icon: Mic,        label: 'Dictate',   what: 'Capture speech into {{TRANSCRIPT}}.' },
    { icon: FileOutput, label: 'Save to File', what: 'Write {{TRANSCRIPT}} to @Vault/Inbox.' },
  ],
  capabilities: [                                                       // 03
    { title: 'Markdown, not attachments', points: ['Frontmatter + body', 'Your template'] },
    { title: 'Route by tag',              points: ['Folder per topic', 'Daily-note append'] },
  ],
  setup: [ 'Point Save to File at your vault path.', '...' ],           // 04
  faqs: [                                                               // 05  (FAQPage)
    { q: 'Does it need an Obsidian plugin?', a: 'No. Talkie writes Markdown files directly...' },
    { q: 'Do my notes leave my machine?',   a: 'No. Save to File is fully local...' },
  ],
  relatedWorkflows: ['voice-memo-to-obsidian'],                        // cross-links
  relatedIntegrations: ['notion', 'raycast'],
}
```

Keep partner brand color **out** of the data — see §6 on the no-rainbows constraint.

---

## 6. Visual system fit (constraints to honor)

- **Tokens only.** Backgrounds `--canvas` / `--canvas-alt` / `--surface`; borders `--edge` /
  `--edge-dim` / `--edge-faint`; text `--ink` / `--ink-muted` / `--ink-subtle`; accent `--trace` +
  `--amber`. No hardcoded hex. Tinted surfaces via `color-mix(in oklab, var(--trace) N%, transparent)`.
- **No rainbows (explicit call-out).** Partner logos are individually branded (Obsidian purple,
  Notion black, Linear indigo, GitHub black, Raycast red, Claude clay). A grid of six full-color logos
  is exactly the "rainbow card wall" the site avoids. **Recommendation:** render partner logos
  **monochrome** — tinted to `--ink` on the index/cards and to `--panel-ink` when on a dark panel —
  and let *Talkie's* single accent (`--trace`/`--amber`) carry all the color. Reserve true brand color
  (if ever) for a single hover state on the detail hero, never the grid. This keeps same-color
  repetition as the delight and section-rhythm (dark `05`/InstallCard panels vs. cream body) as the
  variety.
- **Typography.** Display font for H1/H2 (`font-display`, `tracking-[-0.02em]`, italic accent spans);
  mono 10px eyebrows (`tracking-[0.26em]`, trace glow); mono 9–11px labels. Body 13–17px `text-ink-muted`.
- **Gradients don't blend on cream** — rely on borders, glow shadows, and hover state for depth
  (already how the workflow cards read).
- **Static export** — plain `<img>` (not `next/image`); `alt` text required.

---

## 7. Schema / AEO needs

Emit one JSON-LD `@graph` per detail page via the existing `JsonLd` component, mirroring
`workflowSchema()` (`app/workflows/[slug]/page.jsx:49`). Nodes:

1. **`FAQPage`** — from `faqs[]`. *The primary AEO win.* Each `Question` → `acceptedAnswer.Answer`.
2. **`HowTo`** — from `steps[]` (identical to workflow HowTo), `name: "Connect Talkie to <X>"`.
3. **`SoftwareApplication`** — represent Talkie once (`applicationCategory`, `operatingSystem: macOS`,
   `offers`), with the partner referenced via `about`/`isRelatedTo` as a `Thing`/`SoftwareApplication`.
4. **`BreadcrumbList`** — Talkie → Integrations → `<Name>` (copy the workflow breadcrumb).

Non-schema AEO levers (equally important on this site):
- **Canonical answer sentence** (`answer` field) surfaced in-hero, in `<meta description>`, and in
  JSON-LD `description` — one consistent extractable fact per partner.
- **`llms.txt`** — add an `## Integrations` section listing every `/integrations/<slug>/` URL with a
  one-line description. This file is the site's explicit AEO surface; new pages are invisible to it
  until listed.
- **`sitemap.xml`** — add each URL (`changefreq weekly`, `priority ~0.7`). The audit **fails** if a
  built page is missing from the sitemap or vice-versa.
- **Metadata export** per route via `generateMetadata()` — `title: "<Name> + Talkie"`,
  `description: answer`, `alternates.canonical`, `openGraph` (`type: 'article'`), `twitter` card.
  Copy the workflow `generateMetadata` verbatim and swap fields.

---

## 8. Assets / screenshots

| Asset | Location | Notes |
|---|---|---|
| Partner logos | `public/icons/<slug>.svg` | SVG preferred (tintable to `currentColor`); joins existing `openai.svg`, `zed.webp`. **Monochrome-friendly** per §6. |
| Result screenshots | `public/images/integrations/<slug>-*.png` | new folder alongside `public/images/workflows/`; shown via `ExpandableCaptureTile` |
| Per-partner OG (optional) | `public/og/integrations/<slug>.png` | 1200×630; falls back to `/og-image.png` if omitted |

**Brand-usage caveat (flag before shipping):** several partners restrict logo use
(GitHub, Linear, Notion, Anthropic/Claude have brand guidelines). Recommend pulling each mark from the
partner's official brand/press kit, storing the monochrome variant, and keeping a one-line attribution
note in the data folder README. This is a content/legal check, not an engineering one — worth raising
with the user before the logos go live.

---

## 9. Implementation file boundaries (for when this is greenlit)

```
NEW  app/integrations/page.jsx                          # index route: metadata + JsonLd(ItemList) + <IntegrationsPage/>
NEW  app/integrations/[slug]/page.jsx                   # detail: generateStaticParams + generateMetadata + JsonLd(@graph)
NEW  components/IntegrationsPage.jsx                     # index grid
NEW  components/IntegrationDetailPage.jsx                # detail sections
NEW  components/integrations/integrationsData.jsx        # single source of truth
NEW  components/integrations/atoms.jsx                   # LogoPair, IntegrationCard, FaqList
NEW  public/icons/<slug>.svg                             # partner logos (6)
NEW  public/images/integrations/<slug>-*.png             # result screenshots

MOVE components/workflows/tokens.jsx                     # extract renderTokens() from WorkflowDetailPage (shared)

EDIT public/sitemap.xml                                  # + 1 index + 6 detail URLs
EDIT public/llms.txt                                     # + "## Integrations" section
EDIT components/SiteShell.jsx                            # + "Integrations" in PRIMARY_NAV / footer
EDIT scripts/seo-audit.mjs                               # + a couple integration routes to the JSON-LD check list (~line for key routes)
```

**Feature-flag note:** the site hides in-progress surfaces with a top-of-component `const SHOW_X = false`
(per CLAUDE.md). If integrations ship partner-by-partner, gate the nav link and any not-yet-authored
cards this way; the detail routes stay reachable by direct URL while unlisted.

---

## 10. Suggested rollout order

1. **Extract `renderTokens` → shared util** (unblocks reuse, zero visual change).
2. Build `integrationsData.jsx` + `IntegrationDetailPage.jsx` + `[slug]` route with **Obsidian** and
   **Claude** first — both already have matching workflows to cross-link and are the clearest
   "does it work with X" queries.
3. Add `IntegrationsPage` index + nav + sitemap/llms.txt lines.
4. Extend `seo-audit.mjs`, run it, confirm JSON-LD (FAQPage especially) validates.
5. Fill in GitHub / Linear / Notion / Raycast against the same data shape.

Every step after (1) is additive and independently shippable behind the `SHOW_` flag.
```

# Tour mobile repair — implementation report

Date: 2026-08-07
Owner: Grok session `session-msj98jqm-z53ay8`
Status: Implemented, not committed

Owner pass: Codex verified the integration at 320, 390, 430, and 1280px. Mobile-width transport controls now remain visible even in fine-pointer responsive preview; desktop hover auto-hide still begins at `md`.

## Design rationale

Reconciled both Grok reviews into one mobile-first IA without redesigning the tour product:

1. **Demo selector** — Below `md`, a DownloadBay-style segmented `tablist` (Mac / Mobile / Full Reel) with the active section description once underneath. Desktop keeps the three descriptive cards, restyled with semantic tokens (`ink`, `trace`, `edge`, `surface`) instead of hardcoded zinc/white.
2. **Player chrome** — Essential transport is always available on touch/coarse pointers; fine-pointer hover devices keep progressive auto-hide with `focus-within` reveal and `pointer-events-none` when hidden. Playlist is a named toggle, not hover-only. Seek is a keyboard `role="slider"`. Clip chips form an always-visible mobile rail under the player.
3. **Gallery** — Mobile exclusive platform filter (default Mac). Mac stacks as a one-column list; iPhone/Watch are horizontal snap rails. Desktop still shows all three expanded sections. Counts come from `getTourItems()` lengths (Mac is correctly **11**).
4. **Focused slides** — Mobile chrome is `Gallery` + `Copy`/`Copied` (no full URL). Narration uses full prose width, stacked above Listen; screenshot `maxWidth` no longer crushes the text column. Primary controls are `min-h-11` (44px).
5. **Shell** — Tour stays immersive (no `MainShell`). A light `<main id="main">` landmark was added so the page is not landmark-empty without importing site chrome/theme toggle.

## Files changed

| File | Change |
|------|--------|
| `components/DemoViewer.jsx` | Mobile tabs, semantic cards, always-available named controls, seek a11y, clip rail, reduced-motion auto-advance guard |
| `components/TourLandingPage.jsx` | Client gallery filter + rails, data-driven counts, blurb copy, `<main>` |
| `components/TourSlide.jsx` | Compact share/back, full-width narration, 44px targets, editable-field keyboard guard, reduced-motion hovers, `<main>` |

Unrelated dirty work left untouched: `app/brand/page.jsx`, `app/layout.jsx`, `components/BrandPage.jsx`, `public/favicon.*`.

## Verification

| Check | Result |
|-------|--------|
| `/tour/` 320×568 | client 320, scroll 320, **no overflow** |
| `/tour/` 390×844 | no overflow; demo + platform tabs 44px |
| `/tour/` 430×932 | no overflow |
| `/tour/` 1280×800 | desktop cards + all three galleries; mobile tabs hidden |
| `/tour/mac-home/` 390 | share shows **Copy** only; Listen 44; narr ~322px |
| `/tour/iphone-ready/` 390 & 320 | narration ~322 / ~252 (was ~46); no overflow |
| Keyboard | `→` mac-home→mac-recording; `Esc` → `/tour/#gallery` |
| Axe WCAG2 A/AA on `/tour/` | 1 residual class: site-wide `text-trace` / `text-amber` eyebrow contrast (pre-existing tokens) |
| Unnamed DemoViewer icon buttons | **0** |
| Impeccable detector on 3 files | `[]` (clean) |
| `git diff --check` | clean |
| `bun run build` | success |
| Browser session | `tour-mobile-repair` closed |

## Remaining limitations

- **Real VTT captions** for `/public/videos/*` do not exist. Controls are named and the video has an accessible label; empty `<track>` elements were intentionally not faked.
- **Mac mobile gallery** still stacks 11 full cards (default platform) — height ~5.2k at 320 vs prior ~8.2k mixed inventory. Switching to iPhone rail drops to ~2.7k. Further Mac density is optional polish.
- **Desktop hover simulators** (agent-browser with fine pointer + mobile viewport) still hide side prev/next until hover; real coarse/touch devices keep them visible via media query.
- **DownloadBay** package-manager tabs remain ~23px (out of tour scope).
- Site token contrast for monospaced `text-trace` eyebrows on light canvas is a design-system issue, not introduced by this repair.

## Intentionally rejected / deferred

| Recommendation | Decision |
|----------------|----------|
| Wrap tour routes in `MainShell` | **Rejected** for this repair. Brief priority is mobile layout; shell would add double-chrome risk and theme toggle coupling. Light `<main>` only. |
| Fake empty caption tracks | **Rejected**. Document as known gap until real VTT exists. |
| Collapse Mac captions on mobile only | **Deferred**. Platform filter + rails deliver the height win; Mac stack keeps readable captions. |
| Full-site 44px for DownloadBay / SiteShell | **Out of scope** per interaction review D8. |

## Not committed

Per brief: do not commit.

# Tour mobile repair brief

Date: 2026-08-07

## Goal

Make `/tour/` and its focused `/tour/[slug]/` views feel intentionally designed for phones, not merely squeezed into a narrow viewport. Preserve Talkie's existing visual identity and content. Do not redesign unrelated pages.

Live dev route: `http://localhost:5173/tour/#gallery`

## Verified audit evidence

- At 390 × 844, the document does not overflow horizontally, but the three demo category cards remain side-by-side, tall, cramped, and difficult to scan.
- At 320 × 568, `/tour/` has a 320 px client width and a 378 px document scroll width.
- Demo category headings are hardcoded `text-white` on transparent/light cards, producing nearly invisible labels in the light theme.
- Playlist, previous/next, timeline, mute, and fullscreen controls rely on hover/`opacity-0`, which is not a dependable touch interaction.
- Axe found five icon-only video buttons without accessible names and a video without captions.
- Several controls are below the 44 × 44 px touch-target floor: player arrows are 40 × 40; focused-slide Listen is 24 px tall; top navigation/share controls are 30–37 px tall; previous/next links are 38 px tall.
- The landing page is 8,194 px tall at 390 px. Mac cards stack well; iPhone and Watch remain in dense two-column grids.
- The focused Mac slide has no horizontal overflow at 320 or 390 px, but the long share URL dominates the mobile top bar and the narration/listen row is cramped.
- The UI audit scored 8/20: accessibility 1, performance 3, responsive 1, theming 1, implementation integrity 2.

## Primary implementation surfaces

- `components/DemoViewer.jsx`
- `components/TourLandingPage.jsx`
- `components/TourSlide.jsx`
- relevant semantic tokens/styles already used by the site

## Requirements

1. Use a truly mobile demo selector. Do not keep three descriptive desktop cards squeezed side by side. It may become compact tabs/segmented controls, a stacked selector, or another clearly superior touch-native pattern.
2. Make all essential video controls available without hover and give every interactive control a visible or accessible name.
3. Use the site's semantic color tokens; the demo component must work in current light and dark themes.
4. Eliminate horizontal overflow at 320, 390, and 430 px.
5. Use at least 44 × 44 px touch targets for primary mobile controls.
6. Improve mobile gallery browsing without making the page feel like a repetitive 8,000 px inventory. Preserve access to every item and the Mac/iPhone/Watch grouping.
7. Simplify focused-slide mobile chrome: the share action must not print a long URL across the header, narration and audio controls must have room, and previous/next navigation must remain clear.
8. Preserve desktop quality and behavior. No red/green win-loss patterns or generic component-library styling.
9. Respect reduced motion and keyboard/focus behavior.
10. Do not make unsupported product claims or rewrite factual content.

## Verification

- Follow repository `AGENTS.md` browser hygiene: use `agent-browser` with a named session and close it when done.
- Check `/tour/` at 320 × 568, 390 × 844, 430 × 932, and a desktop viewport.
- Check at least one Mac focused slide and one iPhone focused slide on mobile.
- Run an accessibility audit on `/tour/`.
- Run `bun run build` and the Impeccable detector on changed UI files.
- Do not commit.

## Collaboration protocol

Two Grok reviewers will independently inspect this brief and the live/code surfaces without editing. Their findings will be appended below. A fresh Grok integrator will then reconcile both reviews, implement one coherent solution, and verify it.

## Reviewer findings

- Responsive product-design review: `docs/marketing/tour-mobile-responsive-review-grok.md`
- Mobile interaction/accessibility review: `docs/marketing/tour-mobile-review-grok-session.md`

Both reviewers agree on the implementation direction: mobile segmented demo tabs, an always-visible clip rail and transport, semantic theme tokens, exclusive mobile platform filtering with iPhone/Watch snap rails, compact focused-slide chrome, narration decoupled from screenshot width, and 44px minimum primary controls. The interaction reviewer specifically verified that iPhone-focused narration can collapse to roughly 46px and treats that as P0.

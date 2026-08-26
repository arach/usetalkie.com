# Tour mobile responsive review — Grok

Date: 2026-08-07
Session: `session-msj8sraw-ieetto` (`project-epicurus-5`, `grok-acp`)
Role: Responsive product-design reviewer
Mode: Read-only

## Verdict

The tour is desktop-shaped chrome compressed onto a phone. Use one coherent mobile information architecture rather than isolated breakpoint patches.

## Recommended architecture

### Demos

- Below `md`, replace the three descriptive cards with a 44px-minimum segmented tablist: Mac, Mobile, Full Reel.
- Render the active section description once beneath the tabs.
- Add an always-visible horizontal clip rail below the player.
- Keep the descriptive cards on desktop, but replace raw white/zinc/emerald page chrome with Talkie's semantic tokens.
- Essential transport must remain visible on touch and on keyboard focus; hover may remain a desktop enhancement.

### Gallery

- Below `md`, add an exclusive Mac/iPhone/Watch platform filter, defaulting to Mac, so only one platform inventory is visible at a time.
- Mac remains a one-column list.
- iPhone and Watch become horizontal snap rails rather than dense two-column walls.
- Keep all three expanded sections on desktop.
- Derive screen counts from the data; the current Mac label says 9 while the data contains 11.

### Focused slide

- Shorten mobile chrome to `Gallery` and `Copy`/`Copied`; never print the full share URL on a phone.
- Decouple narration width from the screenshot width.
- Stack narration and Listen on small screens and raise all primary touch targets to at least 44px.
- Preserve keyboard arrow/Escape navigation and desktop presentation.

## Verified measurements

- `/tour/` at 320×568: 320px client width, 378px document width; overflow originates in the three-card selector.
- `/tour/` at 390×844: no horizontal overflow, but page height is about 8,194px and demo cards are roughly 113×180px.
- `/tour/` at 430×932: no horizontal overflow, same desktop-first architecture.
- `/tour/` at 1280×800: structurally sound; selector colors are still outside the semantic theme system.
- Focused slides at 320/390: no horizontal overflow; share, Listen, back, and previous/next controls remain under 44px tall.

## Implementation priorities

1. Mobile segmented demo selector and clip rail.
2. Semantic selector colors and elimination of 320px overflow.
3. Always-available, named, 44px video controls.
4. Compact focused-slide chrome and full-width narration.
5. Mobile platform filter plus iPhone/Watch snap rails.
6. Data-driven counts and reduced-motion/focus polish.

## Acceptance criteria

- No horizontal overflow at 320, 390, or 430px on landing or focused slides.
- Demo selection and every video control work without hover and by keyboard.
- All primary mobile controls meet 44×44px.
- Selector colors are readable in light and dark themes.
- Mobile gallery no longer exposes an 8,000px mixed-platform inventory by default; all items remain reachable.
- Focused iPhone narration receives normal reading width.
- Desktop behavior and Talkie's visual identity remain intact.
- Build and browser verification pass; named browser sessions are closed.

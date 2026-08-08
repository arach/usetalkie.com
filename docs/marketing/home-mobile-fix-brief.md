# Homepage mobile optimization repair

Date: 2026-08-07
Implementer: fresh Grok session via Scout
Route: `/`
Target viewports: 320×568, 390×844, 430×932; preserve 1280×800 desktop

## Goal

Make the homepage genuinely mobile-optimized: touch-native, navigable, readable, motion-safe, accessible, and economical to load while preserving Talkie's existing visual identity and desktop presentation.

## Baseline evidence

- No page-wide horizontal overflow at 320, 390, or 430px.
- Page heights: roughly 9130px at 320, 8520px at 390, 8271px at 430.
- 32 of 54 visible interactive targets at 430px are below 44px in at least one dimension.
- Mobile header hides the primary nav with no replacement.
- With `prefers-reduced-motion: reduce`, the H1 changed from “Computer” to “Phone” after 6.5 seconds.
- Axe WCAG 2 A/AA found:
  - two serious nested-interactive violations in the Signal Table;
  - light header Get App contrast of 2.39:1;
  - dark mobile gallery labels at 4.28:1;
  - additional contrast uncertainty over the light architectural art.
- The 13 screenshots loaded near the top of the mobile page total about 4.6MB as source PNGs. Native `loading="lazy"` does not prevent the horizontal, near-viewport rail images from loading.
- Impeccable detector found elastic/bounce easing and `max-height` layout animation in SignalTable/PasteMock.

## Required fixes

### 1. Mobile navigation

- Add an accessible mobile navigation path for Tour, Workflows, Philosophy, Ideas, and Docs.
- Keep Get App prominent.
- Use a mobile-appropriate disclosure/drawer/popover with a named 44×44px trigger, keyboard operation, Escape dismissal where applicable, focus management, and an obvious close path.
- Do not add a generic desktop hamburger that visually fights the compact Talkie header; integrate it into the incumbent chrome.

### 2. Touch targets

- Make primary/header/hero/demo/CTA controls at least 44×44 CSS pixels on phone widths.
- Increase hit areas without necessarily making every glyph visually large.
- Footer text links may use padded rows; keep the existing visual density.
- Verify adjacent controls remain separated and do not create overlap at 320px.

### 3. Motion safety

- Stop hero auto-rotation when `prefers-reduced-motion: reduce` is active.
- On phone widths, either stop automatic device rotation or provide an always-discoverable pause/stop control; touch users cannot rely on hover-to-pause.
- Preserve direct user-driven device cycling.
- Replace the verified elastic/bounce easing and avoid animating `max-height`/padding where a transform/opacity or grid-row reveal can preserve the same state change.

### 4. Interaction semantics

- Remove both nested-interactive violations in the Signal Table.
- Do not suppress Axe warnings. Choose one clear interactive owner per action.
- Preserve keyboard access, play/pause, active row state, and the capture choreography.

### 5. Contrast and light-mode legibility

- Meet WCAG AA contrast for the header CTA, gallery labels, hero scenario rows, and mobile chrome in both Modern light and dark themes.
- The inactive hero scenarios can be quiet but must remain legible; do not solve this by making all states equally dim.
- Keep the architectural background, but strengthen the mobile paper mask or text treatment if needed so the art does not wash out the product message.

### 6. Mobile image loading

- Preserve all gallery items and links, but do not ship the original multi-megapixel PNGs to phone-sized slots.
- Generate/use responsive, materially smaller WebP/AVIF assets sized for approximately 2× their rendered mobile dimensions. Preserve source PNGs.
- Provide correct intrinsic dimensions and `srcset`/`sizes` or an equivalent static-export-compatible `<picture>` solution. `next/image` is unoptimized in this repo and is not sufficient by itself.
- Avoid loading every off-axis rail image immediately when practical. Do not hide gallery content permanently.
- Target: mobile gallery image payload materially below the current ~4.6MB, ideally ≤1.5MB for the set.

### 7. Mobile hero usefulness

- Below `sm`, the product chassis is hidden. Ensure the remaining hero still explains what Talkie does and offers a clear next action without turning it into a generic landing-page hero.
- Keep the distinctive “Talk to your [device]” interaction and product-specific scenarios.
- Do not add speculative claims or replace factual product copy.

## Constraints

- Use Bun.
- Use `agent-browser` with a named session for every browser check and close it before finishing.
- Preserve desktop behavior and the incumbent Talkie visual language.
- Do not commit.
- Do not modify unrelated dirty files.
- Existing unrelated/user work includes brand, favicon, tour-mobile files, and `components/PasteMock.jsx` hydration work. Preserve it. If `PasteMock.jsx` must change for motion, retain its deterministic hydration-safe clock/date fix.
- Relevant implementation files likely include `components/SiteShell.jsx`, `components/ThemeToggle.jsx`, `components/home/HomePage.jsx`, `components/home/PanoramicHero.jsx`, `components/SignalTable.jsx`, `components/SignalTableRow.jsx`, and `app/globals.css`.

## Verification required

1. `git diff --check`
2. Impeccable detector on all changed UI files; explain or fix every new finding.
3. `bun run build`
4. Named `agent-browser` checks at 320, 390, 430, and 1280px:
   - page scroll width equals client width;
   - mobile nav opens, is keyboard operable, and closes;
   - primary touch targets are ≥44px;
   - light and dark screenshots inspected;
   - hero direct controls work;
   - Signal Table play/selection still works.
5. Reduced-motion emulation: H1/device must not auto-change after at least 6.5 seconds.
6. Axe WCAG 2 A/AA in light and dark: no serious nested-interactive violations and no verified contrast violations in the changed surfaces.
7. Report changed files, generated assets and total sizes, exact checks, remaining limitations, and any recommendations deliberately rejected.

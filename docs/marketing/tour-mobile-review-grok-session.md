# Tour mobile review — Grok (session-msj8srnb-eeypz3)

Date: 2026-08-07
Role: Mobile interaction, accessibility, frontend-systems reviewer
Mode: Read-only (no file edits)
Browser: `agent-browser` sessions `tour-mobile-review`, `tour-mobile-review-2`, `tour-mobile-review-iphone`
Live base: `http://localhost:5173`

## Executive summary

The brief’s core claims reproduce on live routes. The tour is desktop-first: DemoViewer is a dark-UI fragment stranded on light canvas, video chrome is hover-gated, and focused iPhone slides crush narration into a ~46 px text column. Highest leverage fixes sit in three files: `components/DemoViewer.jsx`, `components/TourLandingPage.jsx`, `components/TourSlide.jsx`. Desktop three-up category cards and hover polish can remain at `md+` / `@media (hover: hover)`.

**Do not edit yet** — this is a review for the integrator.

---

## Method

| Check | Result |
|---|---|
| `/tour/` 390×844 | client 390, scroll 390, page height **8194** |
| `/tour/` 320×568 | client 320, scroll **378** (overflow **+58**) |
| `/tour/` 430×932 | no H-overflow, height **8597**, cards still 3-up |
| `/tour/` 1280×800 | cards 288×95 side-by-side (desktop OK) |
| `/tour/mac-home/` 390 & 320 | no H-overflow; share URL dominates top bar |
| `/tour/iphone-ready/` 390 | no H-overflow; narration column ~46 px wide |
| Keyboard | `→` mac-home→mac-recording; iphone-ready→iphone-recording; `Esc` → `/tour/#gallery` |
| Theme | modern light default; forced `html.dark` for contrast comparison |
| Captions | `public/videos/*` have **no** `.vtt`; `public/captures/*.vtt` exist for other content |

---

## P0 — Must fix for mobile/a11y baseline

### 1. Demo category selector is not mobile-native (overflow + scan failure)

**Evidence**

- 390: three cards side-by-side, ~113/118/99 × **180** px, hard to scan.
- 320: flex row `scrollWidth` 362 vs container 288; document `scrollWidth` **378**. Offenders are the three `CategoryCard` buttons (Full Reel ends at x=378).
- Root cause: `components/DemoViewer.jsx` L333–346 `flex gap-4` with `flex-1` children; default `min-width: auto` prevents shrink below content.

**Exact targets**

| File | Lines | Issue |
|---|---|---|
| `components/DemoViewer.jsx` | 6–37 `CategoryCard` | Desktop-card chrome for a selector |
| `components/DemoViewer.jsx` | 332–347 | Always-horizontal flex of three descriptive cards |
| `components/TourLandingPage.jsx` | 104 | Blurb promises “hover playlist” (desktop-only language) |

**Proposed change (preserve desktop)**

```text
// DemoViewer.jsx — replace the always-on 3-card row

// Mobile (<md): segmented control / tablist
// - role="tablist" aria-label="Demo section"
// - three role="tab" buttons, aria-selected, min-h-11 (44px)
// - label only (Mac / Mobile / Full Reel); description as aria-describedby
//   or one-line helper under the strip for the active tab
// - optional: clip list as compact secondary chips under the strip

// Desktop (md+): keep current CategoryCard row OR a richer card layout
// - className: "flex flex-col gap-2 md:flex-row md:gap-4"
// - cards: "hidden md:flex ..." vs tabs: "flex md:hidden ..."
```

Reuse the **DownloadBay** tab pattern (`components/DownloadBay.jsx` ~125–148: `role="tablist"`, `role="tab"`, `aria-selected`, mono labels, amber underline) so it stays Talkie-native, not a generic component-lib look.

**Verification**

- 320/390/430: no horizontal overflow; selector height ≤ ~48–56 px for the strip.
- Tabs switch videos; active state visible in light + dark.
- Desktop still shows descriptive cards (or equal desktop quality).

---

### 2. Category titles are invisible in light theme

**Evidence**

- Live modern light: `h3` color `rgb(255,255,255)` on transparent card over `sectionBg rgb(250,250,250)` / `--canvas-alt: #fafafa`.
- Contrast **white on #fafafa ≈ 1.04:1** (fails WCAG completely).
- Description `text-zinc-500` ≈ **4.63:1** on #fafafa (borderline for 10 px body).
- Dark mode: white on `#090a09` is fine — bug is light-theme hardcoding.

**Exact targets**

| File | Lines | Hardcoded |
|---|---|---|
| `DemoViewer.jsx` | 10–15 | `border-zinc-700/600/800`, emerald active |
| `DemoViewer.jsx` | 24–25 | `text-white` for both active and inactive |
| `DemoViewer.jsx` | 30–35 | `text-zinc-500/600` |
| `DemoViewer.jsx` | 189 | player `border-zinc-800` (OK inside black bezel) |
| `DemoViewer.jsx` | 269–279 | playlist `emerald-*` / `zinc-*` |

**Proposed change**

- **Outside** the black player (selector row): use page semantic tokens:
  - `text-ink` / `text-ink-muted` / `border-edge` / `bg-surface`
  - active: `border-trace/30`, `text-trace`, optional `bg` via `color-mix(in oklab, var(--trace) 8%, transparent)` (same recipe as TourSlide share/listen).
- **Inside** the player (controls, playlist overlay): keep always-dark instrument chrome with `bg-black/…` and white icons — that is correct CRT/player treatment. Prefer `text-white` only on true black overlays.
- Avoid raw `emerald-500` on page chrome; use `trace` / `amber` for Talkie identity (emerald only if matching modern trace intentionally).

**Verification**

- Light modern, dark modern, warm if available: title contrast ≥ 4.5:1.
- Active/inactive still distinguishable without red/green win-loss patterns.

---

### 3. Essential video controls require hover (broken on touch)

**Evidence**

- Control bar class includes `opacity-0 group-hover/video:opacity-100` — live opacity **0** without hover at 390 and 1280.
- Prev/next: `opacity-0 group-hover/video:opacity-100`, size **40×40**, **no `aria-label`**.
- Playlist gated by `onMouseEnter` / `onMouseLeave` (`showPlaylist`) — no touch path.
- Seek is a 4 px `div`, `role=null`, `tabIndex=-1`, click-only (`handleSeek` uses `e.clientX`).
- Hidden bar still has `pointer-events: auto` (opacity 0 does not remove hit-testing).

**Exact targets**

| File | Lines | Behavior |
|---|---|---|
| `DemoViewer.jsx` | 189–191 | mouse enter/leave → playlist |
| `DemoViewer.jsx` | 227–248 | prev/next hover-only, no names, 40×40 |
| `DemoViewer.jsx` | 251–288 | playlist overlay mouse-only |
| `DemoViewer.jsx` | 290–327 | bottom controls hover-only; icon buttons unlabeled |
| `DemoViewer.jsx` | 128–135, 292–302 | seek not keyboard/touch-friendly |

**Proposed change**

```text
Visibility strategy:
1. Always show a compact control dock on touch / coarse pointer:
   @media (hover: none), (pointer: coarse) → opacity-100, pointer-events auto
2. On hover-capable desktop: keep auto-hide on idle if desired, but:
   - show on focus-within (group-focus-within/video:opacity-100)
   - when hidden: pointer-events-none so the play overlay receives taps
3. Playlist: replace hover-only panel with a named toggle button
   ("Playlist" / list icon) aria-expanded, works with click/tap/keyboard
4. Names (minimum):
   - aria-label="Previous video" / "Next video"
   - aria-label={isPlaying ? "Pause" : "Play"}
   - aria-label={isMuted ? "Unmute" : "Mute"}
   - aria-label="Fullscreen"
5. Touch targets: min 44×44 on primary controls (play/mute/prev/next/fs/playlist)
   - use min-h-11 min-w-11 or p-3 around icons
6. Seek:
   - role="slider" aria-valuemin/max/now aria-label="Seek"
   - tabIndex={0}, ArrowLeft/Right to nudge
   - larger hit area: h-1 visual track inside py-3 touch padding
7. Captions: see P1 #6
```

**Verification**

- iPhone-width, no mouse: mute, seek, fullscreen, playlist, next clip all reachable.
- Keyboard: Tab to all controls; Space/Enter activates; arrows seek.
- Desktop hover auto-hide still works if retained; focus-within reveals controls.

---

### 4. Focused-slide mobile chrome: share URL + crushed narration (especially iPhone)

**Evidence (`TourSlide.jsx` live)**

| Control | 390 mac-home | 390 iphone-ready | Notes |
|---|---|---|---|
| Share | 225×**37**, text `usetalkie.com/tour/mac-home` | 234×**37** full slug URL | Dominates top bar |
| Back | 133×**30** | 124×**30** | Under 44 height |
| Listen | 87×**24** | 87×**24** | Under 44 height |
| Prev/Next | next 131×**38** | prev/next ~88×**38** | Under 44 height |
| Narration text width | ~208 px | **~46 px** | iPhone row `maxWidth` = image width |

- Top bar height **62** at 320/390 with Back + full URL share.
- Narration row is always `flex` row (`TourSlide.jsx` L172–208); on phone frames `imageMaxWidth = min(40vw, …)` (~156 px at 390), so quote + text + Listen cannot coexist.
- Keyboard nav works (good). Esc → gallery works.
- Tour routes **do not** wrap `MainShell` (`app/tour/page.jsx`, `app/tour/[slug]/page.jsx`) — no site header, no theme toggle on tour. Brief’s “top navigation” is TourSlide chrome, not SiteShell.

**Exact targets**

| File | Lines | Change |
|---|---|---|
| `TourSlide.jsx` | 107–143 | Top bar: shorten share; raise hit areas |
| `TourSlide.jsx` | 97–100 | `imageMaxWidth` phone formula may be fine; don’t couple chrome width to it blindly |
| `TourSlide.jsx` | 172–208 | Narration + Listen layout |
| `TourSlide.jsx` | 213–258 | Prev/next padding / min height |
| `TourSlide.jsx` | 123–141 | Share label always prints full path |

**Proposed change**

```text
Share (mobile):
  <span className="sm:hidden">Copy link</span>  // or icon-only + aria-label (already present)
  <span className="hidden sm:inline">{`usetalkie.com/tour/${slug}`}</span>
  min-h-11 min-w-11 / py-2.5 px-3

Back:
  min-h-11 items-center; optional short label "Gallery" on xs

Narration row:
  flex-col gap-3 on default; md:flex-row md:items-start
  Listen full-width or self-start with min-h-11
  Do NOT constrain narration block to phone image maxWidth on small screens —
  use max-w-prose / full content width for text+audio; keep imageMaxWidth on image only

Prev/Next:
  min-h-11 py-3; ensure gap and wrapping don’t collide at 320
```

**Verification**

- 320/390 mac + iphone focused: share never prints long URL; narration readable (≥ ~280 px text column on 390); Listen ≥ 44 px tall.
- Desktop still shows full share path if desired (`sm+`).

---

## P1 — Strongly recommended

### 5. Gallery is an 8k inventory on phones

**Evidence**

- 390 height **8194**; 430 **8597**.
- Mac: `grid-cols-1` with full caption — stacks well but tall (cards ~319–335 px each × 11).
- iPhone/Watch: `grid-cols-2` dense portrait cells.
- Eyebrow hardcodes **`MAC · 9 SCREENS`** (`TourLandingPage.jsx` L126) but `lib/tour.js` has **11** Mac items (factual mismatch).

**Exact targets**

| File | Lines |
|---|---|
| `TourLandingPage.jsx` | 123–141 SubGallery usage |
| `TourLandingPage.jsx` | 175–226 `SubGallery` grid/caption |
| `lib/tour.js` | counts for labels |

**Proposed change (pick one coherent pattern; preserve all items + grouping)**

Preferred for Talkie:

1. **Per-platform horizontal snap strip on mobile** (`flex overflow-x-auto snap-x`, cards `min-w-[70%]` or fixed width), vertical stack of three platforms — cuts page height dramatically while keeping access.
2. Or compact grid: hide captions under `md` (`hidden md:block` on caption); show title + index only; keep 2-col phones.
3. Fix eyebrow to `MAC · ${macItems.length} SCREENS` (data-driven).

Do **not** remove items. Do **not** invent product claims.

**Verification**

- Every slug still linked; Mac/iPhone/Watch groupings remain.
- Mobile page feels curated, not endless inventory (target: material height cut, not a hard px budget).

---

### 6. Captions / accessible name for primary video

**Evidence**

- Main `<video>` has **0** `<track>` elements.
- No VTT under `public/videos/`; captions exist only under `public/captures/`.
- Play overlay has `aria-label`; mute/play/fs in dock do not.
- Axe-class issues from brief (5 unnamed icon buttons + captainless video) confirmed in structure.

**Proposed change**

- Short term: add `aria-label={activeVideo.title}` on `<video>`; label all icon buttons (P0 #3).
- Captions: if transcripts unavailable this sprint, document as known gap; do **not** fake empty tracks. If any voiceover scripts exist, generate WebVTT next to sources and wire:
  ```html
  <track kind="captions" srcLang="en" label="English" src={`/videos/captions/${id}.vtt`} />
  ```
- Prefer a captions toggle only when real VTT exists.

---

### 7. Tour pages skip MainShell / theme control

**Evidence**

- `app/tour/page.jsx` and `app/tour/[slug]/page.jsx` render page components **without** `MainShell`.
- Snapshot on focused slides: no `header` / primary nav; only TourSlide chrome + FeedbackWidget.
- Theme toggle lives in SiteShell → unavailable on tour unless user set theme elsewhere.

**Systems recommendation**

- **Option A (preferred if tour should feel “in product site”)**: wrap both routes in `MainShell` like other pages; then ensure TourSlide top bar doesn’t double-chrome awkwardly on mobile.
- **Option B (immersive tour)**: keep shell-less but document it; still ensure DemoViewer theming works via CSS variables without an in-page toggle.
- Integrator should **decide explicitly**; brief requirement #3 only demands theme-correct tokens, not shell parity.

Not a blocker for mobile layout fixes, but it explains empty “top nav” on tour vs rest of site.

---

### 8. Seek / focus / reduced motion polish

| Issue | Target | Fix |
|---|---|---|
| Seek not focusable | `DemoViewer.jsx` L292–302 | `role="slider"`, keyboard, larger hit slop |
| Focus outline | global `:focus-visible` OK (`globals.css` L1162–1166) | Ensure controls aren’t `outline-none` without replacement |
| Hover translate on prev/next links | `TourSlide.jsx` L219–254 | Wrap motion in `@media (prefers-reduced-motion: no-preference)` or rely on existing global reduce rules if transforms are only Tailwind `group-hover:` |
| Auto-advance on `ended` | `DemoViewer.jsx` L89–93 | Respect `prefers-reduced-motion` (optional pause autoplay chain) |
| Keyboard ignores inputs | `TourSlide.jsx` L63–71 | Guard: if `e.target` is input/textarea/contenteditable, don’t hijack arrows |

---

## P2 — Nice to have / hygiene

| Finding | Detail |
|---|---|
| Mac count copy | `MAC · 9 SCREENS` vs 11 items — fix via data length |
| Demos blurb | “hover playlist” is false on touch — reword to “playlist of every clip” |
| DownloadBay targets on tour landing | bun/npm tabs ~23 px tall; copy ~28 px — out of brief scope unless touching Install CTA |
| SiteShell mobile | Primary nav `hidden lg:flex` — no hamburger; tour shell-less makes this worse only if MainShell added |
| `RotateCcw` import unused | `DemoViewer.jsx` L3 |
| Playlist thumbnail videos | Nested `<video>` per item (perf); prefer posters |
| Focused slide first/last | Missing prev/next is empty `<span>` — OK; ensure layout doesn’t jump |

---

## Exact implementation map for integrator

### `components/DemoViewer.jsx` (primary)

1. **Mobile section selector** — tabs/segmented under `md`; keep cards at `md+`.
2. **Semantic colors** for anything outside the black stage.
3. **Control visibility** — `hover:none` / `focus-within` / playlist button; `pointer-events-none` when visually hidden.
4. **aria-labels** + **44×44** primary controls.
5. **Seek slider** semantics + touch padding.
6. Optional: `aria-label` on video; captions when VTT exists.

### `components/TourLandingPage.jsx`

1. Gallery mobile density (horizontal strips or caption collapse).
2. Data-driven platform counts.
3. Soften “hover playlist” copy.

### `components/TourSlide.jsx`

1. Responsive share label (icon/“Copy link” on small screens).
2. Stack narration + Listen on small screens; decouple text width from image max width.
3. min 44 px hit areas on Back / Listen / share / prev / next.
4. Keyboard handler ignores editable fields.

### Routes (systems decision)

- Consider `MainShell` wrap for `/tour` and `/tour/[slug]` — only if product wants global chrome/theme toggle on tour.

### Tokens

- Prefer existing `ink`, `trace`, `amber`, `edge`, `surface`, `canvas`, `canvas-alt`, `panel-*` / `screen-*` from `app/globals.css`.
- No new rainbow accents; no red/green comparison styling.

---

## Verification cases (for implementer)

| # | Case | Pass criteria |
|---|---|---|
| V1 | `/tour/` @ 320×568 | `documentElement.scrollWidth <= clientWidth` |
| V2 | `/tour/` @ 390×844 | same; selector is tabs or stacked, not 3×180 cards |
| V3 | `/tour/` @ 430×932 | same |
| V4 | `/tour/` @ 1280×800 | desktop cards/quality preserved; no layout regression |
| V5 | Light theme category labels | contrast ≥ 4.5:1; titles readable without dark mode |
| V6 | Dark theme | selector + player still coherent |
| V7 | Touch: play → mute → seek → next → playlist | all without hover |
| V8 | Keyboard on player | Tab order complete; named buttons; seek via keys |
| V9 | `/tour/mac-home/` mobile | share not full URL; Listen ≥ 44 px; narration readable |
| V10 | `/tour/iphone-ready/` mobile | narration not ~46 px column; prev/next clear |
| V11 | ArrowLeft/Right/Esc | still navigate; Esc → `#gallery` |
| V12 | `prefers-reduced-motion` | no essential action depends on hover animation |
| V13 | axe (or equivalent) on `/tour/` | no unnamed icon-only controls in DemoViewer |
| V14 | `bun run build` | clean |
| V15 | All gallery slugs reachable | Mac/iPhone/Watch groupings intact |

---

## Disagreements / additions vs brief

| # | Topic | Stance |
|---|---|---|
| D1 | “Top navigation 30–37 px” | **Clarify:** tour routes are **not** in `MainShell`. Measured chrome is TourSlide top bar (Back 30, Share 37), not SiteShell. Adding MainShell is an extra product decision. |
| D2 | Gallery height | Agree problem. Prefer **horizontal platform strips** over merely “less padding on 2-col grids” — better height win while keeping all items. |
| D3 | Captions | Agree failure. **Do not** ship empty `<track>` as a checkbox fix. Wire VTT only when real captions exist; label controls regardless. |
| D4 | Mac “9 screens” | Brief didn’t flag it; live copy is wrong (**11** Mac items). Fix with data-driven count. |
| D5 | UI audit 8/20 | Not re-scored; structural a11y/responsive issues support a low accessibility/responsive band. |
| D6 | Desktop hover-only controls | Brief implies mobile must not rely on hover. **Recommend** also fixing focus-within for keyboard desktop users; pure hover-hide can remain as progressive enhancement only with `pointer-events-none` when hidden. |
| D7 | iPhone narration crush | Brief notes “narration/listen row is cramped”; live measurement shows **~46 px text width** on iPhone frames — more severe than Mac. Treat as P0 layout bug, not polish. |
| D8 | Scope of DownloadBay / site header targets | Below 44 px but **outside** primary tour surfaces unless MainShell is added; don’t block tour repair on full-site chrome. |

---

## What already works (preserve)

- Focused Mac/iPhone slides: **no horizontal overflow** at 320/390.
- Keyboard: ← / → / Esc behavior is correct and valuable.
- Semantic tokens used well in `TourSlide` / `TourLandingPage` (outside DemoViewer).
- Desktop category cards at 1280 are reasonable (~288×95).
- Play center overlay is named and large enough.
- Gallery grouping Mac → iPhone → Watch is the right IA.
- `playsInline` set on video (iOS-friendly).

---

## Suggested fix order for integrator

1. DemoViewer selector (mobile tabs) + light-theme tokens → kills overflow + invisible labels.
2. DemoViewer always-available named controls + playlist button + seek a11y.
3. TourSlide share/narration/Listen/prev-next mobile layout.
4. Gallery density + correct Mac count.
5. MainShell decision + captions plan.
6. Build + axe + viewport matrix + Impeccable on touched files.

---

## Session hygiene

Browser sessions closed after review: `tour-mobile-review`, `tour-mobile-review-2`, `tour-mobile-review-iphone`.
No source files modified. No commit.

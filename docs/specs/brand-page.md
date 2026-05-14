# Talkie brand page — `/brand` on usetalkie.com

**Audience:** the agent who picks this up — you are the brand custodian for usetalkie.com.
**Owner:** Arach (atchoupani@gmail.com)
**Filed:** 2026-05-14

## What this is

A new public route at `/brand` (Next.js App Router: `app/brand/page.jsx`) that documents the Talkie brand: wordmark, type, color, voice, motion, usage. The kind of page a designer external to the team could land on and immediately know what's allowed and what isn't.

You are the **brand head** for this surface — own it, evolve it as the brand evolves, push back when something feels off.

## Source-of-truth materials

These already exist. Read them before authoring; do not re-invent.

- **Talkie product narrative + brand voice:** existing content in `content/` (`tagline.js` carries the anchor variants — "It's like a selfie. For your thoughts." / "A mic is all you need."). Tone: spare, modernist, slightly literary. Mono labels in tracked uppercase. Sans display in serif italic for emphasis.
- **Color tokens:** see `app/globals.css` — `--brand-studio-cream` (`#F4EFE6`), `--brand-canvas` (`#0E0D0A`), `--brand-hot-mic` (`#FF5346`), `--brand-cassette-orange` (`#E68A3C`), `--brand-tape-tan` (`#7A6E5C`), `--brand-caution-yellow` (`#E5C547`), `--brand-graphite` (`#B8B2A4`), `--brand-signal-green` (`#5FD088`), `--brand-hairline-dark` (`#16140e`). Theme-aware wordmark ink via `--brand-wordmark-ink` flips between cream (dark mode) and canvas-black (light mode).
- **Wordmark component:** `components/brand/Wordmark.jsx` — full feature set (squeeze, thinness, dotScale, dotGap, monotone, guides, per-pair kern). v6 font defaults: squeeze 0.92, dotScale 1.4, dotGap 2.5, lk kern +24. Use it directly for any wordmark display on the page.
- **Font:** Talkie Medium v6, loaded via `next/font/local` in `app/layout.jsx` as `--font-talkie`. The TTF carries embedded version metadata (`Talkie Medium v6 · 2026-05-14`).
- **Sibling brand surface:** narrative-studio `/deck/talkie/squeeze-lab` (live at narrative-studio dev) shows the same Wordmark with interactive controls + the canonical tone for how the brand explains itself technically. Don't copy it — but the rigor and restraint are the bar.
- **Brand origin context:** Talkie is a voice-capture app, local-first, auditable. The wordmark's Hot Mic dot is a *state semantic* (red = listening) not just decoration. The font is JBM-derived (Hero workshop at `/Users/arach/dev/hero/`). "Talkie" reads as warm-mono — engineering aesthetic without being cold.

## Section structure (recommended, not prescriptive)

You're the designer — order and density are yours to set. The page should at minimum cover:

1. **Wordmark** — canonical lockup at hero scale (≥140px). Then variants: nav scale, monotone, listening vs idle state. Do/don't examples. The Hot Mic dot meaning.
2. **Color** — every token rendered as a swatch with hex, role, and "use for / avoid for." Both canvases (cream + black) shown side-by-side.
3. **Type** — Talkie Medium for the lockup, JetBrains Mono for technical labels, Cormorant (or whatever's loaded) for display serif. Show pairings.
4. **Voice** — the tagline anchors, the supporting lines. Show a few canonical sentence cuts.
5. **Motion** — the 1Hz Hot Mic pulse spec. Why one motion per state, why opacity not scale.
6. **Assets** — downloadable wordmark SVG (light + dark variants), favicon, OG image preview. If the assets don't exist yet, file a follow-up spec, don't fake it.
7. **Usage** — quick do/don't grid. Don't stretch, don't recolor the Hot Mic, don't pair with serif body, etc.

## Constraints

- **Design discipline matches the rest of the site.** Read `components/SiteShell.jsx` for the existing typographic system (mono eyebrows in `text-[9px] uppercase tracking-[0.28em]`, sans display in `font-display`, generous 16px+ spacing rhythm). The brand page should *exemplify* the system, not invent a new one.
- **Light and dark.** Every section must read well on both canvases. ThemeToggle lives in the header; test both.
- **No emojis in the page UI** (the brand uses tracked-mono dots `·` and `●` as graphic primitives).
- **No claude/agent attribution** in commits — gitmoji only, no co-authoring footers.
- **Use bun, not npm.** Project uses Next.js 16 + React 19. Run `bun dev` (port 5181 already in use locally — `bun dev --port 5182` or whatever's free).

## Acceptance

- `/brand` renders cleanly in both themes.
- Every brand token, font face, and wordmark variant referenced in the page is loaded from the real source (no hardcoded duplicate values).
- Page reads as authored, not generated — restraint, hierarchy, breathing room.
- Owner can hover into the page and recognize "yes, this is Talkie."

## How to coordinate

- Open a PR on `brand/refresh-v1` (current branch) or split a sub-branch — your call.
- Operator (Arach) is on Scout. Ping `@arach` for design judgment calls. For font questions: `@hero` owns the Talkie typeface.
- Spec questions or scope creep: file in `docs/specs/` and link.
- Keep the brand page evolving — it's not a one-shot, it's a custody. Watch for v6 → v7 font drift, new tokens, new motion specs, and update.

## Out of scope

- The font itself (Hero owns).
- Other usetalkie.com routes (existing pages stay as-is).
- Marketing copy that isn't directly brand-defining.

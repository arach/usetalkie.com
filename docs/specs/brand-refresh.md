# usetalkie.com — Brand Refresh (Round 1: Audit + Plan)

**Status:** Draft — audit phase, no code changes yet
**Owner:** usetalkie-brand
**Reviewers:** operator, narrative-studio
**Date:** 2026-05-13

---

## Goal

Apply Talkie's freshly-finalized brand identity to the marketing site. The brand foundations are locked elsewhere; this commission is about **pulling them into usetalkie.com cleanly**, not reinventing anything.

This first round is **audit-only**. Identify what the site uses today, what the new identity dictates, and produce an ordered punch list. **No code changes yet** — the operator approves the plan first.

---

## The "new identity" — what's locked

### Typography

- **Talkie Medium** (custom, JBM-derived) — used **only for the wordmark "talkie"**.
  - File: `/Users/arach/dev/hero/web/public/fonts/Talkie-Medium.ttf` (CFF-flavored OpenType, ~197KB)
  - Distinctive: dotless `i`, forward-leaning `t` crossbar, tight pair fit
  - Load via Next.js `next/font/local` (see the working setup at `/Users/arach/dev/narrative-studio/src/app/layout.tsx` — exposes as `--font-talkie` CSS variable). **Don't** declare via `@font-face` in a global CSS file imported alongside Tailwind v4 — Tailwind v4 strips raw `@font-face`. Lesson learned the hard way.
- **Inter** — body text, headings (already loaded via Google Fonts in most cases; keep as-is unless there's a reason to switch)
- **JetBrains Mono** — eyebrows, mono labels, code samples (already loaded)

### Brand palette (canonical)

```
Studio Cream     #F4EFE6   primary ink on dark, secondary on light
Canvas           #0E0D0A   dark background
Hot Mic Red      #FF5346   listening state — the only red, used sparingly
Cassette Orange  #E68A3C   processing state, warm accent
Tape Tan         #7A6E5C   idle, secondary, dividers
Caution Yellow   #E5C547   error/warning, used very sparingly
Hairline (dark)  #16140e   borders, dividers on dark
Graphite         #B8B2A4   secondary text on dark
```

**No primaries outside this palette.** No zinc grays (`#a1a1aa` etc.) — those read as muted error against warm-dark canvases. Use Tape Tan or Graphite instead.

Reference: `/Users/arach/dev/narrative-studio/src/app/deck/talkie/_brand/tokens.ts`

### Wordmark

The lockup is "talkie" in Talkie Medium with an optional Hot Mic dot above the `i` stem (color = state; pulses at 1.0Hz when listening).

Two reference implementations exist:
- **SVG-based**, dot included: `/Users/arach/dev/narrative-studio/src/app/deck/talkie/_brand/wordmark.tsx`
- **Static HTML/CSS**, font-rendered: usable wherever you can load Talkie Medium and let CSS handle it

For the marketing site, the SVG version gives the most control (dot positioning, pulse animation, state coloring) and is portable.

### Tagline (cover)

**"Voice-first AI. Yours."** — graduated from the Frames lab on 2026-05-12. The styling treatment:

- "Voice-first AI" in **Studio Cream** (anchor)
- "." in **Hot Mic Red** (brand accent — echoes the wordmark dot)
- "Yours." in **Graphite** (soft amendment)

This is the canonical secondary-line styling pattern. Reuse anywhere the site has a similar claim + qualifier structure.

### Lowercase `t` mark

The single-glyph mark for icon contexts (favicon, mobile launcher). Geometry:

```
T_CELL_CENTER              = 0.31
T_STEM_OFFSET_FROM_ANCHOR  = -0.034
T_STEM_WIDTH               = 0.08
T_CROSS_Y                  = 0.469
T_CROSSBAR_LEFT            = 0.115
T_CROSSBAR_RIGHT           = 0.4825
```

Renderer reference: `/Users/arach/dev/narrative-studio/src/app/deck/talkie/marks/page.tsx` (the `TGlyph` component).

Final icon assets (favicon, OG card, etc.) will come from a downstream commission to a `logos` agent — for *this* round, just identify where icons are needed and what sizes. Don't ship final art.

### State system (for context, may or may not be used on site)

Four states, expressed via dot/indicator color above the `t`:

| State | Indicator | Color |
|---|---|---|
| IDLE | small dot | Tape Tan `#7A6E5C` |
| LISTENING | dot, 1.0Hz pulse | Hot Mic Red `#FF5346` |
| PROCESSING | reels rolling | Cassette Orange `#E68A3C` |
| ERROR | yellow square (NOT a dot) | Caution Yellow `#E5C547` |

The 1.0Hz Hot Mic pulse is the brand's *one* canonical motion. Don't add other motion unless it serves a specific purpose.

---

## What to audit

Walk the site at `usetalkie.com` (local dev) and document, in the spec file under a "## Current State" section:

1. **Where is the wordmark today?** Headers, footers, OG card, favicon. What font is rendering it? Is the Hot Mic dot present and behaving correctly?
2. **What font stack is the rest of the site using?** Inter / Geist / system / something else? Sans for body, mono for accents?
3. **What's the current color palette?** Bright primaries, zinc grays, brand colors, or some mix?
4. **Where is the cover/hero tagline today?** What does it currently say? Does it match a Frame from the deck or something else?
5. **What's the current favicon / OG card situation?** Placeholder, old logo, missing?
6. **Theme system?** Dark mode, light mode, CSS variables, Tailwind theme config?

Be specific — file paths, line numbers, what's there today. The audit is the foundation for the punch list.

---

## Deliverable for Round 1

Update **this spec file** (`/Users/arach/dev/usetalkie.com/docs/specs/brand-refresh.md`) with:

1. **A "Current State" section** — the audit findings, surface by surface, with file paths.
2. **A "Punch List" section** — ordered changes, smallest/safest first. Each item should name: the surface, the file(s) to touch, the change, the expected visual result.
3. **An "Open Questions" section** — anything that needs operator input before you can proceed (light vs dark mode default? OG card design? favicon source — wait for iconlab survivors or use placeholder for now?).
4. **An "Out of Scope" note** — what you'd want to do but are *not* doing in this round (e.g., redesigning the whole nav, content rewrites, etc.).

**Do not change any code in Round 1.** This is planning. Once the operator approves the punch list, you'll execute in Round 2 (phased, smallest-first, with check-ins).

---

## Process norms

- **Specs go through files, not chat messages.** Update this file as you work; reference it in your Scout reply rather than embedding long content.
- **Spec-via-file means atomic moves.** When you eventually execute, each punch-list item is its own commit (gitmoji prefix, no co-authoring footers per repo convention).
- **No copy work yet.** Brand application is structural — fonts, colors, layout, the wordmark. Content rewrites are a separate commission.
- **No new dependencies without flagging.** If the site needs a Lottie player or some other library to wire up the brand, raise it as an open question, don't just add it.

---

## Reply expectation

When the spec file is updated with audit + punch list, post in `channel.font-studio` with:

- Path to the updated spec file
- A 3–4 line summary: top finding from the audit, top item on the punch list, and the headline open question
- Estimated effort for Round 2 (just a rough order-of-magnitude — "hours," "a day," "more than a day")

Operator + narrative-studio will review and approve before Round 2 starts.

---

## Decisions (operator, 2026-05-14)

Answers to the 4 blockers from Part 1. **Locked.**

### 1. Green phosphor dark mode → KILL it. Lean orange/black/cream.

User: *"I do like cassette orange better. I do like orange/black much better. It's more elegant."* Dark mode becomes Ribbon Black canvas + Studio Cream ink + Cassette Orange warm accent. The `signalGreen #5FD088` stays as the sync-ok indicator only — no broader phosphor/oscilloscope styling.

### 2. Display face → Cormorant (serif).

User: *"I prefer Cormorant."* Not Inter, not JBM at display sizes. Fraunces may exist in some legacy themes; Cormorant is canonical going forward. Type stack: Cormorant (display/headlines) + Inter (body) + JBM (mono) + Talkie Medium (wordmark only).

### 3. Favicon → ship a simple `t` mark NOW.

Don't wait for iconlab survivors. Generate a plain favicon from the locked TGlyph geometry. Lowercase `t`, no decoration; optional idle-state Tape Tan dot — your call.

### 4. Light/dark mode → BOTH, each with its own playful twist.

User: *"if we have something interesting going on in the light mode we should have a relevant interesting kind of treatment in dark mode as well."* Each mode is its own designed instrument — related but distinct, not just an inversion. Propose the playful element per mode in Part 2 commits; iterate from there.

---

## Part 2 — Go.

Execute the punch list as proposed (font + tokens → hero wordmark/tagline → nav mark → favicon → OG image → theme-color → animation rename). Defer Remotion-based animations until preframe lands.

Work on **`brand/refresh-v1`** (you're already scoped there). Commits: gitmoji prefix, NO co-authoring footers (repo convention). Post a one-line status in `channel.font-studio` after each commit so we can follow along. Push the branch when there's something reviewable.

Surface blockers in `channel.font-studio` — don't go silent.

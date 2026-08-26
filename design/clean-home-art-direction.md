# Clean-home art direction — below the hero

Target: `/clean-home` (`components/LandingPage.jsx`, `simplifiedHero`), everything from
`#capture` ("One voice path. More than one use.") down through the footer.

Reviewed against the running page in both themes plus source. Screenshots:
`clean-home-full.png` (dark), `clean-home-light.png` (light) in the session scratchpad.

---

## The diagnosis in one line

The hero is **warm editorial** — Fraunces at 400, amber eyebrow, `#fbfbf9` paper,
sentence-case CTAs. Everything below it is **cool SaaS** — Space Grotesk bold with
`tracking-[-0.05em]`, emerald accents, three different near-blacks, `rounded-full`
uppercase buttons. It reads as two designs stapled at the hairline divider.

## The direction: **Warm Editorial Paper, One Accent**

The hero already contains the whole system. Push it down the page: serif carries the
headings, mono carries the labels, sans carries everything you actually read, and there
is exactly one accent — amber-bronze, taken from the locked brand token
`--brand-cassette-orange`. Emerald leaves the page.

---

## 1. Font roles — keep the trio, reassign the jobs

Keep serif / sans / mono. The mix is not the problem; the assignment is.

| Family | Today | Should own |
|---|---|---|
| **Fraunces** (`font-display`) | hero h1 + rolodex h1 only | **every h1 and h2 on the page** |
| **Space Grotesk** (`font-sans`) | all h2, all h3, body, buttons | card h3, body, ledes, buttons |
| **JetBrains Mono** (`font-mono`) | eyebrows, labels, meta, code, pills, "EXPLORE", footer nav, © | eyebrows, labels, meta, code — **and nothing else** |

Two changes carry most of it:

- **Serif the section h2s.** Right now four h2s use
  `text-4xl font-bold tracking-[-0.05em] md:text-5xl`. That -0.05em on a bold grotesk is
  the single strongest "marketing site" signal on the page and it fights a 400-weight
  serif hero directly above it.
- **Cut mono volume roughly in half.** One screen currently shows mono in eight roles
  (section eyebrow, card eyebrow, `EXPLORE →`, step number, timeline label, timestamp,
  status pill, footer nav). Mono stops meaning "instrument" when it means everything.
  Demote `EXPLORE →` and the footer nav to sans.

## 2. Type scale — seven roles, fixed

| Role | Family | Size | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Section eyebrow | mono | 11px | 700 | .22em | UPPER |
| **Section h2** | **display** | clamp(2.1rem, 3.4vw, 3.05rem) | **400** | **-0.02em** | Sentence |
| Section lede | sans | 17px / 1.62 | 400 | 0 | Sentence |
| Card eyebrow | mono | 10px | 700 | .20em | UPPER |
| Card h3 | sans | 17px / 1.35 | 600 | -0.01em | Sentence |
| Body | sans | 15px / 1.65 | 400 | 0 | Sentence |
| Label / meta | mono | 10px | **500** (not 700) | .18em | UPPER |
| Button | sans | 13px | 600 | **.01em** | **Sentence** |

Buttons deserve a callout. `text-[11px] font-bold uppercase tracking-[0.22em]` is a
mono-tech gesture rendered on a sans face, and it appears on `#get`, the pill links, and
the ownership chips. Under an editorial hero it should be **sentence case, 13px, 600,
near-zero tracking**. Also unify radius: the hero CTAs are `rounded-xl`, the rest of the
page is `rounded-full`. Take the hero's — `rounded-xl` everywhere.

Radius scale collapses from seven values (22/24/26/28/30/32/full) to **three: 10 / 16 / 20**.
Cards move 24px → 16px; 24px pillowy corners are the other half of the "SaaS" read.

## 3. Color — delete emerald, single amber accent

Emerald appears **19× in `LandingPage.jsx` and 31× in `PricingSection.jsx`** — icon chips,
hover borders, hover glows, step numbers, the "Search-ready" pill, the CLI eyebrow, the
newsletter CTA. Meanwhile the hero uses `amber-700 / amber-300 / amber-500`. Two accents
means no accent, and the green currently loses: it isn't saturated enough to read as brand,
only enough to read as leftover.

`globals.css` already settles this — `--brand-signal-green` is documented as
**"sync-ok indicator only."** Honor that rule.

- **Accent = amber-bronze.** Light `#B4650F`, dark `#E68A3C` (= `--brand-cassette-orange`).
- **Green survives in exactly one place:** a live/sync status dot. Nothing else.
- Icon chips `bg-emerald-500/10 text-emerald-600` → `bg-[--ed-accent-soft] text-[--ed-accent]`
- Card hover `hover:border-emerald-400/60 hover:shadow-[...rgba(16,185,129,.12)]` →
  `hover:border-[--ed-accent-line] hover:shadow-[--ed-shadow-lift]`
- Pricing's green CTA and green terminal card → the same near-black button used everywhere
  else, and a warm-charcoal card with an amber trace.

**Backgrounds are the other half of the color problem.** Dark mode currently runs four
near-blacks with three different hue casts: `#0c1013` (hero, blue), `#0a0f0d` (capture,
green), `#0d1012` (context, blue-green), `#0a0d11` (ownership, blue), `#081210` (footer,
green). At a glance they read as banding, not rhythm. Collapse to two warm papers plus one
slab. Light mode: drop pure `white` entirely — white sitting directly under a `#fbfbf9`
hero is a large part of why the hero feels like a different page.

## 4. Section rhythm

Today: hero (warm) → orphan rolodex → white → stone-50 → cold black slab → pricing →
white → stone-100 footer. Five background values, `py-20 / md:py-24` throughout.

Proposed — **A / B / A alternation with one inversion**, and every section at
`py-24 / md:py-32` (the current spacing is too tight for this content density, which is
why sections mush into each other):

| # | Section | Background | Divider |
|---|---|---|---|
| 1 | Hero | `--ed-paper` | hairline |
| 2 | ~~Rolodex "Talkie works with you on your ___"~~ | **cut — see below** | — |
| 3 | One voice path (capture grid) | `--ed-paper-alt` | hairline |
| 4 | Voice notes are easy to save (context) | `--ed-paper` | none |
| 5 | **Your voice stays on your side (ownership)** | **`--ed-ink-slab`** | none — value change *is* the divider |
| 6 | Pricing | `--ed-paper` | hairline |
| 7 | Start with your Mac | `--ed-paper-alt` | hairline |
| 8 | Footer | `--ed-paper-alt` | hairline |

The ownership slab stays the page's **only** inversion — that's what makes the privacy
beat land. Warm it from `#0a0d11` (blue-black) to `#0E0D0A` (= `--brand-canvas`) so it
belongs to the hero's world. Keep the footer on paper rather than a second slab, or the
inversion stops meaning anything.

No gradient bleeds between sections. A hairline at `rgba(23,21,15,0.10)` between
same-family sections; nothing where the slab meets paper.

## 5. Tokens

```css
:root {
  --ed-paper:        #FBFAF7;
  --ed-paper-alt:    #F4F1EA;              /* ≈ --brand-studio-cream */
  --ed-ink-slab:     #0E0D0A;              /* --brand-canvas */

  --ed-ink:          #17150F;              /* headings */
  --ed-ink-2:        #4A443A;              /* body */
  --ed-ink-3:        #7A6E5C;              /* --brand-tape-tan — labels, meta */

  --ed-accent:       #B4650F;
  --ed-accent-soft:  rgba(180,101,15,0.10);
  --ed-accent-line:  rgba(180,101,15,0.30);

  --ed-line:         rgba(23,21,15,0.10);
  --ed-line-soft:    rgba(23,21,15,0.06);

  --ed-radius-sm:    10px;
  --ed-radius:       16px;
  --ed-radius-lg:    20px;

  --ed-shadow-card:  0 1px 2px rgba(23,21,15,0.04);
  --ed-shadow-lift:  0 18px 44px -26px rgba(23,21,15,0.24);

  --ed-section-y:    6rem;                 /* md: 8rem */
}

html.dark {
  --ed-paper:        #0F0E0C;
  --ed-paper-alt:    #15130F;
  --ed-ink-slab:     #080705;

  --ed-ink:          #F4EFE6;              /* --brand-studio-cream */
  --ed-ink-2:        #B8B2A4;              /* --brand-graphite */
  --ed-ink-3:        #7A6E5C;

  --ed-accent:       #E68A3C;              /* --brand-cassette-orange */
  --ed-accent-soft:  rgba(230,138,60,0.12);
  --ed-accent-line:  rgba(230,138,60,0.28);

  --ed-line:         rgba(244,239,230,0.10);
  --ed-line-soft:    rgba(244,239,230,0.06);

  --ed-shadow-card:  none;
  --ed-shadow-lift:  0 18px 44px -26px rgba(0,0,0,0.60);
}
```

Type tokens (as `@apply`-able classes or plain CSS shorthands):

```css
--ed-eyebrow: 700 .6875rem/1 var(--font-mono);                         /* +.22em */
--ed-h2:      400 clamp(2.1rem,3.4vw,3.05rem)/1.06 var(--font-display); /* -.02em */
--ed-lede:    400 1.0625rem/1.62 var(--font-sans);
--ed-h3:      600 1.0625rem/1.35 var(--font-sans);                     /* -.01em */
--ed-body:    400 .9375rem/1.65 var(--font-sans);
--ed-label:   500 .625rem/1 var(--font-mono);                          /* +.18em */
--ed-button:  600 .8125rem/1 var(--font-sans);                         /* +.01em */
```

---

## The three highest-impact changes

**1. Serif the section headings and kill `tracking-[-0.05em]`.**
Four h2s in `LandingPage.jsx` (≈816, 862, 979, 1043) plus the ones in `PricingSection.jsx`:
`text-4xl font-bold tracking-[-0.05em] text-zinc-950 md:text-5xl`
→ `font-display text-[clamp(2.1rem,3.4vw,3.05rem)] font-normal leading-[1.06] tracking-[-0.02em]`.
Smallest diff on the list and it does the most — the page becomes the hero's page.

**2. Delete emerald; one amber accent.**
50 call sites across `LandingPage.jsx` + `PricingSection.jsx` reduce to `--ed-accent` /
`--ed-accent-soft` / `--ed-accent-line`. Green stays only as a sync-status dot, which is
what the brand tokens already say it's for. This is what makes light and dark feel like the
same product instead of two.

**3. Cut the leftover rolodex block** (`LandingPage.jsx` ≈610–660, the
"Talkie works with you on your ___" flap card and its use-case grid).
It's a second hero: competing serif h1 at 3.2rem, its own device pills, its own black
flap-card, its own animation — sitting directly under the real hero behind a hairline.
No typographic fix survives it. Either delete it or demote it to a single kicker line
inside the hero. If it must stay, it belongs *below* the capture grid, at h3 scale,
without the flap card.

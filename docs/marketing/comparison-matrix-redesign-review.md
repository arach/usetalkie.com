# Comparison matrix redesign review — DictaFlow page

**Scope:** Independent review of `/compare/dictaflow/#comparison-matrix`  
**Live:** `http://talkie.localhost:1355/compare/dictaflow/#comparison-matrix`  
**Date:** 2026-07-22  
**Status:** Recommendation only — no implementation changes in this pass.

---

## Executive recommendation

Keep the evidence catalog and the “buyer guide, not scorecard” rules. Change three things:

1. **Information architecture** — put the decision surface earlier; stop making the matrix a summary of essays the reader already finished.
2. **Matrix content** — six decisive, non-overlapping factors with fair, non-euphemistic cells; drop or reframe the Automation row; fix the Android claim; optionally add vocabulary as a conceded DictaFlow strength.
3. **Visual treatment** — remove Talkie-column championship styling (amber header + left rail + first pick accent) so neither product is dimmed or crowned by chrome.

Pricing is already correctly excluded. Do not add it.

---

## What exists today

### Pipeline

| Layer | Path | Role |
| --- | --- | --- |
| Narrative | `content/ideas/talkie-vs-dictaflow.mdx` | Article + `<EvidenceComparison competitor="dictaflow" />` |
| Page config | `data/comparison/pages.json` → `dictaflow` | Picks + compact row overrides |
| Evidence | `data/comparison/products/{talkie,competitors}.json` | Full claims, maturity, sources |
| Dimensions | `data/comparison/dimensions.json` | Stable buyer questions (unused in UI) |
| Resolve | `lib/comparisons.js` → `getEvidenceComparison` | Merge overrides + planned-claim safety |
| Render | `components/blog/EvidenceComparison.jsx` | Picks → table → sources |
| Style | `components/IdeaLayout.jsx` inline CSS | `.evidence-comparison*` / `.comparison-table` |
| Guardrails | `scripts/validate-comparison-data.mjs` | ≤7 rows, ≤40 chars/cell, no `business.*`, 3 pick points |

### Current rendered matrix

**Picks**

| Pick Talkie when | Pick DictaFlow when |
| --- | --- |
| Local capture that becomes data | Polished dictation almost anywhere |
| · On-device core recognition | · Windows and Mac |
| · Searchable capture library | · Selected-text editing |
| · CLI, SDK, and workflows | · Citrix, RDP, and VMware |

**Rows**

| Decision factor | Talkie | DictaFlow |
| --- | --- | --- |
| Best at | Capture, retrieval, automation | Cross-platform text delivery |
| Processing | On-device core recognition | Choose local or cloud |
| Output | Close transcript, explicit workflows | AI cleanup and voice editing |
| Locked-down apps | Normal app insertion | Types when paste is blocked |
| Capture record | Searchable local library | Cursor-first workflow |
| Automation | CLI, SDK, workflows | Dictates into tool UIs |
| Devices | Mac, iPhone, Watch | Windows, Mac, iPhone, Android |

Verified Jul 22, 2026 · single official source: DictaFlow product page and FAQ.

### Page order today

1. SEO title: “DictaFlow alternative…”
2. Intro + short verdict (good)
3. Long “What DictaFlow does well”
4. Longer “Where Talkie is different” (CLI install, agents, Watch…)
5. **Side by side** matrix (late)
6. “Which one should you pick?” (repeats short verdict)

The matrix is doing recovery work after the reader already absorbed a Talkie-weighted essay.

---

## Critique

### What works

- Evidence model is serious: maturity, confidence, sources, planned-claim publicValue, validator forbids pricing filler and >7 rows.
- Docs in `docs/comparison-system.md` state the right fairness rules.
- Narrative leads with DictaFlow strengths (Windows, hybrid cleanup, Citrix/RDP, vocabulary).
- Conceded gap for locked-down apps is present in the evidence catalog.
- Compact 40-character cells force scannability; no feature dump of all 30 Talkie claims.
- Mobile card transform with `data-column` labels is solid.
- Pricing correctly absent (`business.*` blocked by validator).

### Information architecture problems

1. **Decision tool is buried.** The short verdict at the top is useful, then the reader gets ~two screens of prose before the only scannable artifact. For comparison intent (“should I switch?”), the matrix should be the second beat, not the fifth.
2. **Picks and table double-bill the same facts.** “On-device core recognition,” “CLI, SDK, and workflows,” and platform lines appear in both layers. The picks should be *who this is for*; the table should be *why the split is true* — different jobs.
3. **Talkie pick copy is generic.** `"Local capture that becomes data"` + the same three bullets are reused on DictaFlow, Aqua Voice, and Wispr Flow. It does not answer “when should *I* pick Talkie *instead of DictaFlow*.”
4. **“Side by side” is a weak section label.** It describes layout, not decision. Prefer something like “The decision factors” or drop the h2 chrome and let the component own a single clear heading.
5. **Closing section re-litigates the intro.** Fine as CTA, but it currently re-dumps analysis the matrix should have already settled.

### Content / fairness problems

1. **Automation row is a stacked deck.** Talkie cell is a product surface (`CLI, SDK, workflows`). DictaFlow cell is “Dictates into tool UIs” — true of *every* cursor dictation app, including Talkie. Evidence maturity for the competitor claim is `not_advertised` (no structured capture CLI), but the override sells that as if DictaFlow’s automation story is weak rather than different. Frame as programmability / data access, or fold into Best for / After capture.
2. **Devices overclaims Android.** Catalog value: `"Windows, Mac, iPhone, and Android through Telegram."` Display: `"Windows, Mac, iPhone, Android"`. That erases the Telegram qualifier and unfairly inflates parity.
3. **“Normal app insertion” understates a real gap.** Evidence maturity is `conceded_gap`. The cell is soft. DictaFlow’s corresponding strength is one of its few hard differentiators; Talkie’s cell should read as a clear non-fit for that environment, not a mild variant.
4. **Vocabulary is in the essay and evidence, not the matrix.** `output.dictionary` is a verified DictaFlow claim (medium confidence) and a Talkie “no published capability today” concession used on Dragon/Wispr pages. For an enterprise-dictation archetype, omitting it while keeping a weaker Automation row is the wrong priority.
5. **“Cursor-first workflow” is category language (good) but orphaned.** Without a maturity cue, it can read as a euphemism or a mild compliment. Pair with plain language: “Delivers to the cursor; no documented capture library.”
6. **Best at undersells DictaFlow.** “Cross-platform text delivery” flattens selected-text editing + hybrid polish + enterprise delivery into a logistics phrase. Talkie’s “Capture, retrieval, automation” is three product pillars; match density on both sides.
7. **No maturity/confidence surfaces.** The data model’s most fairness-critical fields never appear. Equal-weight plain strings make a conceded gap look like a draw and a `not_advertised` look like a loss.

### Visual treatment problems

Measured on the live modern theme:

| Element | Talkie | Competitor |
| --- | --- | --- |
| Column header color | `rgb(16, 185, 129)` (brand accent) | `rgb(82, 82, 82)` muted |
| Column left rail | accent border | none |
| Pick card top edge | accent border | plain |
| Pick eyebrow | accent | muted |

This is soft scoreboard coding. The docs say buyer guide; the chrome says “Talkie column is the protagonist.”

Other visual issues:

- **9px factor labels / 11px cells** — scannable only if you already know the labels; borderline for first-time readers.
- **Labels are nouns, not decisions** (“Processing”, “Output”) while `dimensions.json` already has buyer questions that never render.
- **Row cards float with spacing** — fine, but combined with tiny type the matrix feels like a footnote, not a decision instrument.
- **Sources line is good** but easy to miss; keep it, don’t bury maturity there either.

### What not to “fix”

- Do not add pricing without comparable, dated commercial facts (already correct).
- Do not turn cells into multi-sentence analysis (validator 40-char cap is a feature).
- Do not expand toward a full claim inventory.
- Do not use red/green win-loss icons.
- Do not invent accuracy, WPM, or language-count rankings.

---

## Redesign: target experience

### Goal in one sentence

A reader should land on the matrix, pick a column in under 20 seconds, and only then read the essays if they want the story.

### Page IA (MDX)

```text
1. Title (keep SEO if needed; lead description is fine)
2. 2–3 sentence setup + one-line short version
3. <EvidenceComparison />          ← move here (was “Side by side”)
4. What DictaFlow does well        ← support, not preface
5. Where Talkie is different       ← support; trim CLI install block or move to CTA
6. Which one should you pick?      ← short, pointer back to matrix + download
```

### Component IA (`EvidenceComparison`)

```text
[ optional: “How to choose” eyebrow + one-line frame ]
[ equal-weight pick cards ]
[ decision matrix — 5–6 rows ]
[ sources + verified date ]
```

Remove the dependence on the surrounding `## Side by side` heading; the section should self-title via `aria-label` + a visible `h2`/`h3` inside the component so reordering MDX does not orphan it.

### Sample content — DictaFlow page config

```json
{
  "competitor": "dictaflow",
  "archetype": "enterprise-dictation",
  "picks": {
    "talkie": {
      "title": "Apple-native capture you can script",
      "points": [
        "On-device core recognition",
        "Searchable local library",
        "CLI and agent workflows"
      ]
    },
    "competitor": {
      "title": "Dictation that reaches hard environments",
      "points": [
        "Windows + Mac + mobile",
        "AI cleanup and voice edits",
      "Citrix, RDP, and VMware"
      ]
    }
  },
  "rows": [
    {
      "claim": "job.primary",
      "label": "Best for",
      "talkie": "Local capture + agent data",
      "competitor": "Cross-OS enterprise delivery"
    },
    {
      "claim": "processing.locus",
      "label": "Speech processing",
      "talkie": "On-device core recognition",
      "competitor": "Local ASR + cloud cleanup"
    },
    {
      "claim": "output.transcript_style",
      "label": "Default output",
      "talkie": "Close transcript; workflows later",
      "competitor": "Cleanup, voice edit, rewrite"
    },
    {
      "claim": "capture.remote_desktop",
      "label": "Locked-down apps",
      "talkie": "Not built for blocked paste",
      "competitor": "Keystroke delivery when paste fails"
    },
    {
      "claim": "data.store",
      "label": "After you speak",
      "talkie": "Searchable local library",
      "competitor": "Cursor delivery; no documented library"
    },
    {
      "claim": "reach.platforms",
      "label": "Platforms",
      "talkie": "Mac, iPhone, Watch",
      "competitor": "Win, Mac, iPhone; Android via Telegram"
    }
  ]
}
```

**Why this set**

| Row | Why keep | Fairness note |
| --- | --- | --- |
| Best for | Orientation | Parallel density; both sound desirable |
| Speech processing | Privacy / offline / hybrid | DictaFlow is not “cloud-only”; Talkie is not “everything local” |
| Default output | Writing-style split | Category difference, not a Talkie win |
| Locked-down apps | Hard DictaFlow differentiator | Talkie is an explicit non-fit |
| After you speak | Hard Talkie differentiator | `not_advertised`, not “DictaFlow fails” |
| Platforms | Hard reach split | Telegram qualifier restored |

**Dropped: Automation** — Talkie’s CLI story stays in picks + narrative; putting it as a matrix row forces a fake comparison. Optional alternative if product insists on seven rows: add vocabulary instead.

**Optional seventh row (prefer over Automation):**

```json
{
  "claim": "output.dictionary",
  "label": "Specialized vocabulary",
  "talkie": "No published dictionary today",
  "competitor": "Medical, legal, technical terms"
}
```

Requires Talkie claim already present (`output.dictionary`) — yes. DictaFlow claim already present — yes.

### Sample narrative trims (MDX)

**Short version (keep, slight tighten):**

> **Short version:** Choose DictaFlow for Windows, AI-polished long-form, selected-text editing, or Citrix/RDP/VMware. Choose Talkie for on-device core recognition on Apple devices and a capture library you can search and script.

**After matrix move**, cut repeated platform/automation lists from “Where Talkie is different” down to two short paragraphs + link to `/workflows/dictate-to-claude/` instead of re-proving the matrix.

### Visual treatment — exact intent

1. **Equal columns.** Same header color for Talkie and competitor (`--ink-muted` or both `--ink`). No accent left rail on column 2 only.
2. **Equal picks.** Either both cards neutral, or both get a thin product-tint only on the eyebrow label — never Talkie-only top border.
3. **Decision labels.** Prefer the short labels above; optional secondary line from `dimension.buyerQuestion` at 10px muted if space allows (desktop only).
4. **Type scale.** Factor label ≥11px; cell body 12–13px; picks title 17–18px; picks bullets 12px.
5. **Maturity as quiet metadata, not score.** Only when `maturity` ∈ `{conceded_gap, not_advertised}` show a 9–10px mono tag under the cell:
   - Talkie locked-down apps → `gap`
   - DictaFlow after-you-speak / (if kept) automation → `not documented`
   - Never red/green; use `--ink-subtle`.
6. **No win icons, no dimmed “losing” column background.**

---

## Exact code changes (do not apply yet)

### 1. `data/comparison/pages.json` — DictaFlow entry

Replace the `dictaflow` object with the sample JSON above (and optional vocabulary row if you accept 7 rows).

Also stop reusing the identical Talkie pick package on aqua/wispr in a follow-up; each competitor page should answer *vs this product*.

### 2. `components/blog/EvidenceComparison.jsx`

Structural target:

```jsx
export default function EvidenceComparison({ competitor: competitorSlug }) {
  const { competitor, page, rows, sources } = getEvidenceComparison(competitorSlug)

  return (
    <section
      id="comparison-matrix"
      className="evidence-comparison not-prose"
      aria-label={`Talkie and ${competitor.name} comparison`}
    >
      <header className="evidence-comparison__header">
        <p className="evidence-comparison__eyebrow">How to choose</p>
        <h2 className="evidence-comparison__title">
          Talkie and {competitor.name}, side by side
        </h2>
      </header>

      <div className="evidence-comparison__picks">
        {/* equal articles; no first-child special casing required in CSS */}
        <article data-side="talkie">…</article>
        <article data-side="competitor">…</article>
      </div>

      <div className="comparison-table" role="region" aria-label="Decision factors" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Decision factor</th>
              <th scope="col">Talkie</th>
              <th scope="col">{competitor.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <th scope="row">
                  <span className="evidence-comparison__label">{row.label}</span>
                  {/* optional: row.dimension?.buyerQuestion */}
                </th>
                <td data-column="Talkie">
                  <span className="evidence-comparison__value">{row.talkieDisplay}</span>
                  <MaturityNote claim={row.talkie} />
                </td>
                <td data-column={competitor.name}>
                  <span className="evidence-comparison__value">{row.competitorDisplay}</span>
                  <MaturityNote claim={row.competitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="evidence-comparison__sources">…</footer>
    </section>
  )
}

function MaturityNote({ claim }) {
  if (claim.maturity === 'conceded_gap') {
    return <span className="evidence-comparison__maturity">Known gap</span>
  }
  if (claim.maturity === 'not_advertised') {
    return <span className="evidence-comparison__maturity">Not documented publicly</span>
  }
  return null
}
```

Notes:

- Use `<th scope="row">` for the factor column (a11y + style hook).
- `MaturityNote` must use the **resolved claim maturity**, not the compact override string — already available as `row.talkie` / `row.competitor` from `lib/comparisons.js`.
- Keep `publicClaim()` planned-claim behavior unchanged.

### 3. `components/IdeaLayout.jsx` — CSS deltas

In the `.evidence-comparison` / `.comparison-table` block:

| Remove / neutralize | Replace with |
| --- | --- |
| `.comparison-table thead th:nth-child(2) { color: var(--amber) }` | both product headers: `color: var(--ink)` or `--ink-muted` equally |
| `.comparison-table th/td:nth-child(2) { border-left: accent }` | equal cell borders on both product columns |
| `.evidence-comparison__picks article:first-child { border-top-color: accent }` | identical borders on both cards |
| `.evidence-comparison__picks article:first-child > span { color: var(--amber) }` | both eyebrows `--ink-subtle`, or both get a non-ranking treatment |

Type scale:

```css
.evidence-comparison .comparison-table table {
  font-size: 12.5px;
  line-height: 1.45;
  border-spacing: 0 0.4rem;
}
.evidence-comparison__label {
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.evidence-comparison__maturity {
  display: block;
  margin-top: 0.25rem;
  font-family: var(--font-mono, ui-monospace, Menlo, monospace);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-subtle);
}
.evidence-comparison__picks h3 { font-size: 17px; }
.evidence-comparison__picks li { font-size: 12px; }
```

Optional: slightly raise pick cards above the table with `margin-bottom: 1rem` so picks = “who”, table = “why”.

### 4. `content/ideas/talkie-vs-dictaflow.mdx`

1. Move `<EvidenceComparison competitor="dictaflow" />` to immediately after the short-version paragraph (before `## What DictaFlow does well`).
2. Delete the `## Side by side` heading once the component self-titles.
3. Trim “Where Talkie is different” so it does not restate every matrix cell; keep one paragraph on local boundary language and one on CLI/agents with links.
4. Keep download CTA + related reading.

### 5. `lib/comparisons.js` — small optional expose

If buyer questions are shown:

```js
// already returns dimension on each row via dimensionById
// ensure row.dimension is the full object (already is)
```

No logic change required for maturity notes if the component reads `row.talkie.maturity`.

### 6. `scripts/validate-comparison-data.mjs` — optional tighten

Keep existing: no `business.*`, ≤7 rows, ≤40 chars.

Suggested additions (non-blocking warnings first):

- Warn if Talkie pick title is reused across ≥3 pages.
- Warn if display string for a claim drops a qualifier present in the catalog value (hard); or specifically assert DictaFlow `reach.platforms` display includes `Telegram` if claim value does.
- Allow maturity tags without counting toward 40-char cell limit (they are not in `row.talkie` display strings).

### 7. Do not change unless evidence changes

- `data/comparison/products/competitors.json` DictaFlow claims are sound for 2026-07-22.
- Prefer fixing **page display overrides** over rewriting catalog values, except if Android/Telegram needs a shorter catalog value for reuse.

---

## Acceptance criteria

After implementation, a cold reader at `#comparison-matrix` should be able to answer:

1. Which product fits **Windows + Citrix**? → DictaFlow  
2. Which product fits **Apple + searchable captures + CLI**? → Talkie  
3. Is Talkie worse at dictation quality in general? → **Not claimed**; output style differs  
4. Is pricing a factor on the page? → **No**  
5. Does either column look “selected” by color alone? → **No**  
6. Is Android listed without Telegram? → **No**

Also re-run:

```bash
bun run comparison:check
```

and spot-check desktop + 390px mobile on DictaFlow, plus one non-enterprise page (e.g. Otter) to ensure equal-column CSS does not break archetype-specific copy.

---

## Priority order for implementers

1. **Content:** rewrite DictaFlow `pages.json` picks + rows (sample above).  
2. **CSS:** neutralize Talkie championship styling.  
3. **MDX:** move matrix up; drop redundant “Side by side”.  
4. **Component:** maturity notes + self-contained heading.  
5. **Validator warnings** and cross-page pick de-duplication (follow-up).

---

## Out of scope / deferred

- Full redesign of all 10 competitor pages’ row sets (reuse principles; customize picks per rival).
- Expanding official sources beyond DictaFlow product/FAQ (single source is thin for enterprise claims; re-research pass later).
- Accuracy benchmarks.
- Pricing tables.

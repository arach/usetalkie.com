# Comparison system

The public comparison pages are buyer guides, not scorecards. Their source of truth is the evidence catalog in `data/comparison/`, while the MDX files own only the narrative around each comparison.

## The question each page answers

Every page must establish the products' jobs before comparing capabilities. A meeting assistant, a batch file transcriber, an accessibility controller, an operating-system dictation feature, and an AI writing tool should not inherit the same rows.

The stable dimensions are:

1. Job to be done
2. Capture and input
3. Recognition and processing
4. Output and refinement
5. Data ownership and retrieval
6. Automation and integration
7. Platform and device reach
8. Collaboration and control
9. Business facts

Business facts are deliberately separate from the feature matrix. Price belongs in a page only when both products have current, sourced, genuinely comparable commercial facts. A Talkie cell that says only “see plans” is not a comparison and must not render.

## Product archetypes

| Archetype | Products | Foreground | Usually omit |
| --- | --- | --- | --- |
| Live dictation / AI writing | Apple Dictation, Aqua Voice, DictaFlow, Superwhisper, Wispr Flow | processing, refinement, context, data record, reach | meeting collaboration unless the product offers it |
| File and media transcription | Aiko, MacWhisper | sources, model choice, diarization, editing, export | treating absent live dictation as a defect |
| Meeting assistant | Otter | meeting capture, speakers, summaries, team record, integrations | CLI as a yes/no score |
| Voice control / accessibility | Talon | hands-free control, grammars, scripting, platforms | searchable capture library unless relevant |
| Professional dictation | Dragon | platform availability, vocabulary, commands, deployment | agent CLI as a proxy for automation quality |

Competitors can belong to more than one archetype. The page configuration in `data/comparison/pages.json` selects the actual rows; it does not blindly render every claim in either product inventory.

## Evidence model

Each product claim is an object with:

- `dimension` and `label`
- a concise public `value`
- `maturity`: `verified`, `planned`, `unknown`, `conceded_gap`, or `not_advertised`
- `confidence`: `high`, `medium`, or `low`
- repository evidence for Talkie or official source IDs for competitors
- a checked date at the product level
- an optional internal `editorialNote`

Talkie additionally records the user outcome, supported platforms, and privacy/data boundary. A planned Talkie claim must have a safe `publicValue`; the renderer never exposes roadmap language as a shipped feature.

`not_advertised` means that current official product material did not document a capability. It does not prove that the capability is impossible or absent from every private/enterprise edition. Public copy should preserve that distinction.

## Data-boundary language

Never use “everything is local” as a shorthand. Keep these three questions separate:

1. Where does core speech recognition run?
2. Where is the resulting capture stored or synced?
3. Does an optional workflow send the transcript or media to a configured provider?

For Talkie, core recognition can run locally. Enabled iCloud sync uses CloudKit, and user-configured AI workflows can introduce another provider boundary. Those facts can coexist.

## Fairness rules

- Lead with a competitor's strongest, intended workflow.
- A category difference is not an automatic loss.
- Do not use “No” when the defensible evidence is only “not documented in current official material.”
- Do not publish accuracy, words-per-minute, or language totals for Talkie without a dated, reproducible benchmark.
- Do not repeat a vendor benchmark as an independent ranking.
- Use official sources for current competitor claims. Add a checked date and re-check time-sensitive facts.
- Prefer a clear concession over a euphemism. Meeting collaboration, full hands-free control, batch media processing, diarization, deep cloud rewriting, and cross-platform reach are real competitor strengths.
- Keep the table compact enough to make one decision. The capability inventory is intentionally larger than any one page.

## Maintenance flow

1. Update the relevant product claims and sources.
2. Change a page's row list only when the buyer's decision factors change.
3. Run `bun run comparison:check`.
4. Render the affected pages on desktop and mobile.
5. Re-read the narrative for contradictions with the structured table.

The current competitor evidence was checked on 2026-07-22. The validator warns when review dates become stale; a stale warning is a request to research again, not permission to copy the previous claim forward.

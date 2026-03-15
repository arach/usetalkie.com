// All content data for the "From Voice Memos to Structured Knowledge" post.
// Kept in JS so MDX doesn't have to parse complex string props.

export const obsidianNotes = {
  "mobile-app": {
    title: "mobile-app.md",
    content: [
      "# Mobile App",
      "",
      '> "The mobile app could be this really focused, voice-first',
      "> experience — just the core features, none of the desktop baggage.\"",
      "",
      "## Why it exists",
      "Desktop users want a different thing than mobile users. This acknowledges that.",
      "",
      "## Open Questions",
      "- How much of the core engine should be shared vs rebuilt?",
      "- Is this a separate product or a companion app?",
      "",
      "## Connects to",
      "- [[Product Launch]] — needs to ship before the launch push",
      "- [[Marketing Strategy]] — could be the breakout narrative",
      "- [[Onboarding Flow]] — first-run experience matters more on mobile",
    ].join("\n"),
  },
}

export const prompts = {
  "extract-topics": {
    title: "Prompt 1 — Extract Topics",
    prompt: [
      "Here are my voice memo transcripts from the past two weeks.",
      "Read them all as a single stream of consciousness and identify",
      "the distinct topics, themes, or threads that appear across",
      "multiple memos.",
      "",
      "For each topic:",
      "- Give it a clear name",
      "- Write a 1-2 sentence summary",
      "- Note which memos it appears in",
      "- Flag whether it's an idea, an active project, or a decision",
      "",
      "Don't summarize each memo individually. I want cross-cutting",
      "themes, not per-memo summaries.",
      "",
      "[paste all transcripts here]",
    ].join("\n"),
    annotations: [
      {
        text: "Read them all as a single stream of consciousness",
        note: "This framing prevents the model from treating each memo in isolation. By thinking of them as one continuous stream, it naturally finds threads that weave across recordings.",
      },
      {
        text: "cross-cutting themes, not per-memo summaries",
        note: "Explicitly stating what you DON'T want is just as important as what you do want. Without this, most models default to summarizing each memo separately.",
      },
      {
        text: "Flag whether it's an idea, an active project, or a decision",
        note: "This classification makes the output immediately actionable — ideas need exploration, projects need tracking, decisions need documenting.",
      },
    ],
  },

  "generate-topic-files": {
    title: "Prompt 2 — Generate Topic Files",
    prompt: [
      "For each topic below, create an Obsidian markdown file with:",
      "",
      "- YAML frontmatter: tags, status (idea/active/thinking/ongoing),",
      "  first_mentioned date",
      "- A section with the core idea, using a direct quote from the",
      "  transcripts where possible",
      '- An "Open Questions" section with unresolved threads',
      '- A "Related" section with [[wikilinks]] to other topics',
      "  from the list",
      "",
      "Keep the voice natural — these should sound like me thinking,",
      "not a report. Use my actual words from the transcripts.",
      "",
      "Topics: [paste topic list]",
      "Source transcripts: [paste transcripts]",
    ].join("\n"),
    annotations: [
      {
        text: "YAML frontmatter: tags, status",
        note: "Obsidian's Dataview plugin can query frontmatter fields — adding status and first_mentioned date makes your vault queryable as a lightweight project tracker.",
      },
      {
        text: "using a direct quote from the transcripts where possible",
        note: "Verbatim quotes preserve the energy of the original thought. Summaries lose nuance and flatten your voice into generic text.",
      },
      {
        text: "[[wikilinks]] to other topics from the list",
        note: "Cross-linking is what makes this a knowledge graph instead of a folder of files. Every wikilink becomes a visible edge in Obsidian's graph view.",
      },
      {
        text: "sound like me thinking, not a report",
        note: "Without this constraint, LLMs default to formal, third-person summaries. Your knowledge base should sound like you — it's your second brain, not a corporate memo.",
      },
    ],
  },

  "generate-daily-notes": {
    title: "Prompt 3 — Generate Daily Notes",
    prompt: [
      "For each day that has memos, create a daily note in Obsidian",
      "format with:",
      "",
      "- YAML frontmatter: date, source memo IDs, tags",
      "- Bullet-point summary of what was discussed that day",
      "- [[Wikilinks]] to the relevant topic files wherever a",
      "  theme is mentioned",
      "- Direct quotes for anything particularly clear or decisive",
      "",
      "Group multiple memos from the same day into one daily note.",
      "Keep it scannable — someone should be able to read a daily",
      "note in 30 seconds and know what that day was about.",
      "",
      "Memos: [paste transcripts grouped by day]",
      "Topic files: [list your topic names]",
    ].join("\n"),
    annotations: [
      {
        text: "Group multiple memos from the same day into one daily note",
        note: "You might record 3 memos on a busy day. Merging them into one daily note prevents fragmentation and gives you a single view of each day.",
      },
      {
        text: "read a daily note in 30 seconds",
        note: "Setting a time constraint implicitly controls length and density. The model will prioritize the most important points when it knows the output needs to be scannable.",
      },
      {
        text: "Direct quotes for anything particularly clear or decisive",
        note: "Decisions often happen in a single sentence buried in 5 minutes of rambling. Pulling those quotes out makes them findable later.",
      },
    ],
  },

  "generate-index": {
    title: "Prompt 4 — Generate Index",
    prompt: [
      "Create an INDEX.md for an Obsidian vault with:",
      "",
      "- A table of all topics with status and first-mentioned date",
      "- A timeline of daily notes with a one-line summary of each",
      "- [[Wikilinks]] to everything",
      "",
      "This is the entry point. Someone opening this vault for the",
      "first time should understand the full landscape in 60 seconds.",
      "",
      "Topics: [list topics]",
      "Daily notes: [list dates with summaries]",
    ].join("\n"),
    annotations: [
      {
        text: "the entry point",
        note: "Framing the index as an 'entry point' rather than a 'summary' tells the model to optimize for navigation, not completeness. You want links and structure, not prose.",
      },
      {
        text: "understand the full landscape in 60 seconds",
        note: "Another time constraint that drives conciseness. The index should be a map, not a book.",
      },
    ],
  },
}

export const codeBlocks = {
  "file-structure": {
    label: "File structure",
    code: [
      "topics/",
      "  API Redesign.md",
      "  Mobile App.md",
      "  Product Launch.md",
      "  Marketing Strategy.md",
      "  Pricing Model.md",
      "  Onboarding Flow.md",
      "  Health & Sustainability.md",
      "",
      "daily/",
      "  2026-03-15.md  \u2192  links to 3 topics",
      "  2026-03-14.md  \u2192  links to 4 topics",
      "  2026-03-10.md  \u2192  links to 3 topics",
      "  2026-03-09.md  \u2192  links to 3 topics",
    ].join("\n"),
  },
}

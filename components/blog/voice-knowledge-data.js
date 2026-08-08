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
    title: "Prompt 1: Extract topics",
    prompt: [
      "Review all voice memo transcripts as one input.",
      "Identify the distinct topics, themes, or threads that appear",
      "across multiple memos.",
      "",
      "For each topic:",
      "- Give the topic a clear name.",
      "- Write a summary in one or two sentences.",
      "- List the memos that contain the topic.",
      "- Classify the topic as an idea, an active project, or a decision.",
      "",
      "Do not create one summary for each memo.",
      "Return the topics that connect multiple memos.",
      "",
      "Transcripts:",
      "[paste all transcripts here]",
    ].join("\n"),
    annotations: [
      {
        text: "Review all voice memo transcripts as one input",
        note: "This instruction makes the model compare all transcripts before it groups the topics.",
      },
      {
        text: "Do not create one summary for each memo",
        note: "This exclusion prevents a separate summary for every memo.",
      },
      {
        text: "Classify the topic as an idea, an active project, or a decision",
        note: "The classification gives each topic a useful state.",
      },
    ],
  },

  "generate-topic-files": {
    title: "Prompt 2: Create topic files",
    prompt: [
      "Create one Obsidian Markdown file for each topic.",
      "",
      "Include these fields and sections:",
      "- YAML frontmatter with tags, status, and first_mentioned.",
      "- A Core idea section. Use a direct quote from the transcripts",
      "  when one is available.",
      "- An Open questions section for unresolved points.",
      "- A Related section with [[wikilinks]] to other topics in the list.",
      "",
      "Preserve the speaker's natural voice.",
      "Use exact words from the transcripts when they express the idea clearly.",
      "Do not write the file as a formal report.",
      "",
      "Topics:",
      "[paste topic list]",
      "",
      "Source transcripts:",
      "[paste transcripts]",
    ].join("\n"),
    annotations: [
      {
        text: "YAML frontmatter with tags, status, and first_mentioned",
        note: "Obsidian and Dataview can query these fields.",
      },
      {
        text: "Use a direct quote from the transcripts",
        note: "A direct quote preserves the original wording.",
      },
      {
        text: "[[wikilinks]] to other topics in the list",
        note: "Wikilinks create links between related topic files.",
      },
      {
        text: "Do not write the file as a formal report",
        note: "This instruction prevents a formal summary from replacing the speaker's voice.",
      },
    ],
  },

  "generate-daily-notes": {
    title: "Prompt 3: Create daily notes",
    prompt: [
      "Create one Obsidian daily note for each date that has memos.",
      "",
      "Include:",
      "- YAML frontmatter with the date, source memo IDs, and tags.",
      "- A bullet list that summarizes the topics discussed on that date.",
      "- [[Wikilinks]] to each relevant topic file.",
      "- Direct quotes for clear decisions or statements.",
      "",
      "Combine all memos from the same date in one daily note.",
      "Keep the daily note short enough to review in 30 seconds.",
      "",
      "Memos grouped by date:",
      "[paste transcripts]",
      "",
      "Topic files:",
      "[list topic names]",
    ].join("\n"),
    annotations: [
      {
        text: "Combine all memos from the same date in one daily note",
        note: "One note per date reduces fragmentation.",
      },
      {
        text: "short enough to review in 30 seconds",
        note: "The time limit controls the length of the daily note.",
      },
      {
        text: "Direct quotes for clear decisions or statements",
        note: "Direct quotes make decisions easier to find.",
      },
    ],
  },

  "generate-index": {
    title: "Prompt 4: Create the index",
    prompt: [
      "Create an INDEX.md file for the Obsidian vault.",
      "",
      "Include:",
      "- A table of all topics with status and first-mentioned date.",
      "- A timeline of daily notes with a one-line summary for each date.",
      "- [[Wikilinks]] to every topic file and daily note.",
      "",
      "Use INDEX.md as the entry point to the vault.",
      "Make the full topic landscape clear within 60 seconds.",
      "",
      "Topics:",
      "[list topics]",
      "",
      "Daily notes:",
      "[list dates with summaries]",
    ].join("\n"),
    annotations: [
      {
        text: "Use INDEX.md as the entry point to the vault",
        note: "An entry point prioritizes navigation.",
      },
      {
        text: "clear within 60 seconds",
        note: "The time limit keeps the index concise.",
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

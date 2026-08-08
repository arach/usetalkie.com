# Voice memos to Obsidian: four prompts

Use these prompts to turn a batch of voice memo transcripts into linked Obsidian Markdown files.

## Before you start

1. Export the voice memo transcripts that you want to process.
2. Create a backup of the target Obsidian vault.
3. Run Prompt 1 with all transcripts.
4. Run Prompts 2 through 4 with the requested inputs.
5. Review the generated files before you add them to the vault.

Talkie stores the source transcripts on your Mac. A hosted model receives any transcript text that you paste into it. Use a local model if the transcript text must stay on your Mac.

## Prompt 1: Extract topics

```text
Review all voice memo transcripts as one input.
Identify the distinct topics, themes, or threads that appear
across multiple memos.

For each topic:
- Give the topic a clear name.
- Write a summary in one or two sentences.
- List the memos that contain the topic.
- Classify the topic as an idea, an active project, or a decision.

Do not create one summary for each memo.
Return the topics that connect multiple memos.

Transcripts:
[paste all transcripts here]
```

Expected result: A topic list that identifies connections across multiple memos.

## Prompt 2: Create topic files

```text
Create one Obsidian Markdown file for each topic.

Include these fields and sections:
- YAML frontmatter with tags, status, and first_mentioned.
- A Core idea section. Use a direct quote from the transcripts
  when one is available.
- An Open questions section for unresolved points.
- A Related section with [[wikilinks]] to other topics in the list.

Preserve the speaker's natural voice.
Use exact words from the transcripts when they express the idea clearly.
Do not write the file as a formal report.

Topics:
[paste topic list]

Source transcripts:
[paste transcripts]
```

Expected result: One linked Markdown file for each topic.

## Prompt 3: Create daily notes

```text
Create one Obsidian daily note for each date that has memos.

Include:
- YAML frontmatter with the date, source memo IDs, and tags.
- A bullet list that summarizes the topics discussed on that date.
- [[Wikilinks]] to each relevant topic file.
- Direct quotes for clear decisions or statements.

Combine all memos from the same date in one daily note.
Keep the daily note short enough to review in 30 seconds.

Memos grouped by date:
[paste transcripts]

Topic files:
[list topic names]
```

Expected result: One concise daily note for each date.

## Prompt 4: Create the index

```text
Create an INDEX.md file for the Obsidian vault.

Include:
- A table of all topics with status and first-mentioned date.
- A timeline of daily notes with a one-line summary for each date.
- [[Wikilinks]] to every topic file and daily note.

Use INDEX.md as the entry point to the vault.
Make the full topic landscape clear within 60 seconds.

Topics:
[list topics]

Daily notes:
[list dates with summaries]
```

Expected result: One index that links to every topic file and daily note.

## Related resources

- [Read the full batch workflow](https://usetalkie.com/ideas/from-voice-memos-to-structured-knowledge/).
- [Use the automated single-memo workflow](https://usetalkie.com/workflows/voice-memo-to-obsidian/).

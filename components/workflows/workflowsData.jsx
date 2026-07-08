// ---------------------------------------------------------------------------
// Single source of truth for the 6 starting-point workflows.
// Consumed by:
//   - WorkflowsPage.jsx  (index cards under "Starting Points")
//   - WorkflowDetailPage.jsx via app/workflows/[slug]/page.jsx (full pages)
//
// Detail copy (headline / subhead / when / steps / setup / variations) authored
// by @missionwriter. Index one-liners (`body`) keep the original site copy.
// ---------------------------------------------------------------------------

import {
  Mic,
  Cpu,
  Copy,
  Mail,
  FileOutput,
  PencilLine,
  GitCompare,
  Terminal,
  Bot,
  Github,
} from 'lucide-react'

export const WORKFLOWS = [
  {
    slug: 'dictate-to-claude',
    name: 'Dictate → Claude',
    flow: 'Dictate · LLM · Clipboard',
    icons: [Mic, Cpu, Copy],
    body: 'Say the prompt out loud. Talkie cleans it up and leaves it ready to send.',
    outcome: 'PASTE-READY',
    headline: { lead: 'Speak the prompt,', accent: 'paste it clean' },
    subhead: 'Talk out a rough prompt and get back a tightened version on your clipboard.',
    when:
      'You know what you want to ask, but talking is faster than typing it. Say it loose. Talkie captures the signal and hands back something you can drop straight into any chat box.',
    steps: [
      { icon: Mic, label: 'Dictate', what: 'Capture speech into {{TRANSCRIPT}}.' },
      { icon: Cpu, label: 'LLM · Claude', what: 'Restructure {{TRANSCRIPT}} into a clean prompt.' },
      { icon: Copy, label: 'Clipboard', what: 'Copy {{LAST_OUTPUT}}. Ready to paste.' },
    ],
    setup: [
      'Pick the model (Claude, or Local MLX to stay on device).',
      'Set the cleanup instruction: fix grammar, keep intent, no preamble.',
      'Add your key if the model needs one.',
    ],
    variations: [
      'Swap Clipboard for Save to File at @Inbox to keep a log of prompts.',
      'Swap Claude for Local MLX when the text should never leave the machine.',
      'Prefer the terminal? Pull the result with @talkie/cli and pipe it to the claude CLI.',
    ],
  },
  {
    slug: 'dictate-to-email',
    name: 'Dictate → Email',
    flow: 'Dictate · LLM · Mail',
    icons: [Mic, Cpu, Mail],
    body: 'Talk through the reply in your own words. Open a polished draft in Mail.',
    outcome: 'DRAFT IN MAIL',
    headline: { lead: 'Talk the reply,', accent: 'draft it in Mail' },
    subhead: 'Speak your answer in plain words and open a finished draft in Mail.app.',
    when:
      'The reply is clear in your head, but writing it out is the slow part. Say what you mean. Talkie shapes it into an email body and opens the draft so you review before anything sends.',
    steps: [
      { icon: Mic, label: 'Dictate', what: 'Capture the spoken reply into {{TRANSCRIPT}}.' },
      { icon: Cpu, label: 'LLM', what: 'Rewrite {{TRANSCRIPT}} as an email body, generate a subject from {{SUMMARY}}.' },
      { icon: Mail, label: 'Email · Mail.app', what: 'Open a draft with {{LAST_OUTPUT}}. Nothing sends automatically.' },
    ],
    setup: [
      'Pick the model and set a tone instruction (direct, warm, formal).',
      'Optionally set a default recipient, or leave it blank to fill per use.',
    ],
    variations: [
      'Swap Mail for Webhook to post the draft into Slack instead.',
      'Add a Save to File step at @Inbox to keep a copy of every reply.',
    ],
  },
  {
    slug: 'voice-memo-to-obsidian',
    name: 'Voice memo → Obsidian',
    flow: 'Memo · LLM · Save',
    icons: [Mic, Cpu, FileOutput],
    body: 'Record the messy thought. Save the useful version as Markdown in your vault.',
    outcome: 'NOTE FILED',
    headline: { lead: 'Messy memo,', accent: 'filed as Markdown' },
    subhead: 'Record the raw thought and save the useful version to your vault.',
    when:
      'An idea shows up and you do not want to open anything. Talk it through, tangents and all. Talkie distills it to a clean note and writes it into @Notes with a title and date already set.',
    steps: [
      { icon: Mic, label: 'Dictate', what: 'Record the memo into {{TRANSCRIPT}}.' },
      { icon: Cpu, label: 'LLM', what: 'Distill {{TRANSCRIPT}} into a titled note, set {{TITLE}}.' },
      { icon: FileOutput, label: 'Save to File', what: 'Write Markdown to @Notes/{{DATE}}-{{TITLE}}.md.' },
    ],
    setup: [
      'Map @Notes to your Obsidian vault directory.',
      'Pick the model and the distill instruction.',
      'Set the filename template ({{DATE}}-{{TITLE}}.md).',
    ],
    variations: [
      'Route to @Journal for dated daily entries instead of standalone notes.',
      'Skip the LLM step to file the raw {{TRANSCRIPT}} verbatim.',
    ],
  },
  {
    slug: 'iterate-in-compose',
    name: 'Iterate on a memo → Talkie Compose',
    flow: 'Memo · Compose · Diff',
    icons: [Mic, PencilLine, GitCompare],
    body: 'Keep the raw take. Make a tighter version next to it, without losing the first one.',
    outcome: 'BOTH DRAFTS KEPT',
    headline: { lead: 'Same take,', accent: 'tighter second pass' },
    subhead: 'Keep the raw recording and build a cleaner version beside it.',
    when:
      'The first take has the right idea buried in extra words. You want the tighter version without losing the original phrasing. Talkie Compose holds both, so you can compare and pull the best lines across.',
    steps: [
      { icon: Mic, label: 'Memo', what: 'Capture the raw take into {{TRANSCRIPT}}.' },
      { icon: PencilLine, label: 'Compose', what: 'Write a tighter pass into {{LAST_OUTPUT}}. The original is preserved.' },
      { icon: GitCompare, label: 'Diff', what: 'Store both {{TRANSCRIPT}} and {{LAST_OUTPUT}} side by side.' },
    ],
    setup: [
      'Pick the model and set the "tighten, do not rewrite meaning" instruction.',
      'Confirm keep-original is on.',
      'Set the @Drafts alias for where pairs land.',
    ],
    variations: [
      'Run a second LLM pass for a headline or summary line on top.',
      'Point the save at @Notes when the tighter version is the keeper.',
    ],
  },
  {
    slug: 'quick-idea-to-cli',
    name: 'Quick idea → Claude + @talkie/cli',
    flow: 'Capture · CLI · Claude',
    icons: [Mic, Terminal, Bot],
    body: 'Capture the spark, pull it from the CLI, and hand it to Claude when it needs a second pass.',
    outcome: 'READY FOR CLAUDE',
    prereq: 'Requires CLI access',
    headline: { lead: 'Catch the spark,', accent: 'pull it later' },
    subhead: 'Capture an idea by voice and hand it to Claude from the terminal when you are ready.',
    when:
      'The idea lands while you are mid-task and you do not want to break flow. Say it, let it queue. Later, pull it from the CLI and give it to Claude for a real second pass.',
    steps: [
      { icon: Mic, label: 'Capture', what: 'Capture the idea, save to @Inbox/{{DATE}}-{{TITLE}}.md.' },
      { icon: Terminal, label: 'CLI', what: '@talkie/cli reads the latest entry from @Inbox.' },
      { icon: Bot, label: 'Claude', what: 'Hand the entry to Claude for expansion or a second pass.' },
    ],
    setup: [
      'Install @talkie/cli.',
      'Allowlist the claude binary in the Shell step.',
      'Map the @Inbox alias to a real directory.',
    ],
    variations: [
      'Swap Claude for Local MLX to keep the pass on device.',
      'Pipe the CLI output through jq or gh for other targets.',
    ],
  },
  {
    slug: 'bug-note-to-github',
    name: 'Bug note → GitHub issue',
    flow: 'Dictate · Shell · GitHub',
    icons: [Mic, Terminal, Github],
    body: 'Describe the bug while it is fresh. Turn it into a title, body, and issue command.',
    outcome: 'ISSUE OPENED',
    prereq: 'Requires CLI access',
    headline: { lead: 'Say the bug,', accent: 'open the issue' },
    subhead: 'Describe a bug out loud and turn it into a filed GitHub issue.',
    when:
      'You hit a bug and the details are sharp right now. Talk through what broke and what you expected. Talkie shapes a title and body, then runs the command that opens the issue.',
    steps: [
      { icon: Mic, label: 'Dictate', what: 'Capture the bug report into {{TRANSCRIPT}}.' },
      { icon: Cpu, label: 'LLM', what: 'Generate a {{TITLE}} and a structured body from {{TRANSCRIPT}}.' },
      { icon: Github, label: 'Shell · gh', what: 'Run gh issue create with {{TITLE}} and {{LAST_OUTPUT}}.' },
    ],
    setup: [
      'Allowlist the gh binary in the Shell step.',
      'Set the default repo, or resolve it from the current directory.',
      'Pick the model and a "repro steps, expected, actual" body format.',
    ],
    variations: [
      'Swap gh for a Webhook into Linear or Jira.',
      'Add a Notification step confirming the issue number on success.',
    ],
  },
]

export function getWorkflow(slug) {
  return WORKFLOWS.find((w) => w.slug === slug)
}

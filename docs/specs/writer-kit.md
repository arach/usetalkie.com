# Talkie Writer Kit

A consolidated reference for any writer (human or agent) joining the usetalkie.com copy surface. Read top to bottom before suggesting changes.

**Assembled:** 2026-05-14
**Snapshot of:** all currently shipping user-facing copy on usetalkie.com
**Source of truth:** the source files referenced inline. This kit is a calibration document, not the canonical copy.

---

## How to use this kit

1. Read **Brand voice contract** first. These are durable rules the copy respects.
2. Skim **Page corpus** to calibrate on voice in the wild. Pages are ordered by brand-voice load (strongest opinion first), not URL.
3. Respond to one of the prompts in **What we're asking for** at the end.

---

## Brand voice contract

Durable preferences captured from working with the founder. They apply across every user-facing surface, not just the page you're being asked about.

### Prose rules

**No em-dashes.** Use real punctuation instead:
- Appositive (defining a term) → colon
- Parenthetical interruption → two sentences, or commas if short
- List summary → period
- Clause continuation → comma or period

Em-dashes are a top AI-writing tell. Copy should sound spoken, not composed. (Em-dashes remain fine in JSX dev comments, just not in user-facing strings.)

**Describe behavior, not motive.** When mentioning competitors or third parties, describe what they did, not what they wanted. Observational framing is verifiable and reads as more credible founder voice.

- Wrong: "None of them wanted to be more than a dictation layer."
- Right: "None did more than dictation."

**No reveal-builds.** Don't use "X was the Y. What's behind it is Z" composed-essay scaffolding. Name the bigger thing directly.

- Wrong: "Dictation was the door. What's behind it is the actual project."
- Right: "Dictation was the start. Talkie is becoming a place to think, work, reflect."

**No "pivot" or startup-speak filler.** Don't say "ready for the pivot," "shift," "transform," "unlock." Use "what's next" or name the concrete next item.

**No marketing hyperbole.** No "revolutionize," "cutting-edge," "next-gen," "game-changing." No exclamation points outside rare CTAs. Confidence comes from specificity and constraint, not volume.

### Voice posture

**Observational, not essayistic.** The founder voice on /about is journalist-with-skin-in-the-game, not lecturer or memoirist. Notice what happened, not what should happen. Describe what tools did, not what their makers intended.

**Possession language.** "Your voice stays yours." "Your stuff is yours." "Your tools. Your rules." The site hammers ownership and control without being defensive.

**Concrete over abstract.** Taglines use concrete inputs (mic, scribble, snap, link, memo) not vague qualities (thought, signal, moment). Descriptions name what actually happens (hotkey, voice, transcribe, paste) not what it feels like.

**Parenthetical asides.** Casual interjections are fine when they feel conversational. "(of course we do that)" "(the whole thought)" "(or will live)". Don't manufacture them, but don't strip them either.

**Tagline rotation rule.** The brand line is "A ___ is all you need." Fills must be **1–2 syllables max** and **concrete inputs only** (not "thought," "signal," "moment," "breath"). Current shipping fills: mic, scribble, snap, link, memo. A callback to "Attention Is All You Need" is intentional and load-bearing.

### Design taste (relevant to copy)

**Semantically-aligned over editorial.** The brand leans into product-metaphor aesthetics: waveforms, meters, phosphor glow, oscilloscope channels, signal flow. Copy echoes this in eyebrows and section labels (`· CH-01 · MAC`, `· SIGNAL FLOW`, `· LEDGER`, `· LOG ENTRY`) but stays direct in body prose. Don't sprinkle "signal" or "channel" into body copy where a plain noun works.

**No rainbows.** Never paint cohesive elements with 4+ hues. Same-color repetition is the delight; variety lives at section level (dark/light flips), not within a single component. If you're proposing color changes, reduce, don't add.

**Italics for emphasis.** The second clause of a split headline often gets italicized in a contrasting color (phosphor green or amber). Used to isolate the kicker. Don't add italics inside body prose to "emphasize" a word.

### Anti-positioning (what Talkie is NOT)

These rejections are load-bearing brand definition. When in doubt about a feature claim, check it against these:

- **Not a second brain.** Not Notion / Obsidian / Tana category.
- **Not a race to zero-latency anything.** Not chasing realtime-voice-AI vendors.
- **Not full duplex.** Not OpenAI Advanced Voice Mode / Project Astra category.
- **Not a benchmark chase.** Not competing on model evals.
- **Not selling your voice or transcripts.** Free tier is the core local utility, always.

If the copy starts to sound like any of those categories, reframe.

---

## Page corpus

Ordered by brand-voice load: pages where the voice is doing the most editorial work first, functional/utility pages last.

### Feature flags currently active

- `SHOW_AGENTS = false` — Talkie for Agents page exists at `/agents` but isn't featured in nav.
- `SHOW_TAILSCALE_DOCS = false` — Tailscale guide hidden from docs index.

### Hidden/unlisted routes

- `/brand` — internal brand guidelines (not marketing-facing)
- `/agents` — feature-flagged
- `/thank-you` — post-signup confirmation
- `/go/app-store` — redirect

---

### /about — Founder operator log

**File:** `components/AboutPage.jsx`
**What it is:** Founder origin story, philosophy of what Talkie is becoming, founder card, connect channels. Just rewrote this surface on 2026-05-14 — it's the voice baseline.

**HERO**
```
· ABOUT · OPERATOR LOG

Your thoughts set the pace.
AI makes it work.                    [italic, phosphor green]

Talkie is a collection of apps for builders who like to own their tools.
```

**STORY**
```
· THE STORY

The point isn't to talk faster, type faster, move faster.
Sure, that helps, and of course we do that.                          [italic, muted, smaller]
It's to own the way you think and the way you work.                  [italic, phosphor green]

[side rail: 01 · LOG ENTRY · BY ARACH T.]

The way work happens now demands a different velocity. Parallel thoughts, parallel surfaces, parallel models all running at once. I lived in SuperWhisper, Wispr Flow, and dozens more. None did more than dictation. Their business models made it hard to be open. So I started building little things to keep up. They found their way back into Talkie.

A native macOS app that lives in your menu bar, transcribes locally on your Mac, and gets out of your way. No subscriptions, no cloud dependency. Press a key, speak, your words land wherever you're already working: Cursor, Slack, the terminal, the model you're talking to.

Dictation was the start. Talkie is becoming a place to think, work, reflect, push things forward. Not a second brain. Not a race to zero-latency anything. Not full duplex. Just your thoughts, your workflows, your tools.

BUILT FOR BUILDERS
```

**OPERATOR (founder card)**
```
· THE OPERATOR

Who's behind it.

ID · 001
[●] SIGNAL ACTIVE

Arach Tchoupani
· FOUNDER & ENGINEER

15+ years in tech, from software engineer to CTO. Previously co-founded Breathe Life (acquired 2022), worked at Meta on Creators and Facebook. Now focused on AI-powered tools that make work feel more natural. Based in Montreal, in SF often.

Stats: 4 ventures · 1 exit | Montreal / SF | AI pilled, voice pilled
Channels: @arach (X) | github/arach | linkedin/arach | arach.io
```

**CONNECT**
```
· CONNECT

Don't be a stranger.

Feedback, ideas, questions, or just a quick hello. They all land in the same inbox and they all get read. The fastest channels are below.

CH-01 / EMAIL
hey@usetalkie.com
Direct line. Bug reports, feature ideas, partnership stuff. All of it.
[OPEN MAIL →]

CH-02 / X / TWITTER
@usetalkieapp
Product updates, what's shipping, what's next. Reply for the fastest reply.
[FOLLOW →]

CH-03 / PHILOSOPHY
Why Talkie exists.
The principles behind the tool: local-first, sovereign, low-friction.
[READ →]
```

**FOOTER TIE-BACK**
```
· THIS IS TALKIE
A selfie. For your thoughts.
A memo is all you need.                    [italic, smaller, muted]
Voice capture, local-first, auditable signal path. Your words stay on your devices.
[SEE THE MAC →]

[Talkie for Mobile card → /mobile]
The capture device that's always with you. Keep reading →
```

---

### /philosophy — Manifesto

**File:** `components/PhilosophyPage.jsx`
**What it is:** Three observations, three principles, manifesto pull-quote. The strongest-opinion surface on the site.

**HERO**
```
· PHILOSOPHY THINKING                   [amber underline on "PHILOSOPHY"]

Your best ideas don't wait
for you to sit down.                    [italic]

Our ideas show up anywhere, at any time. On a walk, between meetings, in the middle of something unrelated. Builders know this rhythm well. Sparks arrive fast, unpolished, and usually at inconvenient times. And without a way to catch them in the moment, they slip away just as quickly.

[Waveform graphic: SIGNAL · LOCAL]
```

**OBSERVATIONS**
```
· OBSERVATIONS

Three things we noticed.

001 / DEVICES
iPhone + Mac.
Your iPhone is the perfect capture device, always on you, always ready. Your Mac is where raw ideas become real output.

002 / SILOS
Apps, clouds & AI disconnect.
Voice Memos trap ideas. AI clouds absorb them. Your thoughts get scattered, siloed, and locked in someone else's system.

003 / MISSING LINK                      [highlighted]
Something essential is missing.
A private, continuous flow between your voice and your tools.
```

**PRINCIPLES**
```
· PRINCIPLES

Three things we care about.
Pick any one to read first; the others follow.

01 · MINIMALISM
Tools should stay out of the way.
Small on purpose. No inboxes, no dashboards, no proprietary workflow. Just a quiet path from what you say to what you build.
[SIGNAL · CLEAR]

02 · OWNERSHIP
Own your voice, own your workflow.
Own your thoughts. Own your tools. Your stuff is yours, not a training set.
[LOCAL · PRIVATE]

03 · AGENCY
Wire up your own tools.
Lego, basically. Snap together what you need. Your data. Your tools. Your rules.
[YOUR TERMS]
```

**MANIFESTO PULL-QUOTE**
```
VELOCITY · SOVEREIGNTY · FLOW

"Your voice is the fastest path from thought to action. Don't let the tools slow you down."

[Audio narration button: "Hear the manifesto"]
```

**FOOTER**
```
See it in action on Mac →

[Install bay]
Voice capture, local-first, auditable signal path.
```

---

### / — Homepage

**File:** `components/home/HomePage.jsx`
**What it is:** Hero, capture modes, signal table, recovery flow, ownership, pricing, CTAs.

**Brand line (desktop hero):** `A selfie. For your brain.`
**Brand line (mobile, mid-page):** `A selfie. For your brain.`

**AGENT HANDOFF**
```
· AGENT HANDOFF

Say it once. The spec lands where work happens.

A morning voice memo can become a reviewed brief, a queued coding task, or a reply-ready handoff to your agent inbox.

[SEE WORKFLOWS →]
```

**CAPTURES (with AI-simulated demos)**
```
· CAPTURES

What it might sound like.

AI-simulated recordings. Max and Sarah are fictional to protect privacy.
```

**CAPTURE MODES**
```
· CAPTURE MODES

One voice substrate thingie. More than one use.            ["substrate" amber-underlined]

A capture can become a note, a draft, a search, or the start of a workflow. Say it once, then use it where it belongs.

· CAPTURE
Catch it before it changes.
Record on iPhone, Watch, or Mac. Transcript stays in one place.

· DICTATION
Speak straight into the work.
Hotkey on Mac. Dictate into whatever app you're already in.

· COMPOSE
Clean it up later.
Rewrite, trim, expand, once the raw take is saved. It's not going anywhere.

· RECOVERY
Find it three weeks from now.
Search across everything you've said. Talkie remembers the app, the time, and the context.

· WORKFLOWS
Turn raw speech into stuff you can use.
Voice goes in. Summaries, tasks, and files come out.

· CLI
Script against it.
Your voice data has a CLI. Pipe it, query it, build on it.
```

**RECOVERY FLOW**
```
· RECOVERY FLOW

Voice notes are easy to save. Harder to use.               ["Harder to use." italicized]

Talkie keeps enough of the moment intact that coming back later feels less like archaeology and more like picking work back up.

01. Capture in the cheapest mode.
Use the lowest-friction input available: iPhone, Watch, Mac memo, or keyboard dictation.

02. Recover the surrounding context.
Talkie remembers the transcript, time, app, and project clues that make a later search actually useful.

03. Turn it into output when you are ready.
Summaries, tasks, cleaned-up notes, diffs, and workflows happen after the idea is safely stored.
```

**OWNERSHIP**
```
· OWNERSHIP

Your voice stays yours.

Everything lives on your devices, syncs through your iCloud, transcribes on the chip you already paid for. External models are opt-in. Your keys, not ours.

U1 / Local-first library
Your recordings and transcripts stay on your devices. Not on someone else's server.

U2 / Sync through your iCloud
Sync runs through your iCloud account. No third-party servers involved.

U3 / Models on your terms
On-device, bring-your-own-key, or fully offline. All three work.

[Security architecture diagram: Your devices → Your iCloud → External models (opt-in · your keys)]
[READ HOW IT'S WIRED →]
```

**PRICING**
```
· PRICING

Free while we build.

Free. If that ever changes, it's for power-user features. Never the core local utility.

PLAN · FREE / OPEN BUILD
$0
- Full Mac, iPhone & Watch app access
- On-device transcription (Apple Silicon)
- Encrypted iCloud sync via your Apple ID
- Workflows + CLI + audit trail
- Bring your own provider keys
- No telemetry tied to your content

[DOWNLOAD · MAC →]
[iPHONE & WATCH ↗]

· ROADMAP

Honest pricing, when the time comes.

No plans to charge today. If that changes, it'll cover advanced features. Never the core local utility.

ALWAYS · Core tool · free, no exceptions
MAYBE · Pro tier · advanced + power-user features
NEVER · Selling your voice or transcripts
```

**FINAL CTA**
```
· READY TO INSTALL

Start with your Mac.

iPhone and Watch help you catch the thought. Mac is where Talkie earns its keep. DMG, App Store, or a single CLI command.

[DOWNLOAD FOR MAC →]
[HOW PRIVACY WORKS]

Why local-first matters.
The philosophy behind a little app that stays out of your way and keeps your voice on your side. Keep reading →
```

---

### /mac — Mac surface

**File:** `components/MacPage.jsx`
**What it is:** Mac-specific feature showcase. Surfaces sub-nav (Mac/Mobile/Features).

**HERO**
```
· CH-A / MAC · 16kHz

Talk to your Mac.
A mic is all you need.                  [italic]

Your Mac already runs your day. Talkie fits alongside, a menu-bar app you trigger with one hotkey. It speaks straight into whatever you're working in, and hands the cursor back when it's done. Capture a thought, shape a draft, search what you said, or kick off a workflow without ever leaving the page.
```

**SIGNAL FLOW**
```
· SIGNAL FLOW

The four-step path.

Four stages, one loop: hotkey, voice, transcribe, paste. The whole chain takes about a second, and the cursor lands right back where it started.

01 · CH-01 · TRIGGER   Hotkey       Hold to talk
02 · CH-02 · INPUT     Voice        Speak naturally
03 · CH-03 · PROCESS   Transcribe   On-device Whisper
04 · CH-04 · OUTPUT    Paste        Smart routing
```

**FEATURES**
```
· FEATURES

Six behaviors. One menu-bar app.        [second clause italicized]

Talkie behaves the same way everywhere, the same hold-to-talk, the same cursor return, the same fast search of what you said.

CH-01 — Hold-to-Talk
Press and hold. Talk. Release. No modes, no recording state to forget.

CH-02 — Return to Origin
Cursor lands back where you left it. The typing flow resumes.

CH-03 — 48-Hour Echoes
Every capture stays searchable for 48 hours by default. Never lose a fast thought.

CH-04 — Minimal HUD
A tiny waveform appears when you speak. No modal dialog, no interruption.

CH-05 — Smart Routing
Talkie pastes into the app in front of you. No copy-and-paste step.

CH-06 — Always Ready
Lives in the menu bar. One hotkey away from any app, any time.
```

**FOOTER**
```
Capture a thought. Shape a draft. Search what you said. Workflows do the rest.
[Install bay]
```

---

### /mobile — iPhone & Watch capture

**File:** `components/MobilePage.jsx`

**HERO**
```
· CH-B / MOBILE · 48.0kHz

Catch it while
it is live.                             [italic]

iPhone and Apple Watch are the fast path back into Talkie. Phone and Watch catch the thought. Mac is where you actually do something with it.
```

**INSTALL CTA**
```
· ONE LIBRARY · EVERY SURFACE

Catch it on iPhone. Finish it on Mac.   [second clause italicized]

[Install bay]
```

---

### /workflows — Workflows & pipeline catalog

**File:** `components/WorkflowsPage.jsx` (route metadata title is "Workflows — Talkie")
**What it is:** The runtime story. Voice in, anything out.

**HERO**
```
· WORKFLOWS · CATALOG

Voice in.
Anything out.                           [italic]

Talkie is two products in one signal path: a fast dictation surface and a workflow runner that turns speech into drafts, tasks, files, and CLI calls. The chain is local, auditable, and yours.
```

**CAPTURE (six behaviors, same as Mac)**
```
· CAPTURE

Six behaviors. One menu-bar app.        [second clause italicized]

The dictation surface stays the same in every app, same hold-to-talk, same return-to-origin, same fast search of what you said.

[Same 6-card grid as Mac /features section]
```

**PIPELINE**
```
· PIPELINE

Capture → Transform → Route → Log.

Every workflow is a four-stage signal chain. Plug or unplug stages. The whole chain runs on your Mac.

Status: auto-paced · local-first · auditable

01 · CH-01 · INPUT     Capture     Hold-to-talk into the focused app.
02 · CH-02 · LLM       Transform   On-device or your model of choice.
03 · CH-03 · OUTPUT    Route       CLI, file, webhook, or clipboard.
04 · CH-04 · LEDGER    Log         Local, searchable, replayable.
```

**STEP TYPES**
```
· STEP TYPES

The patch bay.

Eight stage types, mixed and matched. Each one is a small, focused module, chain them with template variables like {{TRANSCRIPT}}, {{TITLE}}, and {{DATE}}.

Available models: Anthropic · OpenAI · Gemini · Groq · Local MLX
Available variables: {{TRANSCRIPT}} · {{TITLE}} · {{DATE}}

1. LLM — Summarize, extract, restructure.
2. Shell — Run CLI tools (gh, jq, claude).
3. Save to file — Write to disk via path aliases.
4. Webhook — POST JSON to any endpoint.
5. Email — Send via Mail.app, in your voice.
6. Calendar — Create events from a transcript.
7. Clipboard — Copy result to system clipboard.
8. Notification — Native macOS alert on completion.
```

**EXAMPLES**
```
1. Dictate → Claude
Flow: Dictate · LLM · Clipboard
Outcome: PASTE-READY
Say the prompt out loud. Talkie cleans it up and leaves it ready to send.

2. Dictate → Email
Flow: Dictate · LLM · Mail
Outcome: DRAFT IN MAIL
Talk through the reply in your own words. Open a polished draft in Mail.

3. Voice memo → Obsidian
Flow: Memo · LLM · Save
Outcome: NOTE FILED
Record the messy thought. Save the useful version as Markdown in your vault.

4. Iterate on a memo → Talkie Compose
Flow: Memo · Compose · Diff
Outcome: BOTH DRAFTS KEPT
Keep the raw take. Make a tighter version next to it, without losing the first one.

5. Quick idea → Claude + @talkie/cli
Flow: Capture · CLI · Claude
Outcome: READY FOR CLAUDE
Capture the spark, pull it from the CLI, and hand it to Claude when it needs a second pass.

6. Bug note → GitHub issue
Flow: Dictate · Shell · GitHub
Outcome: ISSUE OPENED
Describe the bug while it is fresh. Turn it into a title, body, and issue command.
```

---

### /agents — Talkie for Agents (feature-flagged, hidden)

**File:** `components/AgentsPage.jsx`
**Status:** `SHOW_AGENTS = false` (page exists, not in nav)

```
· TALKIE FOR AGENTS · BETA

[Agent-focused headline]

[Voice-initiated agent loops]

· THE LOOP
[Talkie → Claude → Feedback diagram]

Recipes:
AGT-01 · Voice → GitHub Issue
AGT-02 · Voice → Claude Code
AGT-03 · Voice → Daily Standup
AGT-04 · Voice → PR Review Notes

Trigger primitives:
- Hotkey burst: Hold-to-talk fires the workflow without leaving the focused app.
- Slash phrase: Voice prefixes like "issue", "review", "summary" route to specific agents.
- Context bind: Frontmost app + current file are passed in as workflow variables.
- Local compute: Transcription on-device. Routing to Claude or local MLX is a per-stage choice.
```

---

### /tour — Product gallery

**File:** `components/TourLandingPage.jsx`

**HERO**
```
· TALKIE / TOUR

See Talkie in action.
On Mac and iPhone.                      [italic, amber]

Watch the demos at the top, then step through every screen below. Each gallery card opens a focused view with audio narration so you can hear what each piece is doing.
```

**DEMO GROUPS**
```
DEMOS

Mac
Dictate into anything you're already using. Compose, transform, ship.
Videos: Overview · Dictation

Mobile
Capture on the go. Sync via iCloud. Let your Mac do the heavy lifting later.
Videos: Recording · Capture

Full Reel
The longer story. The 60-second tour and the closing pitch.
Videos: 60-second Tour · Promo
```

---

### /security — Data posture & architecture

**File:** `components/SecurityPage.jsx`
**Note:** Detailed hero/opening copy not extracted in this pass. Section structures below are accurate; verbatim copy for hero needs a separate read.

**WHAT TALKIE STORES**
- Voice memos (locally, on your device)
- Transcripts (locally, in SQLite)
- Your library index (encrypted on disk)
- API keys you provide (macOS Keychain only)
- iCloud sync data (your Private CloudKit DB)

**WHAT TALKIE DOES NOT STORE**
- Audio files on Talkie servers
- Transcripts on Talkie servers
- Your API keys on Talkie servers
- Any library content on Talkie servers
- Usage telemetry linked to your content

**PRINCIPLES (5)**

```
01. On-device first
Your data lives in a local SQLite database file on your device's encrypted disk. It is not just "cached" locally; it is authoritative locally. Deleting the app deletes the data.

02. You own the keys
We use Apple's CloudKit for sync. Your data is encrypted with keys managed by your Apple ID. We (Talkie Systems) have no access to these keys and cannot decrypt your data.

03. On-device transcription
Transcription can stay 100% on device using Apple silicon. For later transformations, you can keep using local models or opt into external providers only when you choose to.

04. BYO providers
When you use an external provider, audio can stay on your device and only the text you choose to send leaves the machine. That keeps the trust boundary clear. Your keys are stored in the macOS Keychain and accessed only at runtime to sign requests.

05. Audit trails
Every network request initiated by a workflow is logged in a local, immutable audit trail. You can inspect exactly what text was sent to which API and when.
```

**COMPARISON TABLE**
```
Feature               | Talkie                     | Other
Audio Processing      | Local (Neural Engine)      | Cloud Server
Database Location     | Local Disk + iCloud        | Vendor's Cloud SQL
Offline Access        | 100% Full Functionality    | Limited / None
Model Training        | Never                      | Default Opt-in
API Key Ownership     | User Owned                 | Vendor Owned
```

---

### /support — Knowledge base

**File:** `components/SupportPage.jsx`

**SECTION 01: GETTING STARTED**
```
Installing Talkie
Download Talkie from the Mac App Store or install via CLI with `curl -fsSL go.usetalkie.com/install | bash`. The CLI installer downloads the app, installs the command-line tools, and launches Talkie automatically.

Your first dictation
Press the global hotkey (default: Option+D) from anywhere on your Mac to start dictating. Speak naturally, Talkie transcribes locally on your device using the Neural Engine. Press the hotkey again or click the menu bar icon to stop. Your text is copied to the clipboard automatically.

Keyboard shortcuts
Option+D starts/stops dictation. Option+T opens Talkie. You can customize these in Talkie Settings > Shortcuts. The global hotkey works system-wide, even when Talkie is in the background.
```

**SECTION 02: DATA & PRIVACY**
```
Where is my data stored?
All data lives in a local SQLite database on your Mac. If you enable iCloud sync, data is encrypted with your Apple ID keys and stored in a Private CloudKit container. Talkie Systems has zero access to your data.

Syncing across devices
Talkie uses Apple iCloud (CloudKit) to sync between your devices. Data is encrypted end-to-end with your Apple ID. Enable sync in Settings > iCloud. All synced devices must be signed into the same Apple ID.

Setting up API keys
Go to Settings > API Keys. Enter your OpenAI or Anthropic key. Keys are stored in the macOS Keychain (Secure Enclave) and only accessed at runtime. Talkie never sends your keys to our servers.
```

**SECTION 03: ADVANCED**
```
Using the CLI
The Talkie CLI lets you capture and transcribe from the terminal. Run `talkie capture` to record, `talkie list` to see recent captures, and `talkie transcribe` to process audio files. Run `talkie --help` for all commands.

Workflows & automation
Workflows let you chain AI actions on your transcriptions: summarize, extract action items, translate, or send to external services. Create workflows in Settings > Workflows or use the built-in templates.

Mobile capture
Use Talkie for iOS to capture voice memos on the go. Recordings sync to your Mac via iCloud where they are transcribed locally. The mobile app is a lightweight capture tool, all AI processing happens on your Mac.
```

**SECTION 04: TROUBLESHOOTING**
```
Microphone not working
Go to System Settings > Privacy & Security > Microphone and ensure Talkie is enabled. If the hotkey does not trigger recording, check System Settings > Privacy & Security > Accessibility. Restart Talkie after granting permissions.

Sync issues
Ensure all devices are on the same Apple ID with iCloud Drive enabled. Check Settings > iCloud in Talkie to confirm sync is active. If data is not appearing, try toggling sync off and on. Large recordings may take a few minutes to sync.

App will not launch or crashes
Try deleting and reinstalling from the App Store. If using the CLI version, run `talkie doctor` to diagnose issues. Check Console.app for crash logs. Talkie requires macOS 14 (Sonoma) or later.
```

---

### /ideas — Essay index

**File:** `components/IdeasPage.jsx`
**What it is:** Blog/essay index. Each essay lives at `/content/ideas/*.mdx`.

**HERO**
```
· IDEAS · SIGNAL LOG

Ideas in progress.

Concepts and thinking on voice, computing, and the tools we build. Some are RFCs, some are half-formed sketches, all are in flight.

[N] ENTRIES · LIVE
```

**ESSAYS (titles & paths)**
- `voice-first-computing.mdx` — "Voice-First Computing" — "On where my best ideas actually happen, and why my phone keeps missing them."
- `why-talkie-has-a-cli.mdx` — "Why Talkie has a CLI"
- `six-homepages-at-once.mdx` — "Six Homepages at Once"
- `three-layers-of-transcription.mdx` — "Three Layers of Transcription"
- `teaching-a-tiny-model-to-hear-bash.mdx` — "Teaching a Tiny Model to Hear Bash"
- `from-voice-memos-to-structured-knowledge.mdx` — "From Voice Memos to Structured Knowledge"
- `using-the-cli.mdx` — "Using the CLI"
- `how-small-can-you-go.mdx` — "How Small Can You Go"
- `file-based-context-system.mdx` — "File-Based Context System"
- `training-on-a-mac-mini.mdx` — "Training on a Mac Mini"

Full essay bodies in source. Sample lede from voice-first-computing: *"I keep a running list of where I've had ideas I cared about in the last year. Almost none of them happened at my desk. Walking the dog. Three minutes into a shower. Driving back from dropping my kid off..."*

---

### /downloads — Install instructions

**File:** `components/DownloadAllPage.jsx`
**Note:** Detailed hero copy not extracted in this pass. Structure below is accurate.

**CHANNELS**
- CH-A / MAC: Package managers (Homebrew, npm/bun) · DMG fallback · curl installer: `curl -fsSL go.usetalkie.com/install | bash`
- CH-B / IPHONE: App Store CTA · QR code scanner

**TRUST STRIP**
- System requirements · Signing / verification · Data posture details

---

### /thank-you — Post-signup

**File:** `components/ThankYouPage.jsx`

```
· SIGNAL · CONFIRMED

You're
on the list.                            [italic, phosphor green]

1. Check your inbox.
Confirmation signal incoming. Add hello@usetalkie.com to your contacts so it lands cleanly.

2. Early access + launch discount.
You will be among the first invited before the public broadcast.

[DOWNLOAD FOR MAC]
[TALKIE FOR iPHONE & WATCH]
```

---

### /brand — Internal brand guidelines

**File:** `components/BrandPage.jsx`
**Status:** Hidden from nav, internal/designer reference.

**Voice lines registered:**
- Anchor: *"It's like a selfie. For your thoughts."*
- Supporting: *"A mic is all you need."*
- Supporting: *"Voice-first AI. Yours."*
- Supporting: *"Local-first. Auditable signal path."*

**Color tokens:**
```
Studio Cream (#F4EFE6)     Primary ink on dark canvas
Ribbon Black (#0E0D0A)     Primary canvas in dark mode
Hot Mic (#FF5346)          Listening state (the only red)
Cassette Orange (#E68A3C)  Processing, warm accent
Tape Tan (#7A6E5C)         Idle, dividers, secondary labels
Caution Yellow (#E5C547)   Error / warning (sparingly)
Graphite (#B8B2A4)         Secondary text de-emphasis
Signal Green (#5FD088)     Sync-ok indicator only
```

**Dos / Don'ts:**
- Do: Use the Wordmark component, never re-type "talkie" in CSS.
- Do: Keep the Hot Mic dot red. It means listening; nothing else.
- Do: Pair Talkie Medium (wordmark) with JetBrains Mono (labels) and a single display serif for emphasis.
- Do: Let the warm canvases (Cream / Ribbon Black) do the heavy lifting. Avoid pure white and pure black.
- Don't: Stretch, skew, or condense the wordmark by hand. Use the `squeeze` prop.
- Don't: Recolor the Hot Mic dot for theming. Use `monotone` mode if a single-color lockup is required.
- Don't: Pair the wordmark with another logotype lockup horizontally without a divider.
- Don't: Use Signal Green for CTAs. It's a sync indicator, not a button color.

---

### /docs — Documentation index

**File:** `components/docs/DocsIndexPage.jsx`

```
· DOCUMENTATION · SIGNAL · REFERENCE

How Talkie works.

From the philosophy to the wire format. Read top-to-bottom for the full picture, or jump straight to the surface you need.
```

Doc subpages are organized via `DOCS_NAV.js`. Individual doc pages not transcribed in this pass.

---

### /* — 404

**File:** `app/not-found.jsx`

```
404

Not the page you wanted.

Back to home →
```

Also redirects legacy `/v2/<x>/` URLs to `/<x>/`.

---

### Tagline rotation system

**File:** `content/tagline.js`
**Component:** `components/RotatingTagline.jsx`

Template: **A [fill] is all you need.**

Static fallback (anchor): `A mic is all you need.`

Homepage rotation (6-second cycle): `mic → scribble → snap → link → memo`

Page-specific statics:
- `/philosophy`: `A voice is all you need.`
- `/about`: `A memo is all you need.`

Hard rule: fills are **1–2 syllables max** and concrete inputs only. The "Attention Is All You Need" callback is intentional.

---

## Naming conventions & patterns observed

**Eyebrows:** Always uppercase, mono, small. Format: `· LABEL` or `· CHANNEL · DETAIL`. Used to section pages and establish context.

**Channels:** Surfaces are addressed as channels with a hyphenated prefix:
- `CH-A` = Mac
- `CH-B` = Mobile
- `CH-01..CH-NN` = sub-features within a page

**Stage numbers:** `01 / 02 / 03 / 04` for ordered sequences. Often paired with a `CH-NN` channel ID.

**Headlines:** Display serif (custom), normal weight. Splits often italicize the second clause for emphasis (phosphor green or amber).

**Body:** 15px on desktop. Wraps at `max-w-2xl` or `max-w-3xl`. Muted color for secondary body.

**CTAs:** Uppercase, mono, with arrow or icon. `LABEL → NEXT STEP` or `LABEL · [icon]`. External links use `↗`, internal links use `→`.

**Stats/specs:** Mono, smaller, uppercase tracking. Laid out in 2–3 columns.

**Signal flow diagrams:** Labeled stages with icons, connected by visual arrows. Numbered (`01, 02, 03, 04`).

---

## What we're asking for

### Immediate ask: /about visual redundancy

The /about page has two big serif statements with green italic kickers in immediate succession — hero ("Your thoughts set the pace. *AI makes it work.*") and story h2 ("The point isn't to talk faster... *It's to own the way you think and the way you work.*"). The user says it reads as the same component twice.

Two paths under consideration:

- **Path A — move the story h2 to the END of the story section** as a closing thesis stamp; let the prose earn its way to the conclusion. Drop the "Sure, that helps" aside since it preempts an argument that the prose has already lived through by then.
- **Path B — keep position, demote visual weight** (text-2xl, no italic phosphor span). Same words, quieter.

**Tell us:**
1. Which path (or a third option we haven't considered) and why, in one tight paragraph.
2. If you'd reword the closing thesis for the new position, draft (max 2 sentences).
3. Any structural moves missed: kill the h2 entirely, use a pull-quote mid-prose, restructure the section, etc.

### Broader ask: voice review across the kit

Now that you've read the corpus:

- Which lines are doing the most work? Which are filler that could be cut without loss?
- Where does the voice drift? Any surface that reads off-tone from the rest?
- Where is the brand voice strongest? Use those as anchors for proposals elsewhere.
- Any contradiction or duplication across pages that should be reconciled?

### How to respond

Keep it punchy. The founder is in a fast iteration loop and wants opinion, not deliberation. Stay inside the prose rules above when proposing copy. If you suggest copy that breaks a rule, flag the trade-off explicitly.

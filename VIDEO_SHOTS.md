Video Shot List

Scenes to capture for usetalkie.com. Organized by platform, then by feature.

## File Naming

Drop finished videos into `public/videos/`:

| Category | Shot | Filename |
|----------|------|----------|
| **Dictate** | Hold-to-Talk | `TalkieHoldToTalk.mp4` |
| **Dictate** | Return to Origin | `TalkieReturnToOrigin.mp4` |
| **Dictate** | Smart Routing | `TalkieSmartRouting.mp4` |
| **Dictate** | HUD | `TalkieHUD.mp4` |
| **Dictate** | Menu Bar | `TalkieMenuBar.mp4` |
| **Dictate** | Use Cases (combined) | `TalkieDictation.mp4` (replace existing) |
| **Manage** | Echoes | `TalkieEchoes.mp4` |
| **Manage** | Search | `TalkieSearch.mp4` |
| **Manage** | Export | `TalkieExport.mp4` |
| **Orchestrate** | Voice → File | `TalkieWorkflowFile.mp4` |
| **Orchestrate** | Voice → Shell | `TalkieWorkflowShell.mp4` |
| **Orchestrate** | Voice → Agent | `TalkieWorkflowAgent.mp4` |
| **Orchestrate** | Pipeline Editor | `TalkieWorkflowEditor.mp4` |
| **iPhone** | Quick Capture | `TalkieiPhoneCapture.mp4` |
| **iPhone** | Widgets | `TalkieiPhoneWidgets.mp4` |
| **iPhone** | Sync | `TalkieiPhoneSync.mp4` |
| **Watch** | Wrist Capture | `TalkieWatchCapture.mp4` |
| **Hero** | 60s Overview | `TalkieHero.mp4` |
| **Hero** | Short Promo | `TalkiePromo.mp4` (replace existing) |

---

## Mac Features to Demonstrate

### Core Dictation

- [ ] **Hold-to-Talk** — Hold hotkey, speak, release. Text appears at cursor. Show the muscle-memory feel — no buttons, no clicks. (~15s)
- [ ] **Return to Origin** — Start in one app (e.g. Slack), trigger Talkie, speak, text pastes back into the exact field you were in. Show the app-switching magic. (~15s)
- [ ] **Smart Routing** — Dictate into a text field (auto-paste), then dictate with a non-editable context (copies to clipboard instead). Show it adapting. (~15s)
- [ ] **Minimal HUD** — Show the floating pill during recording. Hover to expand for details. Show it disappearing when idle. (~10s)
- [ ] **Always Ready (Menu Bar)** — Show Talkie living in the menu bar. No app to launch, no window to find. Click menu bar icon, show the dropdown. (~10s)

### Dictation Use Cases

Show Talkie in real workflows — one clip per use case:

- [ ] **While Coding** — Dictate a code comment or commit message mid-coding session. (~15s)
- [ ] **Email Draft** — Dictate a full email reply, show it landing in the compose field. (~15s)
- [ ] **Meeting Notes** — Speak a stream-of-consciousness meeting recap, show the transcript. (~15s)
- [ ] **Context Switching** — Jump between apps, dictate into each one without losing context. (~20s)
- [ ] **Blog Post Draft** — Dictate a paragraph or two of longform writing. (~20s)

### Echoes & Library (Manage)

- [ ] **48-Hour Echoes** — Show the recent transcriptions list. Scroll through, click one to expand. Demonstrate the 48h auto-cleanup concept. (~15s)
- [ ] **Search** — Type a keyword, find a past voice note by transcript content. (~10s)
- [ ] **Export** — Select recordings, export as text/markdown/JSON. Show the output. (~10s)

### Workflows & Automation (Orchestrate)

- [ ] **Voice → File (Obsidian)** — Speak a note, it saves as markdown in an Obsidian vault. Show `@Notes` path alias. (~20s)
- [ ] **Voice → Shell Command** — Speak "create a GitHub issue about..." → `gh issue create` runs with the transcript. (~15s)
- [ ] **Voice → AI Agent** — Speak instructions to Claude Code. Show the agent processing and returning results. (~25s)
- [ ] **Modular Pipeline** — Show the workflow editor. Chain steps: transcription → LLM summary → save to file. (~20s)
- [ ] **Path Aliases** — Show the aliases panel: `@Notes`, `@Projects`, `@Desktop`. Quick demo of how they route output. (~10s)

### Privacy & Architecture

- [ ] **100% Local Processing** — Show Talkie working with Wi-Fi off. Emphasize no cloud, no API keys needed. (~10s)
- [ ] **Works Offline** — Airplane mode → dictate → text appears. (~10s)

---

## iPhone Features to Demonstrate

### Capture

- [ ] **Quick Capture** — Open app, tap record, speak, done. Show clean transcript appearing. (~15s)
- [ ] **Lock Screen Widget** — Launch capture from the lock screen widget without unlocking fully. (~10s)
- [ ] **Home Screen Widget** — Tap the home screen widget, start recording immediately. (~10s)
- [ ] **Shortcuts Integration** — Trigger capture from a Siri Shortcut or automation. (~10s)

### Sync

- [ ] **iCloud Sync to Mac** — Record on iPhone, show it appearing on Mac within seconds. Split-screen or cut between devices. (~20s)
- [ ] **Capture Feed** — Show the feed/timeline of recent captures with timestamps and locations. (~10s)

### Use Cases (Mobile)

- [ ] **Walking Between Meetings** — Capture a thought while walking (handheld filming or steady shot). (~10s)
- [ ] **Commute Idea** — Quick capture during transit. (~10s)
- [ ] **Post-Call Feedback** — Right after a phone call, capture a follow-up note. (~10s)

---

## Apple Watch Features to Demonstrate

- [ ] **Wrist Capture** — Raise wrist, tap complication, speak, lower wrist. Done. (~10s)
- [ ] **Sync to Mac** — Show the watch recording appearing on Mac. (~10s)

---

## Hero / Promo Videos

Polished, edited videos for the landing page and `/demo`:

- [ ] **60-second Overview** — End-to-end flow: menu bar → hold-to-talk → text appears → mobile capture → sync → library → export. One continuous story. (~60s)
- [ ] **23-second Promo** — Fast cuts. Hook in 3 seconds. Best moments from above clips. (~20s)

---

## Recording Guidelines

- **Resolution**: Native retina, record at 2x
- **Desktop**: Clean wallpaper, hide dock clutter, close unrelated apps
- **Duration**: 10–30s per feature clip, 60s max for hero
- **Format**: MP4, H.264. Aim for <10MB per clip
- **Audio**: System sounds OK, no voiceover — the site provides context
- **Library prep**: Pre-populate with 10+ real recordings before filming Manage clips
- **Workflow prep**: Set up path aliases and a working `gh` CLI before Orchestrate clips
- **iPhone**: Use screen recording + device footage where helpful
- **Watch**: Film externally (phone camera pointed at wrist) or use screen mirroring



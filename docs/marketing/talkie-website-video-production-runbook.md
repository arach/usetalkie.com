# Talkie Website Video Production Runbook

## Goal

Produce the next website demo from the real Talkie product, with one clear default lane:

`Walk-to-Spec`

That means:

1. capture the thought quickly on iPhone
2. pick it back up on Mac
3. recover the transcript and context
4. turn it into a structured output
5. close on ownership and continuity

## Tooling Decision

Use `~/dev/action` as the primary screen recorder for the Mac pass.

Use Talkie's own screen-recording feature as a product feature when we want to show
that capability inside Talkie itself, not as the main website capture tool.

Why:

- `action` is already built around staged recording, deterministic timing, and review
- Talkie's screen recorder currently routes captures into the tray / capture workflow
- the website hero needs clean exports more than "record the screen from inside the app"

Relevant code:

- Talkie screen recording lives in [ScreenRecordingService.swift](/Users/arach/dev/talkie/macOS/Talkie/Services/ScreenRecording/ScreenRecordingService.swift)
- it is orchestrated through [ScreenRecordingController.swift](/Users/arach/dev/talkie/macOS/Talkie/Services/ScreenRecording/ScreenRecordingController.swift)
- Action capture is documented in [recording.md](/Users/arach/dev/action/docs/recording.md)

## Deliverables

Primary exports for the website:

- `public/videos/TalkieHero.mp4`
- `public/videos/TalkiePromo.mp4`

Working exports should land here first:

- `public/videos/staging/`

## Recommended Story

### Default hero lane

`Walk-to-Spec`

### Asset split

Use separate capture passes, then cut them together:

1. iPhone capture pass
2. Mac recovery + transformation pass
3. optional trust / settings pass
4. final hero hold

This is better than trying to record the whole story in one uninterrupted take.

## Capture Plan

### Pass 1: iPhone capture

Capture a short, believable memo:

- feature idea appears away from desk
- record quickly
- end with the memo obviously saved

Keep this pass short:

- 4-8 seconds for promo
- 6-12 seconds for hero

### Pass 2: Mac recovery and action

Use Talkie on Mac to show:

- the same memo already present
- transcript and context intact
- search or recovery moment
- transformation into a draft or checklist

Use `action` for this pass so we get:

- consistent framing
- a clean recording artifact
- repeatable timing for multiple takes

### Pass 3: trust beat

Keep this subtle. One beat is enough:

- local-first cue
- iCloud sync cue
- provider-choice cue

Do not turn this into a settings tour.

### Pass 4: close

End on a clean Mac frame, or Mac + iPhone proof shot.

Suggested closing line:

`Capture anywhere. Continue where the work happens.`

## Preflight

### Talkie

Check status:

```bash
bun /Users/arach/dev/talkie/cli/src/dev.ts dev status --pretty
```

Fresh relaunch:

```bash
bun /Users/arach/dev/talkie/cli/src/dev.ts dev relaunch talkie
```

Notes from this machine:

- the active dev app bundle is `jdi.talkie.core.dev`
- the current dev build can run without exposing an automation-visible main window
- treat "bring the correct Talkie window on screen" as a manual preflight step for now

Possible route nudges once the app is open:

```bash
open "talkie-dev://home"
open "talkie-dev://show"
open "talkie-dev://workflows"
```

### Action

Verify permissions and signing:

```bash
bun /Users/arach/dev/action/packages/cli/src/action-dev.ts doctor
```

Check current status:

```bash
bun /Users/arach/dev/action/packages/cli/src/action-dev.ts status
```

If needed, relaunch:

```bash
bun /Users/arach/dev/action/packages/cli/src/action-dev.ts relaunch
```

## Mac Pass Workflow

Use the companion scenario:

- [talkie-walk-to-spec-mac.json](/Users/arach/dev/action/scenarios/talkie-walk-to-spec-mac.json)

That scenario is intentionally a timed stage script, not a brittle click-automation pass.
It gives the operator a paced recording window while they manually drive the prepared
Talkie UI.

Suggested workflow:

1. relaunch Talkie
2. bring the exact Talkie window you want on screen
3. preload the memo and any final output state you want to reveal
4. run the Action scenario
5. perform the Mac moves during each timed chapter window
6. review the artifact in `~/dev/action/artifacts/sessions/talkie-walk-to-spec-mac/`

## Editing Rule

Do not introduce a new product surface unless it moves the main loop forward.

If a clip does not help explain:

- capture
- continuity
- transcript recovery
- transformation

cut it.

## Promo Cut Guidance

For `TalkiePromo.mp4`:

- use the fastest 20-30 seconds
- bias toward capture, transcript recovery, and one output moment
- skip the deeper workflow layer unless it reads instantly

## Current Constraint

The main blocker right now is not Action.

It is that the Talkie dev build on this machine does not consistently surface an
automation-visible main window after launch, even though the app is running as
`jdi.talkie.core.dev`.

That means:

- recording is ready
- staging is mostly ready
- fully deterministic Talkie click automation should wait until window surfacing is stable

For this round, the right move is:

`Action records. The operator drives the Mac pass manually.`

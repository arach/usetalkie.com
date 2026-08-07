/**
 * The capability atlas — 100 repository-backed capabilities, 20 per family.
 *
 * Ported from the internal Talkie design-studio Feature Explorer study
 * (design/studio/components/studies/FeatureExplorer.tsx) and its handoff
 * document. The information architecture came across; the Studio's styling
 * did not — this site renders it in its own oscilloscope tokens.
 *
 * The point of keeping this as data rather than JSX: every claim on the
 * public page can be traced back to a named implementation file, so the
 * inventory stays auditable as the product moves. `evidence` on a family
 * is the set of paths the group's descriptions were written against;
 * `guardrail` is a publication constraint that must survive copy edits.
 *
 * ONE ACCENT. The Studio gave each family its own hue (amber / phosphor /
 * violet / blue / coral). That is a rainbow, and this site does not do
 * rainbows — families are told apart by channel number and label, the way
 * strips on a real console are. Talkie's own Console picker numbers its
 * session cards CH-01/02/03 in amber, so this is the product's grammar too.
 */

export const FAMILIES = [
  {
    id: 'chat',
    channel: 'CH 01',
    verb: 'Chat',
    role: 'Exchange intent',
    summary:
      'Talk to an agent, turn speech into text, and return the response through the right surface.',
    guardrail:
      'Insertion behavior varies by application. Shortcut chords are configurable, not fixed.',
    groups: [
      {
        label: 'Input',
        items: [
          { name: 'Global dictation', detail: 'Start voice capture from anywhere on Mac.', surface: 'MAC' },
          { name: 'Voice activity', detail: 'Detect live input levels and speech activity.', surface: 'ENGINE' },
          { name: 'Streaming ASR', detail: 'Transcribe speech while audio is arriving.', surface: 'ENGINE' },
          { name: 'File transcription', detail: 'Process an existing audio file as a job.', surface: 'MAC' },
          { name: 'Voice memos', detail: 'Record durable audio notes on Mac or iPhone.', surface: 'MAC · IPHONE' },
        ],
      },
      {
        label: 'Recognition',
        items: [
          { name: 'Local engine host', detail: 'TalkieAgent runs the embedded transcription runtime.', surface: 'MAC' },
          { name: 'Whisper models', detail: 'Use Whisper-family local speech models.', surface: 'ENGINE' },
          { name: 'Parakeet models', detail: 'Use Parakeet-family local speech models.', surface: 'ENGINE' },
          { name: 'Priority lanes', detail: 'Separate live, user-initiated, and batch work.', surface: 'ENGINE' },
          { name: 'Batch processing', detail: 'Run lower-priority transcription behind live work.', surface: 'ENGINE' },
        ],
      },
      {
        label: 'Return',
        items: [
          { name: 'Focused-app return', detail: 'Send final text back to the original Mac app.', surface: 'MAC' },
          { name: 'Direct insertion', detail: 'Insert through Accessibility when the target supports it.', surface: 'MAC' },
          { name: 'Paste fallback', detail: 'Fall back to the clipboard when direct insertion cannot land.', surface: 'MAC' },
          { name: 'Terminal delivery', detail: 'Use a terminal-aware paste path for shell surfaces.', surface: 'MAC' },
          { name: 'Recovery queue', detail: 'Save captured audio for a later transcription retry when processing fails.', surface: 'MAC' },
        ],
      },
      {
        label: 'Controls',
        items: [
          { name: 'Capture shortcut', detail: 'Configure the global capture chord.', surface: 'MAC' },
          { name: 'Compose shortcut', detail: 'Open a voice-led Compose action globally.', surface: 'MAC' },
          { name: 'Selection shortcut', detail: 'Act on the text currently selected in another app.', surface: 'MAC' },
          { name: 'Typed requests', detail: 'Send an agent instruction from Agent Home without recording.', surface: 'AGENT' },
          { name: 'Spoken replies', detail: 'Play an agent response back through speech.', surface: 'AGENT' },
        ],
      },
    ],
  },
  {
    id: 'watch',
    channel: 'CH 02',
    verb: 'Watch',
    role: 'Give agents visibility',
    summary:
      'Show an agent what you are building, doing, and saying through explicit working context — not just a final prompt.',
    guardrail:
      'Screen capture is permission-gated and user-initiated. Nothing observes ambiently or continuously.',
    groups: [
      {
        label: 'Live context',
        items: [
          { name: 'Foreground app', detail: 'Preserve which application was active around a request.', surface: 'MAC' },
          { name: 'Focused window', detail: 'Capture the active window title when Accessibility allows it.', surface: 'MAC' },
          { name: 'Start and end state', detail: 'Record how app and window context changed during capture.', surface: 'MAC' },
          { name: 'Spoken context', detail: 'Give the agent the transcript of what you are saying.', surface: 'AGENT' },
          { name: 'Recent conversation', detail: 'Carry recent requests and results into the next agent turn.', surface: 'AGENT' },
        ],
      },
      {
        label: 'Captured context',
        items: [
          { name: 'Screenshots', detail: 'Attach a visible screen or window state to the work.', surface: 'MAC · CLI' },
          { name: 'Screen clips', detail: 'Capture a short sequence that shows behavior changing over time.', surface: 'MAC · CLI' },
          { name: 'Audio recordings', detail: 'Keep the original recording alongside what was transcribed.', surface: 'MAC · IPHONE' },
          { name: 'File attachments', detail: 'Add a local file or URL as material for an agent request.', surface: 'AGENT' },
          { name: 'Capture metadata', detail: 'Preserve app, window, display, dimensions, mode, and time where available.', surface: 'MAC' },
        ],
      },
      {
        label: 'Agent visibility',
        items: [
          { name: 'Visible text', detail: 'Retain OCR-derived text from captured screen context.', surface: 'ENGINE' },
          { name: 'Sampled frames', detail: 'Break a screen clip into representative moments for inspection.', surface: 'ENGINE' },
          { name: 'Contact sheets', detail: 'Assemble sampled moments into one agent-readable visual overview.', surface: 'ENGINE' },
          { name: 'Vision descriptions', detail: 'Describe concrete UI state for a downstream assistant when enabled.', surface: 'AI' },
          { name: 'Runtime attachments', detail: 'Pass named media and file locations into an agent invocation.', surface: 'AGENT' },
        ],
      },
      {
        label: 'Inspect and recall',
        items: [
          { name: 'Local record library', detail: 'Keep dictations, memos, captures, and their assets inspectable.', surface: 'MAC' },
          { name: 'Full-text search', detail: 'Query indexed memo and dictation text.', surface: 'CLI' },
          { name: 'App and source filters', detail: 'Narrow records by originating app or content type.', surface: 'CLI' },
          { name: 'Time and duration filters', detail: 'Find captured context within a useful window or length.', surface: 'CLI' },
          { name: 'Workflow history', detail: 'Inspect prior workflow executions and outputs.', surface: 'MAC · CLI' },
        ],
      },
    ],
  },
  {
    id: 'act',
    channel: 'CH 03',
    verb: 'Act',
    role: 'Make a controlled change',
    summary:
      'Turn an instruction or selected text into a concrete change you can review, refine, or approve.',
    guardrail:
      'Compose evidence is strongest on iPhone. Context profiles shown publicly are illustrative saved configurations, not shipped defaults.',
    groups: [
      {
        label: 'Compose',
        items: [
          { name: 'Voice instruction', detail: 'Describe a requested change by speaking.', surface: 'IPHONE' },
          { name: 'Selected-text input', detail: 'Use the current Mac selection as source material.', surface: 'MAC' },
          { name: 'Generation state', detail: 'Show when a proposed revision is being prepared.', surface: 'IPHONE' },
          { name: 'Proposed revision', detail: 'Keep generated text separate until approved.', surface: 'IPHONE' },
          { name: 'Diff review', detail: 'Compare the original and proposed version.', surface: 'IPHONE' },
        ],
      },
      {
        label: 'Review',
        items: [
          { name: 'Accept', detail: 'Replace the original with the reviewed proposal.', surface: 'IPHONE' },
          { name: 'Refine', detail: 'Issue another instruction against the proposal.', surface: 'IPHONE' },
          { name: 'Discard', detail: 'Leave the source unchanged.', surface: 'IPHONE' },
          { name: 'Revision records', detail: 'Persist the edit history and decision trail.', surface: 'IPHONE' },
          { name: 'Before and after', detail: 'Retain both sides of a revision for inspection.', surface: 'IPHONE' },
        ],
      },
      {
        label: 'Context rules',
        items: [
          { name: 'App matching', detail: 'Match a rule to foreground application bundle IDs.', surface: 'MAC' },
          { name: 'Custom prompt', detail: 'Apply rule-specific instructions before delivery.', surface: 'MAC' },
          { name: 'Behavior mode', detail: 'Choose how matched text should be treated.', surface: 'MAC' },
          { name: 'Provider override', detail: 'Choose an AI provider for a matching context.', surface: 'MAC' },
          { name: 'Model override', detail: 'Choose a model for a matching context.', surface: 'MAC' },
        ],
      },
      {
        label: 'Transform',
        items: [
          { name: 'Text post-processing', detail: 'Normalize transcription output before delivery.', surface: 'ENGINE' },
          { name: 'Filler cleanup', detail: 'Handle common spoken filler variants.', surface: 'ENGINE' },
          { name: 'LLM generation', detail: 'Generate or rewrite text inside a workflow.', surface: 'WORKFLOW' },
          { name: 'Data transform', detail: 'Reshape step output without leaving the workflow.', surface: 'WORKFLOW' },
          { name: 'Intent extraction', detail: 'Turn transcript content into structured intents.', surface: 'WORKFLOW' },
        ],
      },
    ],
  },
  {
    id: 'run',
    channel: 'CH 04',
    verb: 'Run',
    role: 'Delegate work',
    summary:
      'Convert an instruction into ordered processing, decisions, actions, and delivery routes.',
    guardrail:
      'Conditional steps evaluate to true or false; then/else routing is not implemented, so the sequence stays linear. Do not call it branching.',
    groups: [
      {
        label: 'Workflow model',
        items: [
          { name: 'TWF documents', detail: 'Describe workflows as portable JSON definitions.', surface: 'WORKFLOW' },
          { name: 'Stable slugs', detail: 'Address workflows by readable kebab-case identifiers.', surface: 'WORKFLOW' },
          { name: 'Ordered steps', detail: 'Run a declared sequence of typed operations.', surface: 'WORKFLOW' },
          { name: 'Variable references', detail: 'Pass transcript and prior step output forward.', surface: 'WORKFLOW' },
          { name: 'Round-trip validation', detail: 'Decode and re-encode workflow definitions safely.', surface: 'WORKFLOW' },
        ],
      },
      {
        label: 'Reasoning',
        items: [
          { name: 'Transcribe audio', detail: 'Create text from an audio input step.', surface: 'WORKFLOW' },
          { name: 'LLM generation', detail: 'Ask a selected provider and model to produce output.', surface: 'WORKFLOW' },
          { name: 'Transform data', detail: 'Convert data between workflow stages.', surface: 'WORKFLOW' },
          { name: 'Conditional evaluation', detail: 'Evaluate prior output into a true or false step result.', surface: 'WORKFLOW' },
          { name: 'Trigger detection', detail: 'Detect whether transcript content matches a trigger.', surface: 'WORKFLOW' },
        ],
      },
      {
        label: 'Actions',
        items: [
          { name: 'Extract intents', detail: 'Identify actionable intents in captured text.', surface: 'WORKFLOW' },
          { name: 'Execute workflows', detail: 'Fan an intent into another workflow.', surface: 'WORKFLOW' },
          { name: 'Shell command', detail: 'Run a local command with your own permissions as a workflow step.', surface: 'WORKFLOW' },
          { name: 'Save to file', detail: 'Write a result to a chosen local file.', surface: 'WORKFLOW' },
          { name: 'Clipboard', detail: 'Place generated output on the clipboard.', surface: 'WORKFLOW' },
        ],
      },
      {
        label: 'Delivery',
        items: [
          { name: 'Reminder', detail: 'Create a task in Apple Reminders.', surface: 'WORKFLOW' },
          { name: 'Email', detail: 'Send workflow output through an email route.', surface: 'WORKFLOW' },
          { name: 'Webhook', detail: 'POST output to an external endpoint.', surface: 'WORKFLOW' },
          { name: 'Notification', detail: 'Deliver a local completion notification.', surface: 'WORKFLOW' },
          { name: 'Notify iPhone', detail: 'Route an output back to the paired phone.', surface: 'WORKFLOW' },
        ],
      },
    ],
  },
  {
    id: 'connect',
    channel: 'CH 05',
    verb: 'Connect',
    role: 'Expose the controls',
    summary:
      'Let people and agents reach Talkie through apps, console, CLI, SDK, SSH, and selected services.',
    guardrail:
      'SSH requires Remote Login on the Mac plus key setup. The WebSocket bridge is off until enabled. Provider catalogs vary by surface.',
    groups: [
      {
        label: 'Operator surfaces',
        items: [
          { name: 'TalkieAgent', detail: 'Keep capture and the local engine available in the menu bar.', surface: 'MAC' },
          { name: 'Talkie app', detail: 'Manage memos, live dictations, settings, and workflows.', surface: 'MAC' },
          { name: 'Talkie iPhone', detail: 'Capture memos and review mobile records.', surface: 'IPHONE' },
          { name: 'Agent Home', detail: 'Issue requests and inspect returned agent work.', surface: 'AGENT' },
          { name: 'macOS Console', detail: 'Open tabbed managed-agent terminal sessions inside Talkie for Mac.', surface: 'MAC' },
        ],
      },
      {
        label: 'CLI and SDK',
        items: [
          { name: 'Talkie CLI', detail: 'Query memos, dictations, workflows, and captures from a terminal or script.', surface: 'CLI' },
          { name: 'Unified search', detail: 'Search across supported local record types.', surface: 'CLI' },
          { name: 'Structured output', detail: 'Return JSON records or absolute capture paths to scripts and agents.', surface: 'CLI' },
          { name: 'Typed client', detail: 'Call Talkie services through the npm SDK.', surface: 'SDK' },
          { name: 'Streaming dictation', detail: 'Open and control a typed dictation session.', surface: 'SDK' },
        ],
      },
      {
        label: 'Terminal control',
        items: [
          { name: 'iPhone SSH terminal', detail: 'Connect directly to saved Mac or SSH hosts from Talkie on iPhone.', surface: 'IPHONE' },
          { name: 'Key pairing', detail: 'Prepare Mac access and import the SSH connection by QR code or link.', surface: 'IPHONE · CLI' },
          { name: 'Route cascade', detail: 'Try available local-network, Tailscale, and direct host routes in order.', surface: 'IPHONE' },
          { name: 'Persistent session', detail: 'Attach to a tmux session so terminal work survives reconnects. Without tmux the profile falls back to a plain login shell.', surface: 'IPHONE · MAC' },
          { name: 'Terminal controls', detail: 'Use modifier keys, symbol rows, cursor controls, and inline dictation on iPhone.', surface: 'IPHONE' },
        ],
      },
      {
        label: 'Bridges and providers',
        items: [
          { name: 'XPC services', detail: 'Connect the Mac UI to services hosted by TalkieAgent.', surface: 'MAC' },
          { name: 'Optional WebSocket', detail: 'Expose the engine bridge only when remote access is enabled.', surface: 'ENGINE' },
          { name: 'CloudKit sync', detail: 'Move selected memo data between Mac and iPhone.', surface: 'APPLE' },
          { name: 'Cloud providers', detail: 'Choose a cloud AI route when you configure one.', surface: 'AI' },
          { name: 'On-device models', detail: 'Use Apple Intelligence locally when supported.', surface: 'MAC' },
        ],
      },
    ],
  },
]

/** Derived, never hardcoded — the count moves when the atlas moves. */
export const CAPABILITY_COUNT = FAMILIES.reduce(
  (total, family) => total + family.groups.reduce((n, group) => n + group.items.length, 0),
  0,
)

/**
 * Verified product proof.
 *
 * Every frame here is a real Talkie surface captured from a real build —
 * no reconstructions, no mockups acting out a feature. `note` is public
 * honesty copy: the prerequisite or boundary, stated where the claim is
 * made rather than buried in a footnote.
 *
 * Deliberately absent: the Watch screen-clip video. The only verified clip
 * shows internal project content, and the handoff flags it P1 for
 * recapture. The handoff's own rule applies — keep the explanation and
 * skip the media rather than substitute a mock.
 */
export const PROOFS = [
  {
    id: 'capture',
    tab: 'Capture',
    family: 'CH 01',
    title: 'You speak once. What comes back is already wired up.',
    body:
      'Holding the button gives you a waveform and a timer, and nothing else to decide. What lands is not a wall of text. It is a transcript you can play back, read aloud, ask about, or hand to an agent or a shell. The talking is the easy part. The wiring on the other side is the product.',
    note: 'Talkie for iPhone, running the sample dataset. The 7:34 AM memo in the recent list is the same one open in the second frame. Agent and CLI are dimmed because no Mac is paired, which is the app reporting its own state rather than a disabled mockup.',
    captured: '2026-05-17',
    frames: [
      { src: '/proof/iphone-capture-in-flight.png', alt: 'Talkie for iPhone with a recording sheet open over the home view, showing a live waveform, an 0:11 timer, a details disclosure, and a stop button.', caption: 'Recording — a waveform, a timer, and one button.' },
      { src: '/proof/iphone-memo-transcript-actions.png', alt: 'A Talkie memo on iPhone showing its transcript, a playback scrubber, a row of Read, Ask, Note, Share and Remind actions, and Agent and CLI tiles dimmed with a No Mac status.', caption: 'The same memo — transcript, playback, and where it can go next.' },
    ],
  },
  {
    id: 'review',
    tab: 'Review',
    family: 'CH 03',
    title: 'Agents propose. You decide.',
    body:
      'A revision is generated beside your text, never over it. Original and proposal stay separate until you accept, refine, or discard — three explicit outcomes, and a record either way.',
    note: 'Real Talkie for iPhone Compose captures. Current evidence is strongest on iPhone; the model shown is the one used that day, not a fixed default.',
    captured: '2026-05-17',
    frames: [
      { src: '/proof/diff-review-01-source.png', alt: 'Talkie Compose on iPhone holding editable source text before any revision request.', caption: 'Source — your text, editable and untouched.' },
      { src: '/proof/diff-review-02-generating.png', alt: 'Talkie Compose showing an explicit generating state while the source text remains visible.', caption: 'Generating — the source stays visible throughout.' },
      { src: '/proof/diff-review-03-review.png', alt: 'Talkie Compose showing the original struck through above the proposed revision, with Discard, Refine command, and Accept controls.', caption: 'Review — both versions, then Discard, Refine, or Accept.' },
    ],
  },
  {
    id: 'context',
    tab: 'Context',
    family: 'CH 03',
    title: 'Different app, different behavior.',
    body:
      'A rule matches the app in front of you and adapts what happens next — its own prompt, whether the result is pasted or held for review, and optionally which provider and model handle it.',
    note: 'A live capture of Talkie 2.5.35. The profile shown is one saved configuration and is disabled in the capture — not a preset that ships with the app.',
    captured: '2026-07-26',
    frames: [
      { src: '/proof/app-aware-context-profile.png', alt: 'Talkie for Mac context settings showing a saved per-app profile bound to an application bundle identifier, with prompt, behavior, and provider options.', caption: 'A per-app profile: match, prompt, behavior, provider.' },
    ],
  },
  {
    id: 'console',
    tab: 'Console',
    family: 'CH 05',
    title: 'Terminal sessions, held open inside Talkie.',
    body:
      'The Console is a tabbed launcher for real local shell and agent sessions on your Mac — surfaces you return to across the day, not one-shot prompts.',
    note: 'Real sessions running locally on your Mac. Which starting points appear depends on what you have installed and configured; this is not an exhaustive list of supported harnesses.',
    captured: '2026-07-26',
    frames: [
      { src: '/proof/macos-console-session-picker.png', alt: 'The Talkie for Mac Console showing numbered session tabs and a picker offering several starting points, each with a launch button.', caption: 'Pick a starting point, then the session stays on a tab.' },
    ],
  },
  {
    id: 'phone',
    tab: 'SSH',
    family: 'CH 05',
    title: 'The same control posture, away from the desk.',
    body:
      'Talkie on iPhone carries a real SSH terminal with saved hosts, modifier keys, and inline dictation. It is a client, not a tunnel someone else operates.',
    note: 'This capture proves the setup surface, not a live connection. Connecting requires Remote Login enabled on the Mac and a key in place — nothing happens automatically.',
    captured: '2026-07-26',
    frames: [
      { src: '/proof/iphone-ssh-terminal-setup.png', alt: 'Talkie on iPhone showing the SSH terminal surface with no saved hosts and instructions to import access from Talkie for Mac.', caption: 'Setup states its prerequisites instead of hiding them.' },
    ],
  },
]

/**
 * Shared tour/gallery data for Talkie screenshots.
 * Used by both the landing page carousel and individual /tour/[slug] pages.
 *
 * `description` is the indexable/OG meta description (70–160 characters).
 * Individual slide routes are noindex; `/tour/` is the canonical hub.
 */

const LEGACY_MAC_GALLERY = [
  { src: '/screenshots/mac-home.png', title: 'Home', caption: 'Your dashboard — stats, memos, and activity at a glance.', description: 'The Talkie Mac home screen shows recent memos, daily stats, transcription activity, and a heatmap of use.', narration: 'This is your home screen. You can see your recent memos, daily stats, transcription activity, and a heatmap of how often you\'ve been using Talkie. Everything at a glance.', audio: '/audio/tour/mac-home.mp3' },
  { src: '/screenshots/mac-recording.png', title: 'Dictation Capture', caption: 'Set the hotkey, microphone, and local capture path Talkie actually uses.', description: 'Set the Mac hotkey, microphone, and local capture path Talkie uses before you start dictating.', narration: 'The dictation setup is visible before you speak: keyboard trigger, push-to-talk behavior, microphone, and the sounds that confirm capture started.', audio: '/audio/tour/mac-recording.mp3' },
  { slug: 'mac-transcription-settings', src: '/screenshots/mac-transcription-settings.png', title: 'Transcription Settings', caption: 'Choose the local speech model that turns recordings into text.', description: 'Choose the local speech model Talkie uses to turn Mac recordings into text on your device.', narration: 'The transcription settings make the speech engine explicit. Talkie can keep recognition local, with the active model visible before you record.' },
  { slug: 'mac-dictionary', src: '/screenshots/mac-dictionary.png', title: 'Dictionary', caption: 'Teach Talkie the names, terms, and replacements you actually say.', description: 'Teach Talkie the names, product terms, and spoken replacements you actually say on Mac.', narration: 'Dictionary rules help Talkie understand your words the way you use them: names, product terms, acronyms, and spoken replacements.' },
  { src: '/screenshots/mac-models.png', title: 'Models', caption: 'Local LLMs, cloud providers, and speech-to-text engines.', description: 'Pick local LLMs, cloud providers, and speech-to-text engines for Talkie on Mac, then mix them per task.', narration: 'Talkie supports local models, cloud providers, and multiple speech-to-text engines. You can mix and match — use Whisper locally for privacy, or a cloud provider when you need speed.', audio: '/audio/tour/mac-models.mp3' },
  { src: '/screenshots/mac-actions.png', title: 'Actions', caption: 'Workflows packaged as one-tap buttons.', description: 'Talkie Actions on Mac package workflows as one-tap buttons for summarize, extract, and rewrite.', narration: 'Actions are like little workflows you can trigger with one tap. Summarize an email, extract key insights from a meeting, or clean up your writing. You can customize them or build your own.', audio: '/audio/tour/mac-actions.mp3' },
  { src: '/screenshots/mac-appearance.png', title: 'Appearance', caption: 'Themes, accent colors, and typography controls.', description: 'Choose themes, accent colors, and typography so Talkie on Mac matches the rest of your setup.', narration: 'Talkie has seven built-in themes, accent color customization, and full typography controls. You can make it feel like your own app.', audio: '/audio/tour/mac-appearance.mp3' },
  { src: '/screenshots/mac-account.png', title: 'Account', caption: 'Private, synced, or connected — you choose.', description: 'Explore account options in Talkie for Mac. Keep recordings local by default, with optional sync and cloud features available when they fit the task at hand.', narration: 'Your data stays yours. Talkie is private by default — everything runs locally. If you want sync, you opt in. And if you want cloud features, you choose the tier that fits.', audio: '/audio/tour/mac-account.mp3' },
  { src: '/screenshots/mac-memo-saved.png', title: 'Saved', caption: 'Duration, word count, and a link to view.', description: 'After a Mac capture, Talkie shows duration, word count, and a link to the saved transcript.', narration: 'And just like that, it\'s saved. You get the duration, word count, and a quick link to jump right into the transcript.', audio: '/audio/tour/mac-memo-saved.mp3' },
  { src: '/screenshots/mac-compose.png', title: 'Compose', caption: 'Write and transform with AI.', description: 'Write and transform text with AI in Talkie Compose on Mac, with rewrite actions on the same page.', narration: 'The compose view lets you write and transform text with AI. Quick actions sit right below, so you can rewrite, expand, or refine without leaving the page.', audio: '/audio/tour/mac-compose.mp3' },
  { src: '/screenshots/mac-compose-diff.png', title: 'Diff View', caption: 'Accept or reject revisions, word by word.', description: 'Review AI edits in Talkie on Mac as a word-by-word diff you can accept or reject in place.', narration: 'When AI edits your text, you see a clean diff view. Green for additions, red for removals. You can accept or reject each change, word by word.', audio: '/audio/tour/mac-compose-diff.mp3' },
]

const MAC_GALLERY = [
  {"slug": "mac-home", "src": "/screenshots/mac/current/talkie-home-light.webp", "title": "Home", "caption": "Recent meetings, captures, and agent activity in one place.", "description": "Home in Talkie for Mac. Recent meetings, captures, and agent activity in one place.", "narration": "Recent meetings, captures, and agent activity in one place."},
  {"slug": "mac-library", "src": "/screenshots/mac/current/talkie-library-light.webp", "title": "Library", "caption": "Browse saved captures and return to their transcripts.", "description": "Library in Talkie for Mac. Browse saved captures and return to their transcripts.", "narration": "Browse saved captures and return to their transcripts."},
  {"slug": "mac-compose", "src": "/screenshots/mac/current/talkie-editor-light.webp", "title": "Editor", "caption": "Edit Markdown beside its preview and review saved revisions.", "description": "Editor in Talkie for Mac. Edit Markdown beside its preview and review saved revisions.", "narration": "Edit Markdown beside its preview and review saved revisions."},
  {"slug": "mac-dictionary", "src": "/screenshots/mac/current/talkie-dictionary-light.webp", "title": "Dictionary", "caption": "Manage names, terms, and replacements for dictation.", "description": "Dictionary in Talkie for Mac. Manage names, terms, and replacements for dictation.", "narration": "Manage names, terms, and replacements for dictation."},
  {"slug": "mac-actions", "src": "/screenshots/mac/current/talkie-workflows-light.webp", "title": "Workflows", "caption": "Create workflows with instructions and a code editor.", "description": "Workflows in Talkie for Mac. Create workflows with instructions and a code editor.", "narration": "Create workflows with instructions and a code editor."},
  {"slug": "mac-terminals", "src": "/screenshots/mac/current/talkie-terminals-light.webp", "title": "Terminals", "caption": "Run shell and agent sessions inside Talkie.", "description": "Terminals in Talkie for Mac. Run shell and agent sessions inside Talkie.", "narration": "Run shell and agent sessions inside Talkie."},
  {"slug": "mac-models", "src": "/screenshots/mac/current/talkie-settings-light.webp", "title": "Models", "caption": "Choose a speech model and manage local downloads.", "description": "Explore speech model settings in Talkie for Mac. Choose the model used to transcribe recordings on the device and manage its local downloads in one place.", "narration": "Choose a speech model and manage local downloads."},
  {"slug": "mac-learn", "src": "/screenshots/mac/current/talkie-learn-light.webp", "title": "Learn", "caption": "Read guides for capture, editing, and other Talkie features.", "description": "Learn in Talkie for Mac. Read guides for capture, editing, and other Talkie features.", "narration": "Read guides for capture, editing, and other Talkie features."},
]

const LEGACY_IPHONE_GALLERY = [
  { src: '/screenshots/iphone-16-pro-max-6.png', title: 'Memo Detail', caption: 'Transcript and actions from one recording.', description: 'Open one iPhone memo to read the transcript, run quick actions, and trigger Mac-side work.', narration: 'Here\'s a single memo. You get the full transcript, quick actions to summarize or extract key points, and you can even trigger Mac-side actions right from your phone.', audio: '/audio/tour/iphone-memo-detail.mp3' },
  { src: '/screenshots/iphone-16-pro-max-7.png', title: 'Library', caption: 'All your memos in one place.', description: 'Explore the memo library in Talkie for iPhone. Browse saved recordings, search for a memo, and filter by date to return to thoughts captured throughout the day.', narration: 'Your library holds all your memos. You can search through them, filter by date, and pick up right where you left off.', audio: '/audio/tour/iphone-library.mp3' },
  { src: '/screenshots/iphone-16-pro-max-4.png', title: 'Ready', caption: 'One tap to start recording.', description: 'The Talkie iPhone capture screen is ready: one tap starts recording a thought on the go.', narration: 'Talkie is ready to go. Just tap the button and start talking.', audio: '/audio/tour/iphone-ready.mp3' },
  { src: '/screenshots/iphone-16-pro-max-5.png', title: 'Recording', caption: 'Live waveform — speak naturally.', description: 'While you speak on iPhone, Talkie shows a live waveform so you can see the capture in progress.', narration: 'You\'re recording. The live waveform shows your voice in real time. Speak naturally, and tap stop when you\'re done.', audio: '/audio/tour/iphone-recording.mp3' },
  { src: '/screenshots/iphone-16-pro-max-1.png', title: 'Welcome', caption: 'Capture on iPhone, process on Mac.', description: 'Talkie on iPhone captures the thought; your Mac handles transcription, summaries, and follow-up work.', narration: 'Talkie combines voice memos with AI. Capture a thought on your iPhone, and let your Mac do the heavy lifting — transcription, summarization, and more.', audio: '/audio/tour/iphone-welcome.mp3' },
  { src: '/screenshots/iphone-16-pro-max-2.png', title: 'Sync', caption: 'Encrypted end-to-end via iCloud.', description: 'iPhone captures sync to Mac through your iCloud account, encrypted end-to-end on your devices.', narration: 'Sync is powered by iCloud. Your data is encrypted end-to-end and stays on your devices. No third-party servers, ever.', audio: '/audio/tour/iphone-sync.mp3' },
  { src: '/screenshots/iphone-16-pro-max-3.png', title: 'Settings', caption: 'Themes, appearance, and full control.', description: 'Explore the settings screen in Talkie for iPhone. Adjust themes and appearance, and find debug information alongside the controls for how the app looks.', narration: 'And you get full control over the look and feel. Themes, appearance settings, and even debug info if you want to peek under the hood.', audio: '/audio/tour/iphone-settings.mp3' },
]

const IPHONE_GALLERY = [
  {"slug": "iphone-home", "src": "/screenshots/mobile/iphone-home-current.webp", "title": "Home", "caption": "Start a capture, ask Talkie, or return to recent memos.", "description": "Home in Talkie for iPhone. Start a capture, ask Talkie, or return to recent memos.", "narration": "Start a capture, ask Talkie, or return to recent memos."},
  {"slug": "iphone-recording", "src": "/screenshots/mobile/iphone-recording-current.webp", "title": "Recording", "caption": "See the waveform and recording time. Stop or save the memo.", "description": "Recording in Talkie for iPhone. See the waveform and recording time. Stop or save the memo.", "narration": "See the waveform and recording time. Stop or save the memo."},
  {"slug": "iphone-memo-detail", "src": "/screenshots/mobile/iphone-memo-current.webp", "title": "Memo Detail", "caption": "Play the recording, read its transcript, and run a workflow.", "description": "Memo Detail in Talkie for iPhone. Play the recording, read its transcript, and run a workflow.", "narration": "Play the recording, read its transcript, and run a workflow."},
  {"slug": "iphone-compose", "src": "/screenshots/mobile/iphone-keyboard-current.webp", "title": "Compose", "caption": "Edit text with dictation, keyboard controls, and writing actions.", "description": "Compose in Talkie for iPhone. Edit text with dictation, keyboard controls, and writing actions.", "narration": "Edit text with dictation, keyboard controls, and writing actions."},
]

const LEGACY_WATCH_GALLERY = [
  { slug: 'watch-link', src: '/screenshots/apple-watch-link.png', title: 'Ready', caption: 'Raise your wrist, tap record, and keep moving.', description: 'Raise your wrist and tap record. Talkie on Apple Watch starts capture and syncs it to your library.', narration: 'The Watch app is for the moment before the thought disappears. One tap starts capture, then the recording syncs back through your phone to the same Talkie library.' },
  { slug: 'watch-record', src: '/screenshots/apple-watch-ready.png', title: 'Record', caption: 'A big tap target for quick wrist capture.', description: 'The Apple Watch record screen keeps start, stop, and Ask AI large enough to hit while moving.', narration: 'The Watch screen keeps the interaction deliberately oversized: start, stop, and ask AI are all reachable without turning a passing idea into another task.' },
  { slug: 'watch-launch', src: '/screenshots/apple-watch-launch.png', title: 'Launch', caption: 'The wrist-sized Talkie surface, trimmed to essentials.', description: 'Talkie on Apple Watch is a wrist-sized capture door, not a second inbox. Record and get back to it later.', narration: 'Talkie on Watch keeps the brand signal and the recording path visible at a glance. It is not a second inbox; it is the fastest doorway back into the system.' },
]

const WATCH_GALLERY = [
  { slug: 'watch-home', src: '/screenshots/mobile/apple-watch-home-current.webp', title: 'Home', caption: 'Start a recording, ask Talkie, or review waiting memos.', description: 'The Talkie Apple Watch home screen shows recent activity, waiting memos, and controls for Talk, Ask, and Review.', narration: 'The home screen shows recent activity and waiting memos. Tap Talk to start a recording, Ask to ask Talkie, or Review to open memos.' },
]

// Derive slug from audio path: /audio/tour/mac-home.mp3 → mac-home
function slugFromAudio(audio) {
  return audio.replace('/audio/tour/', '').replace('.mp3', '')
}

function slugForItem(item) {
  return item.slug || slugFromAudio(item.audio)
}

// Build the flat list with slug + platform fields
const TOUR_ITEMS = [
  ...MAC_GALLERY.map(item => ({ ...item, slug: slugForItem(item), platform: 'mac' })),
  ...IPHONE_GALLERY.map(item => ({ ...item, slug: slugForItem(item), platform: 'iphone' })),
  ...WATCH_GALLERY.map(item => ({ ...item, slug: slugForItem(item), platform: 'watch' })),
]

export function tourPlatformLabel(platform) {
  if (platform === 'iphone') return 'iPhone'
  if (platform === 'watch') return 'Apple Watch'
  return 'Mac'
}

export function tourSeoTitle(item) {
  return `${item.title} — Talkie for ${tourPlatformLabel(item.platform)}`
}

/** All slugs for generateStaticParams */
export function getAllTourSlugs() {
  return [...new Set([...TOUR_ITEMS.map(item => item.slug), ...LEGACY_MAC_GALLERY.map(slugForItem), ...LEGACY_IPHONE_GALLERY.map(slugForItem), ...LEGACY_WATCH_GALLERY.map(slugForItem)])]
}

/** Look up a single tour item by slug */
export function getTourBySlug(slug) {
  const current = TOUR_ITEMS.find(item => item.slug === slug)
  if (current) return current
  // Preserve existing links to screens no longer featured in the current gallery.
  const legacy = LEGACY_MAC_GALLERY.find(item => slugForItem(item) === slug)
  if (legacy) return { ...legacy, slug, platform: 'mac' }
  const legacyPhone = LEGACY_IPHONE_GALLERY.find(item => slugForItem(item) === slug)
  if (legacyPhone) return { ...legacyPhone, slug, platform: 'iphone' }
  const legacyWatch = LEGACY_WATCH_GALLERY.find(item => slugForItem(item) === slug)
  return legacyWatch ? { ...legacyWatch, slug, platform: 'watch' } : null
}

/** Get all tour items (flat array, mac then iphone) */
export function getTourItems() {
  return TOUR_ITEMS
}

/** Get prev/next tour items relative to a slug */
export function getAdjacentTour(slug) {
  const index = TOUR_ITEMS.findIndex(item => item.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? TOUR_ITEMS[index - 1] : null,
    next: index < TOUR_ITEMS.length - 1 ? TOUR_ITEMS[index + 1] : null,
  }
}

export { MAC_GALLERY, IPHONE_GALLERY, WATCH_GALLERY }

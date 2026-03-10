/**
 * Shared tour/gallery data for Talkie screenshots.
 * Used by both the landing page carousel and individual /tour/[slug] pages.
 */

const MAC_GALLERY = [
  { src: '/screenshots/mac-home.png', title: 'Home', caption: 'Your dashboard — stats, memos, and activity at a glance.', narration: 'This is your home screen. You can see your recent memos, daily stats, transcription activity, and a heatmap of how often you\'ve been using Talkie. Everything at a glance.', audio: '/audio/tour/mac-home.mp3' },
  { src: '/screenshots/mac-models.png', title: 'Models', caption: 'Local LLMs, cloud providers, and speech-to-text engines.', narration: 'Talkie supports local models, cloud providers, and multiple speech-to-text engines. You can mix and match — use Whisper locally for privacy, or a cloud provider when you need speed.', audio: '/audio/tour/mac-models.mp3' },
  { src: '/screenshots/mac-actions.png', title: 'Actions', caption: 'Workflows packaged as one-tap buttons.', narration: 'Actions are like little workflows you can trigger with one tap. Summarize an email, extract key insights from a meeting, or clean up your writing. You can customize them or build your own.', audio: '/audio/tour/mac-actions.mp3' },
  { src: '/screenshots/mac-appearance.png', title: 'Appearance', caption: 'Themes, accent colors, and typography controls.', narration: 'Talkie has seven built-in themes, accent color customization, and full typography controls. You can make it feel like your own app.', audio: '/audio/tour/mac-appearance.mp3' },
  { src: '/screenshots/mac-account.png', title: 'Account', caption: 'Private, synced, or connected — you choose.', narration: 'Your data stays yours. Talkie is private by default — everything runs locally. If you want sync, you opt in. And if you want cloud features, you choose the tier that fits.', audio: '/audio/tour/mac-account.mp3' },
  { src: '/screenshots/mac-recording.png', title: 'Recording', caption: 'The HUD floats over your work, never interrupts.', narration: 'You can capture a memo from anywhere on your Mac. The recording HUD floats on top of whatever you\'re doing, so it never gets in the way.', audio: '/audio/tour/mac-recording.mp3' },
  { src: '/screenshots/mac-memo-saved.png', title: 'Saved', caption: 'Duration, word count, and a link to view.', narration: 'And just like that, it\'s saved. You get the duration, word count, and a quick link to jump right into the transcript.', audio: '/audio/tour/mac-memo-saved.mp3' },
  { src: '/screenshots/mac-compose.png', title: 'Compose', caption: 'Write and transform with AI.', narration: 'The compose view lets you write and transform text with AI. Quick actions sit right below, so you can rewrite, expand, or refine without leaving the page.', audio: '/audio/tour/mac-compose.mp3' },
  { src: '/screenshots/mac-compose-diff.png', title: 'Diff View', caption: 'Accept or reject revisions, word by word.', narration: 'When AI edits your text, you see a clean diff view. Green for additions, red for removals. You can accept or reject each change, word by word.', audio: '/audio/tour/mac-compose-diff.mp3' },
]

const IPHONE_GALLERY = [
  { src: '/screenshots/iphone-16-pro-max-6.png', title: 'Memo Detail', caption: 'Transcript and actions from one recording.', narration: 'Here\'s a single memo. You get the full transcript, quick actions to summarize or extract key points, and you can even trigger Mac-side actions right from your phone.', audio: '/audio/tour/iphone-memo-detail.mp3' },
  { src: '/screenshots/iphone-16-pro-max-7.png', title: 'Library', caption: 'All your memos in one place.', narration: 'Your library holds all your memos. You can search through them, filter by date, and pick up right where you left off.', audio: '/audio/tour/iphone-library.mp3' },
  { src: '/screenshots/iphone-16-pro-max-4.png', title: 'Ready', caption: 'One tap to start recording.', narration: 'Talkie is ready to go. Just tap the button and start talking.', audio: '/audio/tour/iphone-ready.mp3' },
  { src: '/screenshots/iphone-16-pro-max-5.png', title: 'Recording', caption: 'Live waveform — speak naturally.', narration: 'You\'re recording. The live waveform shows your voice in real time. Speak naturally, and tap stop when you\'re done.', audio: '/audio/tour/iphone-recording.mp3' },
  { src: '/screenshots/iphone-16-pro-max-1.png', title: 'Welcome', caption: 'Capture on iPhone, process on Mac.', narration: 'Talkie combines voice memos with AI. Capture a thought on your iPhone, and let your Mac do the heavy lifting — transcription, summarization, and more.', audio: '/audio/tour/iphone-welcome.mp3' },
  { src: '/screenshots/iphone-16-pro-max-2.png', title: 'Sync', caption: 'Encrypted end-to-end via iCloud.', narration: 'Sync is powered by iCloud. Your data is encrypted end-to-end and stays on your devices. No third-party servers, ever.', audio: '/audio/tour/iphone-sync.mp3' },
  { src: '/screenshots/iphone-16-pro-max-3.png', title: 'Settings', caption: 'Themes, appearance, and full control.', narration: 'And you get full control over the look and feel. Themes, appearance settings, and even debug info if you want to peek under the hood.', audio: '/audio/tour/iphone-settings.mp3' },
]

// Derive slug from audio path: /audio/tour/mac-home.mp3 → mac-home
function slugFromAudio(audio) {
  return audio.replace('/audio/tour/', '').replace('.mp3', '')
}

// Build the flat list with slug + platform fields
const TOUR_ITEMS = [
  ...MAC_GALLERY.map(item => ({ ...item, slug: slugFromAudio(item.audio), platform: 'mac' })),
  ...IPHONE_GALLERY.map(item => ({ ...item, slug: slugFromAudio(item.audio), platform: 'iphone' })),
]

/** All slugs for generateStaticParams */
export function getAllTourSlugs() {
  return TOUR_ITEMS.map(item => item.slug)
}

/** Look up a single tour item by slug */
export function getTourBySlug(slug) {
  return TOUR_ITEMS.find(item => item.slug === slug) || null
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

export { MAC_GALLERY, IPHONE_GALLERY }

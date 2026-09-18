/**
 * The hero's dictation captures.
 *
 * Each of these is a real clip in `public/captures/`: an MP3 of the line being
 * spoken, and an alignment file giving the millisecond every word lands on.
 * The hero plays the audio and writes the words on those timings, so the
 * transcript arrives exactly as it was said rather than on a made-up timer.
 *
 * The rotation is here so a second click is a different sentence — five
 * different things people actually dictate, rather than one line on repeat.
 */

const BASE = '/captures'

export const HERO_CAPTURES = [
  { slug: 'email-david', caption: 'Mail' },
  { slug: 'issue-tab-router', caption: 'Linear' },
  { slug: 'sms-coffee', caption: 'Messages' },
  { slug: 'meeting-decision-cream', caption: 'Notes' },
  { slug: 'prompt-podcast-names', caption: 'Claude' },
]

export const captureAudio = (slug) => `${BASE}/${slug}.mp3`

// One in-flight promise per slug: a hover prefetch and the click that follows
// share the same request, and a loaded capture is never fetched twice.
const cache = new Map()

/** `{ duration, words: [{ word, start }], text }` for a capture. */
export function loadCapture(slug) {
  const cached = cache.get(slug)
  if (cached) return cached

  const pending = fetch(`${BASE}/${slug}.alignment.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`alignment ${response.status}`)
      return response.json()
    })
    .then(toCapture)
    .catch((error) => {
      // Let a later attempt retry rather than caching the failure forever.
      cache.delete(slug)
      throw error
    })

  cache.set(slug, pending)
  return pending
}

function toCapture(data) {
  // The first word of a continuing phrase carries the space that joined it to
  // the previous one, which would double up once the words are rejoined here.
  const words = []
  for (const phrase of data.phrases ?? []) {
    for (const entry of phrase.words ?? []) {
      const word = entry.word.trim()
      if (word) words.push({ word, start: entry.start })
    }
  }
  return {
    duration: data.duration ?? 0,
    words,
    text: words.map((entry) => entry.word).join(' '),
  }
}

/**
 * How many words have been spoken by `time`. Playback only ever moves forward,
 * so the search resumes from the caller's last count instead of rescanning.
 */
export function spokenCountAt(words, time, from = 0) {
  let count = Math.min(Math.max(from, 0), words.length)
  while (count > 0 && words[count - 1].start > time) count -= 1
  while (count < words.length && words[count].start <= time) count += 1
  return count
}

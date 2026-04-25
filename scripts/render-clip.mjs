#!/usr/bin/env node
/**
 * render-clip.mjs — render a Talkie audio clip via ElevenLabs' with-
 * timestamps endpoint. Produces an MP3 + character-aligned VTT in
 * public/v2/captures/.
 *
 * Usage:
 *   node scripts/render-clip.mjs --text "literal text" --slug my-clip
 *   node scripts/render-clip.mjs --text-file path/to/script.txt --slug my-clip
 *
 * Config is read from ~/.config/speakeasy/settings.json
 * (providers.elevenlabs.{apiKey, voiceId, modelId}). Override via:
 *   ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID
 *
 * Why with-timestamps: it returns the same MP3 plus a character-level
 * alignment array. We use that to chunk into VTT cues at natural cue
 * boundaries (sentence ends, em-dash clauses, max-length wraps) — no
 * hand-timing, no Whisper round-trip.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

// ---------- Args ----------
const args = process.argv.slice(2)
const opts = {}
for (let i = 0; i < args.length; i++) {
  const flag = args[i]
  if (flag === '--text') { opts.text = args[++i] }
  else if (flag === '--text-file') { opts.textFile = args[++i] }
  else if (flag === '--slug') { opts.slug = args[++i] }
  else if (flag === '--out-dir') { opts.outDir = args[++i] }
}
if (!opts.slug) { console.error('Missing --slug'); process.exit(1) }
const text = opts.text ?? fs.readFileSync(opts.textFile, 'utf8').trim()
const outDir = opts.outDir ?? 'public/v2/captures'
fs.mkdirSync(outDir, { recursive: true })

// ---------- Config ----------
const settingsPath = path.join(os.homedir(), '.config/speakeasy/settings.json')
const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, 'utf8')) : {}
const apiKey = process.env.ELEVENLABS_API_KEY ?? settings.providers?.elevenlabs?.apiKey
const voiceId = process.env.ELEVENLABS_VOICE_ID ?? settings.providers?.elevenlabs?.voiceId
const modelId = process.env.ELEVENLABS_MODEL_ID ?? settings.providers?.elevenlabs?.modelId ?? 'eleven_multilingual_v2'
if (!apiKey || !voiceId) { console.error('Missing ElevenLabs apiKey/voiceId'); process.exit(1) }

// ---------- Render ----------
const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`
const body = {
  text,
  model_id: modelId,
  voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
}
process.stdout.write(`  ${opts.slug.padEnd(28)} ${text.length.toString().padStart(4)} chars  ·  rendering... `)
const t0 = Date.now()
const res = await fetch(url, {
  method: 'POST',
  headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
if (!res.ok) {
  console.error(`\nFAIL ${opts.slug}: HTTP ${res.status}`)
  console.error(await res.text())
  process.exit(1)
}
const data = await res.json()

// ---------- Write MP3 ----------
const mp3Path = path.join(outDir, `${opts.slug}.mp3`)
const audioBytes = Buffer.from(data.audio_base64, 'base64')
fs.writeFileSync(mp3Path, audioBytes)

// ---------- VTT ----------
const vttPath = path.join(outDir, `${opts.slug}.vtt`)
const vtt = alignmentToVtt(data.alignment ?? data.normalized_alignment)
fs.writeFileSync(vttPath, vtt)

const dur = (Date.now() - t0) / 1000
console.log(`done in ${dur.toFixed(1)}s · ${(audioBytes.length / 1024).toFixed(0)} KB`)

// ---------- Helpers ----------
function alignmentToVtt(alignment) {
  if (!alignment) return 'WEBVTT\n\nNOTE\nNo alignment returned.\n'
  const chars = alignment.characters
  const starts = alignment.character_start_times_seconds
  const ends = alignment.character_end_times_seconds

  // Walk characters, group into cues at natural breakpoints. Cues hold
  // ~3–10 seconds of audio; we break on sentence ends, on em-dash /
  // comma clauses if we've already accumulated enough, or on a hard
  // length cap.
  const cues = []
  let buf = ''
  let cueStart = null
  let charsInBuf = 0

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    if (cueStart === null && /\S/.test(c)) cueStart = starts[i]
    buf += c
    charsInBuf++

    const next = chars[i + 1]
    const isSentenceEnd = /[.!?]/.test(c) && (i + 1 >= chars.length || /\s/.test(next))
    const isClauseEnd = /[—,;:]/.test(c) && charsInBuf >= 35
    const isHardCap = charsInBuf >= 90 && /\s/.test(c)

    if (isSentenceEnd || isClauseEnd || isHardCap) {
      const text = buf.trim()
      if (text && cueStart !== null) {
        cues.push({ start: cueStart, end: ends[i], text })
      }
      buf = ''
      cueStart = null
      charsInBuf = 0
    }
  }
  // Flush any tail (no trailing punctuation)
  if (buf.trim() && cueStart !== null) {
    cues.push({ start: cueStart, end: ends[ends.length - 1], text: buf.trim() })
  }

  let out = 'WEBVTT\n\n'
  for (const c of cues) {
    out += `${fmtTime(c.start)} --> ${fmtTime(c.end)}\n${c.text}\n\n`
  }
  return out
}

function fmtTime(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = (s % 60).toFixed(3).padStart(6, '0')
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${ss}`
}

# /v2/captures — hero signal-table audio assets

The home hero (`/v2`) renders a navigatable **signal table** of real Talkie
dictation captures. Each row in `content/v2/captures.json` references two
files in this directory:

```
public/v2/captures/{slug}.mp3   ← the spoken audio
public/v2/captures/{slug}.vtt   ← the WebVTT caption track
```

The catalog (and this contract) is intentionally data-driven: drop new
files in, add a row to `captures.json`, ship.

## Convention

| File          | Required | Notes                                              |
| ------------- | -------- | -------------------------------------------------- |
| `{slug}.mp3`  | yes\*    | mono, 44.1k, ~128 kbps from ElevenLabs flash.      |
| `{slug}.vtt`  | no       | If absent, captions just don't render.             |

\* If `{slug}.mp3` is missing, the row stays visible but the play button
shows `· no audio yet` and clicks no-op (with a single console.warn for
dev visibility — no thrown errors, no broken UI).

## Generating audio (the canonical pipeline)

A reusable Node script lives at `scripts/render-clip.mjs`. It calls
ElevenLabs' `/v1/text-to-speech/{voice_id}/with-timestamps` endpoint
and produces both the MP3 *and* a character-aligned VTT in one shot —
no Whisper round-trip, no hand-timing.

```bash
# Single clip from a literal text
node scripts/render-clip.mjs \
  --text "Tell Sarah I'll be ten late but bringing coffee." \
  --slug sms-coffee

# Single clip from a script file
node scripts/render-clip.mjs \
  --text-file content/v2/scripts/philosophy-manifesto.txt \
  --slug philosophy-manifesto

# Re-render the entire 8-row catalog from captures.json
jq -c '.[]' content/v2/captures.json | while read row; do
  SLUG=$(echo "$row" | jq -r '.slug')
  TEXT=$(echo "$row" | jq -r '.input')
  node scripts/render-clip.mjs --text "$TEXT" --slug "$SLUG"
done
```

The script reads voice ID, model ID, and API key from
`~/.config/speakeasy/settings.json` (the speakeasy CLI's config file).
Override via env vars: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`,
`ELEVENLABS_MODEL_ID`.

## VTT generation

The script's `alignmentToVtt()` walks the character-level alignment
returned by the with-timestamps endpoint and groups characters into
cues at natural breakpoints:

- **Sentence ends** (`.`, `!`, `?` followed by whitespace or end) — always.
- **Clause ends** (`—`, `,`, `;`, `:`) — only if the cue is already 35+
  chars long, so we don't fragment too aggressively on commas.
- **Hard length cap** at 90 chars on a whitespace boundary, so a long
  comma-free run still wraps.

The result reads like sentence-level subtitles but with millisecond-
accurate boundaries from the actual TTS render.

## Why audio IS now checked in

The original convention was to keep MP3s out of the repo (regenerate
on demand). For the v2 launch we flipped that: the GitHub Pages
static export needs the audio in `out/`, so the files live in
`public/v2/captures/` and ship with the site. `scripts/render-clip.mjs`
is the audit trail — a single command can regenerate any clip from
the original text + the locked voice/model config.

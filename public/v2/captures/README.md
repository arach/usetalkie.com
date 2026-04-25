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
| `{slug}.mp3`  | yes\*    | mono, 44.1k or 48k, 96–128 kbps is plenty.         |
| `{slug}.vtt`  | no       | If absent, captions just don't render.             |

\* If `{slug}.mp3` is missing, the row stays visible but the play button
shows `· no audio yet` and clicks no-op (with a single console.warn for
dev visibility — no thrown errors, no broken UI).

## Generating audio (ElevenLabs)

1. Pick a stable voice (the same voice across every row sells the
   "single user dictating" illusion). Save the voice ID somewhere.
2. For each row in `content/v2/captures.json`, render the `input` string
   with the chosen voice. Defaults are fine (stability ~0.5, similarity
   ~0.75). Aim for natural pacing — these are dictations, not narration.
3. Export as 44.1 kHz mono MP3 at ~96 kbps.
4. Save as `public/v2/captures/{slug}.mp3`.
5. Update `durationMs` in the catalog to match the actual audio length
   (run `ffprobe -i {slug}.mp3 -show_format` to read it). The player
   uses the real `<audio>.duration` at runtime — `durationMs` is only
   for the SSR shell so the static fallback can hint at length.

## Authoring the WebVTT

Minimum viable VTT for a single-line capture:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.500
Tell Sarah I'll be ten late but bringing coffee.
```

For multi-cue captions, split at natural pauses (commas, em-dashes):

```vtt
WEBVTT

00:00:00.000 --> 00:00:02.100
Reply to David —

00:00:02.100 --> 00:00:05.400
thanks for the spec,

00:00:05.400 --> 00:00:09.800
two questions on the auth flow before I sign off.
```

### Auto-aligning with Whisper

If you have `whisper` (openai-whisper) installed locally:

```bash
whisper sms-coffee.mp3 --output_format vtt --model base.en
```

The output `sms-coffee.vtt` is usually good enough as-is for the player.
Hand-tweak cue boundaries if a phrase splits awkwardly.

## Why no audio is checked in

These files are best generated in a controlled, repeatable way (consistent
voice, consistent leveling) and live cleanly with the static export. The
dir is committed via `.gitkeep` so the build doesn't 404 on the parent
path; actual MP3s land here either via a one-off rendering script or
manually.

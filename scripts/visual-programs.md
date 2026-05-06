# Visual Programs

This folder of scripts treats generated or raw artwork as source material, then runs it through a named deterministic program before the image is used on the site.

The goal is a reusable Talkie design language: every hero or header can start from a different source image, but pass through the same programmatic proxy so the final artifacts share a visible system.

## `talkie-signal-weave`

Entry point:

```bash
bun run image:signal-weave
```

Default storage:

```text
public/images/workflows/voice-in-drafts-tasks-files-source.png
public/images/workflows/voice-in-drafts-tasks-files-processed.png
public/images/workflows/voice-in-drafts-tasks-files-processed.manifest.json
```

What the program does:

1. Normalizes the source image to a stable working width.
2. Mixes pixels partway toward a constrained Talkie palette using an ordered 8x8 matrix.
3. Samples local luminance differences and places sparse emerald trace pixels on image edges.
4. Draws deterministic dashed Bezier signal paths from voice input toward output artifacts.
5. Writes a processed PNG and a manifest with hashes, parameters, curves, and program metadata.

Useful overrides:

```bash
node scripts/process-voice-illustration.js \
  --input public/images/workflows/example-source.png \
  --output public/images/workflows/example-processed.png \
  --manifest public/images/workflows/example-processed.manifest.json \
  --work-width 1440 \
  --output-width 1440 \
  --strength 14 \
  --palette-mix 0.48
```

The source artifact should remain stored beside the processed result. The manifest is the receipt: it records the input hash, output hash, parameters, and the program stages that produced the final image.

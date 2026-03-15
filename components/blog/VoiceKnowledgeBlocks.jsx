"use client"

import { obsidianNotes, prompts, codeBlocks } from './voice-knowledge-data'
import ObsidianNote from './ObsidianNote'
import PromptShowcase from './PromptShowcase'
import CopyableCode from './CopyableCode'

/**
 * Lookup wrappers for the voice-knowledge post.
 * MDX just passes a simple string id — all complex data stays in JS.
 *
 * Usage in MDX:
 *   <VKNote id="open-scout" />
 *   <VKPrompt id="extract-topics" />
 *   <VKCode id="file-structure" />
 */

export function VKNote({ id }) {
  const data = obsidianNotes[id]
  if (!data) return null
  return <ObsidianNote title={data.title} content={data.content} />
}

export function VKPrompt({ id }) {
  const data = prompts[id]
  if (!data) return null
  return (
    <PromptShowcase
      title={data.title}
      prompt={data.prompt}
      annotations={data.annotations}
    />
  )
}

export function VKCode({ id }) {
  const data = codeBlocks[id]
  if (!data) return null
  return <CopyableCode label={data.label} code={data.code} />
}

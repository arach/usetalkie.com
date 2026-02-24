"use client"

import { PatchDiff } from '@pierre/diffs/react'

const diffs = {
  "apple-to-parakeet": {
    oldName: "Apple Speech (iOS)",
    newName: "Parakeet v3 (raw)",
    oldText: `Okay, so one idea that I was thinking about this morning, and I almost forgot is basically the, um, exploration continuing, right? So we had obviously talk, we have now window management, voice commands, all of this wonderful stuff.

But I think it would be really interesting if I went one level deeper into, um, like working on a small model and making adjustments to it for a specific use case so that it's small and fast and fine tuned to my needs. And then I think along the way, It would be interesting to make that a workflow that I can understand and then maybe that makes it a little bit more attainable to normal people, I guess.

Um, and so, but step one is to start building that process. So, I need to educate myself on what's the best kind of, uh, set of frameworks that I should be using? And then, yeah, go, go get, like, started with a problem.

I think I'm, I have a pretty organic set of problems with talkie. Um, I think specifically around uh, programming language, um, processing. And I think I'll have an opportunity to have like a rich enough data set pretty early. Um, and so I'll be able to have, um, smart voice, I think, um, not heuristics, I guess, like, uh, fine tune model that could, um, I could get us really pretty far. pretty quickly.`,
    newText: `Okay, so one idea that I was thinking about this morning and I almost forgot is basically the um exploration continuing, right? So we had obviously talk, we have now window management, voice commands, all of this wonderful stuff.

But I think it would be really interesting if I went one level deeper into um like working on a small model and making adjustments to it for a specific use case so that it's small and fast and fine-tuned to my needs, and then I think along the way it would be interesting to make that a workflow that I can understand and then maybe that makes it a little bit more attainable to normal people I guess.

Um and so but step one is to start building that process. So I need to educate myself on what's the best kind of uh set of frameworks that I should be using and then yeah, go go get like started with a problem.

I think I'm I have a pretty organic set of problems with talkie. Um I think specifically around uh programming language um processing and I think I'll have an opportunity to have like a rich enough data set pretty early um and so I'll be able to have um smart voice I think um heurist not heuristics I guess like uh fine-tuned model that could um that could get us really pretty far um pretty quickly.`,
  },
  "parakeet-to-postprocessed": {
    oldName: "Parakeet v3 (raw)",
    newName: "Parakeet v3 (post-processed)",
    oldText: `Okay, so one idea that I was thinking about this morning and I almost forgot is basically the um exploration continuing, right? So we had obviously talk, we have now window management, voice commands, all of this wonderful stuff.

But I think it would be really interesting if I went one level deeper into um like working on a small model and making adjustments to it for a specific use case so that it's small and fast and fine-tuned to my needs, and then I think along the way it would be interesting to make that a workflow that I can understand and then maybe that makes it a little bit more attainable to normal people I guess.

Um and so but step one is to start building that process. So I need to educate myself on what's the best kind of uh set of frameworks that I should be using and then yeah, go go get like started with a problem.

I think I'm I have a pretty organic set of problems with talkie. Um I think specifically around uh programming language um processing and I think I'll have an opportunity to have like a rich enough data set pretty early um and so I'll be able to have um smart voice I think um heurist not heuristics I guess like uh fine-tuned model that could um that could get us really pretty far um pretty quickly.`,
    newText: `Okay, so one idea that I was thinking about this morning and I almost forgot is basically the exploration continuing, right? So we had obviously talk, we have now window management, voice commands, all of this wonderful stuff.

But I think it would be really interesting if I went one level deeper into like working on a small model and making adjustments to it for a specific use case so that it's small and fast and fine-tuned to my needs, and then I think along the way it would be interesting to make that a workflow that I can understand and then maybe that makes it a little bit more attainable to normal people I guess.

And so but step one is to start building that process. So I need to educate myself on what's the best kind of set of frameworks that I should be using and then yeah, go go get like started with a problem.

I think I'm I have a pretty organic set of problems with talkie. I think specifically around programming language processing and I think I'll have an opportunity to have like a rich enough data set pretty early and so I'll be able to have smart voice I think heurist not heuristics I guess like fine-tuned model that could that could get us really pretty far pretty quickly.`,
  },
}

function makePatch(oldText, newText, oldName, newName) {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')

  let patch = `--- a/${oldName}\n+++ b/${newName}\n`
  patch += `@@ -1,${oldLines.length} +1,${newLines.length} @@\n`

  let i = 0, j = 0
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      patch += ` ${oldLines[i]}\n`
      i++
      j++
    } else {
      if (i < oldLines.length) {
        patch += `-${oldLines[i]}\n`
        i++
      }
      if (j < newLines.length) {
        patch += `+${newLines[j]}\n`
        j++
      }
    }
  }

  return patch
}

const diffOptions = {
  diffStyle: 'unified',
  overflow: 'wrap',
  disableFileHeader: true,
  changeIndicators: 'bars',
  themeType: 'dark',
}

export default function TranscriptionDiff({ id, oldText, newText, oldName, newName }) {
  const data = id ? diffs[id] : { oldText, newText, oldName, newName }
  if (!data || (!data.oldText && !data.newText)) return null

  const patch = makePatch(data.oldText, data.newText, data.oldName, data.newName)

  return (
    <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 not-prose my-8">
      <PatchDiff
        patch={patch}
        options={diffOptions}
      />
    </div>
  )
}

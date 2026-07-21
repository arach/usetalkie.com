# Repeatable Narrative Process

This is the repeatable version of the workflow we just used for Talkie.

It exists in two forms:

- a plain-English process in this repo
- a Codex skill: `$narrative-studio`

## What This Process Is For

Use it when a product feels real but the story around it feels split, muddy, or less
clear than the product deserves.

Typical signs:

- the homepage and subpages are telling different stories
- the product has stronger features than the messaging reveals
- mobile, desktop, AI, privacy, and workflows are all competing for headline status
- the product needs a brief, deck, demo script, or internal presentation

## Inputs

Before starting, gather:

- main site pages
- metadata and page titles
- docs and support copy
- screenshots and demo videos
- actual feature surfaces from the codebase

## Phase 1: Inventory The Truth

Goal: understand what the product actually is before improving the story.

Look for:

- primary platform
- companion platforms
- core loop: input -> state -> output
- trust model: storage, sync, privacy, providers
- advanced layer: workflows, CLI, agents, integrations

Output:

- a short list of what the product is
- a short list of contradictions or message drift

## Phase 2: Distill The Narrative

Goal: reduce the product to one coherent system description.

Define:

- audience
- problem
- product truth
- category
- positioning statement
- master line
- supporting line
- message pillars
- what not to say

Output:

- narrative audit
- message hierarchy

## Phase 3: Build The Right Assets

Choose only the assets the situation needs.

Common outputs:

- creative brief
- pitch deck outline
- internal noindex narrative page
- homepage/mac/mobile rewrite guidance
- demo scripts at 30s, 45s, and 120s

## Phase 4: Validate Against Reality

Before calling it done, check:

- does every major claim map to a real feature?
- are privacy and trust claims factual?
- is the main product surface clear?
- are companion surfaces framed properly?
- is the advanced layer present but not overpowering?

## Default Deliverable Stack

If you want the full package, do it in this order:

1. narrative audit
2. creative brief
3. pitch deck outline
4. internal narrative page
5. demo scripts
6. page-level rewrites

## Talkie-Specific Lesson

The most useful insight from this run:

Talkie gets much clearer when it is presented as a private voice capture system with
distinct roles:

- iPhone and Watch are capture surfaces
- Mac is the action surface
- privacy and ownership are structural
- workflows, CLI, and agents are the advanced layer

That kind of clarity is the point of this process.

## How To Re-Run It With Codex

Use the skill directly:

`Use $narrative-studio to audit this product, align the story with the feature set, and produce the right messaging assets.`

You can also make the ask narrower:

- `Use $narrative-studio to create a creative brief for this app.`
- `Use $narrative-studio to write 30, 45, and 120 second demo scripts.`
- `Use $narrative-studio to turn this product story into an internal deck page.`

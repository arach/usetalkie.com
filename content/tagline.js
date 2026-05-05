/**
 * Brand tagline configuration — single source of truth for the
 * "A ___ is all you need." pattern across the v2 site.
 *
 * Editing this file is the ONLY place to change brand-voice strings.
 * Every component that displays the supporting line imports from here.
 *
 * Hard rules for any new variant (per the brand-voice memory):
 *   1. 1–2 syllables maximum (preserves the "Attention Is All You Need"
 *      callback rhythm — the original is 3 syllables, the punch comes
 *      from compressing further).
 *   2. Every fill is a concrete actual input — something the user
 *      produces or hands the device. No abstractions (thought, signal,
 *      idea, moment, breath). The joke works because attention is a
 *      real mechanism, not a vibe.
 *
 * Cut list (do NOT add): thought, signal, breath, rant, click, moment,
 * pause, recording, keystroke. Each was tried; each broke a rule.
 *
 * Subtle positioning note: this list intentionally spans more than just
 * voice (scribble = writing, snap = photo, link = URL/reference). The
 * brand is "Talkie ingests anything low-effort", not "Talkie is voice-
 * only." If you cut a non-voice variant, replace it with another
 * non-voice one to preserve the multi-modal signal.
 */

// Anchor — the "headline" fill. Used as SSR initial state for the
// rotation and in static surfaces (footer wordmark, share-card meta).
export const ANCHOR_VARIANT = 'mic'

// Homepage hero — fades through these every intervalMs (default 6s).
export const TAGLINE_VARIANTS = ['mic', 'scribble', 'snap', 'link', 'memo']

// Curated per-surface static fills (no rotation; picked to fit each
// page's argument).
export const TAGLINE_PHILOSOPHY = 'voice' // ties to the page's pull quote
export const TAGLINE_ABOUT = 'memo'       // concrete, fits operator-log voice

// Helper — builds the full supporting line for a given fill.
export const supportingLine = (fill) => `A ${fill} is all you need.`

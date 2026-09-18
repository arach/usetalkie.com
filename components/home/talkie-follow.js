/**
 * The polite follow.
 *
 * Talkie's macOS companion trails the pointer rather than sticking to it:
 * momentum carries it through turns, it pulls harder the further behind it
 * falls, and it never bounces past. This is that motion, ported from
 * CursorMicrophoneIndicator.swift and shared by every surface on the site
 * that lends the page Talkie's companion.
 */

// Offsets from the pointer to the badge's top-left, in CSS pixels. The native
// panel is 40pt wide with a 24pt badge centred in it, sitting a 10pt gap down
// and right of the pointer — so the badge itself lands 18pt out on each axis.
export const POINTER_GAP = 18
export const BADGE_SIZE = 24

/** Mutable follow state. Kept in one object so a frame loop can write it in place. */
export function createFollowState(x = 0, y = 0) {
  return { x, y, vx: 0, vy: 0 }
}

/** Drop the follower onto a point with no motion left over. */
export function settleFollow(state, x, y) {
  state.x = x
  state.y = y
  state.vx = 0
  state.vy = 0
}

export function followDistance(state, x, y) {
  return Math.hypot(state.x - x, state.y - y)
}

/** Whether the follower has arrived and stopped, so a caller can end a glide. */
export function followAtRest(state, x, y) {
  return followDistance(state, x, y) < 0.6 && Math.hypot(state.vx, state.vy) < 12
}

/**
 * Advance one frame of a critically damped spring towards (x, y).
 *
 * `omega` rises with distance, so a pointer that jumps across the screen is
 * chased hard while a small nudge stays lazy. Critically damped means it
 * settles without ever overshooting the target.
 */
export function stepFollow(state, x, y, dt) {
  const deltaX = state.x - x
  const deltaY = state.y - y
  const distance = Math.hypot(deltaX, deltaY)
  const omega = 12 + 8 * Math.min(1, distance / 140)
  const decay = Math.exp(-omega * dt)
  const carryX = state.vx + omega * deltaX
  const carryY = state.vy + omega * deltaY
  state.x = x + (deltaX + carryX * dt) * decay
  state.y = y + (deltaY + carryY * dt) * decay
  state.vx = (state.vx - omega * carryX * dt) * decay
  state.vy = (state.vy - omega * carryY * dt) * decay
}

"use client"

const TRACE_GLOW_SOFT = { textShadow: '0 0 4px var(--trace-glow)' }

const vocab = [
  { spoken: 'dash', symbol: '-' },
  { spoken: 'quote', symbol: '"' },
  { spoken: 'dot', symbol: '.' },
  { spoken: 'slash', symbol: '/' },
  { spoken: 'pipe', symbol: '|' },
  { spoken: 'star', symbol: '*' },
  { spoken: 'backslash', symbol: '\\' },
  { spoken: 'semicolon', symbol: ';' },
  { spoken: 'dollar', symbol: '$' },
  { spoken: 'tilde', symbol: '~' },
  { spoken: 'ampersand', symbol: '&' },
  { spoken: 'at', symbol: '@' },
  { spoken: 'hash', symbol: '#' },
  { spoken: 'open paren', symbol: '(' },
  { spoken: 'close paren', symbol: ')' },
]

export default function VocabGrid() {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {vocab.map(({ spoken, symbol }) => (
          <div
            key={spoken}
            className="flex flex-col items-center gap-1 rounded-lg border border-edge-dim bg-canvas-alt py-3 px-2"
          >
            <span className="text-[11px] italic text-ink-muted">
              {spoken}
            </span>
            <span
              className="text-lg font-mono font-bold text-trace"
              style={TRACE_GLOW_SOFT}
            >
              {symbol}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-muted mt-3">
        30 spoken tokens → 30 symbols. No ambiguity. No ML needed.
      </p>
    </div>
  )
}

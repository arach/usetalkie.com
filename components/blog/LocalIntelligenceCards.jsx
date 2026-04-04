import { localIntelligenceCards, localIntelligenceCardsById } from './local-intelligence-cards-data'

function resolveCards({ ids, tier }) {
  let cards = localIntelligenceCards

  if (Array.isArray(ids) && ids.length > 0) {
    cards = ids
      .map(id => localIntelligenceCardsById[id])
      .filter(Boolean)
  }

  if (tier) {
    cards = cards.filter(card => card.tier === tier)
  }

  return cards
}

function JsonBlock({ value }) {
  return (
    <pre>
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  )
}

export function LocalIntelligenceCard({ id, card }) {
  const resolved = card ?? (id ? localIntelligenceCardsById[id] : null)

  if (!resolved) {
    return (
      <article>
        <p>
          <strong>Missing card:</strong> <code>{id}</code>
        </p>
      </article>
    )
  }

  return (
    <article data-local-intelligence-card-id={resolved.id}>
      <h3>{resolved.title}</h3>
      <p>
        <strong>ID:</strong> <code>{resolved.id}</code>
      </p>
      <p>
        <strong>Tier:</strong> <code>{resolved.tier}</code>
      </p>
      <p>
        <strong>Objective:</strong> {resolved.objective}
      </p>

      <h4>Input Example</h4>
      <JsonBlock value={resolved.inputExample} />

      <h4>Prompt Task</h4>
      <pre>
        <code>{resolved.prompt.task}</code>
      </pre>

      <h4>System Prompt</h4>
      <pre>
        <code>{resolved.prompt.system}</code>
      </pre>

      <h4>User Prompt</h4>
      <pre>
        <code>{resolved.prompt.user}</code>
      </pre>

      <h4>Expected Output</h4>
      <JsonBlock value={resolved.expectedOutput} />

      <h4>Test Case</h4>
      <JsonBlock value={resolved.testCase} />

      <hr />
    </article>
  )
}

export function LocalIntelligenceCards({ ids, tier }) {
  const cards = resolveCards({ ids, tier })

  return (
    <section data-local-intelligence-cards>
      {cards.map(card => (
        <LocalIntelligenceCard key={card.id} card={card} />
      ))}
    </section>
  )
}

export function LocalIntelligencePromotedCards({ ids = [] }) {
  const cards = resolveCards({ ids })

  return (
    <section data-local-intelligence-promoted>
      <h3>Promoted Card IDs</h3>
      <ul>
        {cards.map(card => (
          <li key={card.id}>
            <code>{card.id}</code> - {card.title}
          </li>
        ))}
      </ul>

      <LocalIntelligenceCards ids={cards.map(card => card.id)} />
    </section>
  )
}

import { getEvidenceComparison } from '../../lib/comparisons'

const formatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function displayDate(date) {
  return formatter.format(new Date(`${date}T00:00:00Z`))
}

export default function EvidenceComparison({ competitor: competitorSlug }) {
  const { competitor, page, rows, sources } = getEvidenceComparison(competitorSlug)

  return (
    <section id="comparison-matrix" className="evidence-comparison not-prose" aria-label={`Talkie and ${competitor.name} comparison`}>
      <div className="evidence-comparison__picks">
        <article>
          <span>Pick Talkie when</span>
          <h3>{page.picks.talkie.title}</h3>
          <ul>
            {page.picks.talkie.points.map(point => <li key={point}>{point}</li>)}
          </ul>
        </article>
        <article>
          <span>Pick {competitor.name} when</span>
          <h3>{page.picks.competitor.title}</h3>
          <ul>
            {page.picks.competitor.points.map(point => <li key={point}>{point}</li>)}
          </ul>
        </article>
      </div>

      <div className="comparison-table" aria-label="Scrollable feature comparison" tabIndex={0}>
        <table>
          <caption className="sr-only">Talkie and {competitor.name} by decision factor</caption>
          <thead>
            <tr>
              <th scope="col">Decision factor</th>
              <th scope="col">Talkie</th>
              <th scope="col">{competitor.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>
                  <span className="evidence-comparison__label">{row.label}</span>
                </td>
                <td data-column="Talkie">
                  {row.talkieDisplay}
                </td>
                <td data-column={competitor.name}>{row.competitorDisplay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="evidence-comparison__sources">
        <p>Verified {displayDate(competitor.checkedAt)} · Talkie app + CLI · official {competitor.name} sources</p>
        <ul aria-label={`${competitor.name} sources`}>
          {sources.map(source => (
            <li key={source.url}>
              <a href={source.url} rel="noreferrer">{source.label}</a>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  )
}

import { Children, cloneElement, isValidElement } from 'react'

function textContent(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (!isValidElement(node)) return ''
  return Children.toArray(node.props.children).map(textContent).join('')
}

export default function ComparisonTable({ children, ...props }) {
  const sections = Children.toArray(children)
  const head = sections.find(section => isValidElement(section) && section.type === 'thead')
  const headRow = head && Children.toArray(head.props.children)[0]
  const columns = isValidElement(headRow)
    ? Children.toArray(headRow.props.children).map(cell => textContent(cell))
    : []

  const enhancedSections = sections.map(section => {
    if (!isValidElement(section) || section.type !== 'tbody') return section

    const rows = Children.map(section.props.children, row => {
      if (!isValidElement(row)) return row
      const cells = Children.map(row.props.children, (cell, index) => {
        if (!isValidElement(cell)) return cell
        return cloneElement(cell, { 'data-column': columns[index] || '' })
      })
      return cloneElement(row, {}, cells)
    })

    return cloneElement(section, {}, rows)
  })

  return (
    <div
      className="comparison-table not-prose"
      aria-label="Scrollable feature comparison"
      tabIndex={0}
    >
      <table {...props}>
        <caption className="sr-only">Feature comparison</caption>
        {enhancedSections}
      </table>
    </div>
  )
}

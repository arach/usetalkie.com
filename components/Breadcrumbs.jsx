import JsonLd from './JsonLd'

const ORIGIN = 'https://usetalkie.com'

export default function Breadcrumbs({ items }) {
  const trail = [{ name: 'Talkie', path: '/' }, ...items]
  return <JsonLd data={{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${ORIGIN}${trail.at(-1).path}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem', position: index + 1,
      name: item.name, item: `${ORIGIN}${item.path}`,
    })),
  }} />
}

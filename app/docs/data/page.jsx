import DataPage from '../../../components/docs/DataPage'

export const metadata = {
  title: 'Data Layer — Talkie Docs',
  description: 'Documentation for Talkie\'s data layer. GRDB database structure, core models, file storage locations, and export formats.',
  openGraph: {
    title: 'Data Layer — Talkie Docs',
    description: 'Database structure, models, storage, and export formats.',
    images: [{ url: '/og/docs-data.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-data.png'],
  },
}

export default function Page() {
  return <DataPage />
}

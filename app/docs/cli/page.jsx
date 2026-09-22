import CliPage from '../../../components/docs/CliPage'

export const metadata = {
  title: 'CLI Reference — Talkie Docs',
  description: 'Talkie CLI reference for agents and power users. List memos, export dictations, and pipe structured capture data into scripts and coding agents.',
  alternates: { canonical: 'https://usetalkie.com/docs/cli/' },
  openGraph: {
    title: 'CLI Reference — Talkie Docs',
    description: 'Access your voice memos, dictations, and workflows from the command line. Built for agents and power users.',
    url: 'https://usetalkie.com/docs/cli/',
    siteName: 'Talkie',
    type: 'article',
  },
}

export default function Page() {
  return <CliPage />
}

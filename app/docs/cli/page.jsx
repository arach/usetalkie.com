import CliPage from '../../../components/docs/CliPage'

export const metadata = {
  title: 'CLI Reference — Talkie Docs',
  description: 'Access your voice memos, dictations, and workflows from the command line. Built for agents and power users.',
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

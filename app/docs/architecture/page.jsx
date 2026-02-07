import ArchitecturePage from '../../../components/docs/ArchitecturePage'

export const metadata = {
  title: 'Architecture — Talkie Docs',
  description: 'Deep dive into Talkie\'s multi-process architecture. Understand how Talkie, TalkieLive, TalkieEngine, and TalkieServer work together.',
  openGraph: {
    title: 'Architecture — Talkie Docs',
    description: 'How Talkie, TalkieLive, TalkieEngine, and TalkieServer work together.',
    images: [{ url: '/og/docs-architecture.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/docs-architecture.png'],
  },
}

export default function Page() {
  return <ArchitecturePage />
}

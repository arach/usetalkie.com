import AboutPage from '../../../components/v2/AboutPage'

export const metadata = {
  title: 'About — Talkie',
  description:
    'Meet the founder behind Talkie, the voice-first productivity app for macOS. Built for engineers who want control: open data, local-first, fully hookable.',
  openGraph: {
    title: 'About — Talkie',
    description:
      'Meet the founder behind Talkie. Built for engineers who want control: open data, local-first, fully hookable.',
    type: 'article',
  },
}

export default function Page() {
  return <AboutPage />
}

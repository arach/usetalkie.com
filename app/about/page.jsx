import AboutPage from '../../components/AboutPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'About - Talkie',
  description: 'Meet the founder behind Talkie, the voice-first productivity app for macOS.',
  alternates: { canonical: 'https://usetalkie.com/about/' },
}

export default function About() {
  return (
    <MainShell>
      <AboutPage />
    </MainShell>
  )
}

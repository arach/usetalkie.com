import LandingPage from '../../components/LandingPage'

export const metadata = {
  title: 'Talkie — Cleaner homepage study',
  description: 'A local comparison using Talkie’s preserved, cleaner homepage direction.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CleanHomePage() {
  return <LandingPage simplifiedHero />
}

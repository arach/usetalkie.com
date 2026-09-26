import BrandPage from '../../components/BrandPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Brand — Talkie',
  description:
    'Download the official Talkie logo as an SVG for light or dark backgrounds. Find the brand colors and simple guidelines for using the wordmark consistently.',
  alternates: { canonical: 'https://usetalkie.com/brand/' },
}

export default function Page() {
  return (
    <MainShell>
      <BrandPage />
    </MainShell>
  )
}

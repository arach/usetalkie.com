import BrandPage from '../../components/BrandPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Brand — Talkie',
  description:
    "Talkie's brand guide for the wordmark, colors, type, voice, and motion.",
  alternates: { canonical: 'https://usetalkie.com/brand/' },
}

export default function Page() {
  return (
    <MainShell>
      <BrandPage />
    </MainShell>
  )
}

import BrandPage from '../../components/BrandPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Brand — Talkie',
  description:
    "Talkie's brand guide covers the wordmark, colors, type, voice, and motion used across Mac, iPhone, Watch, and marketing surfaces on usetalkie.com.",
  alternates: { canonical: 'https://usetalkie.com/brand/' },
}

export default function Page() {
  return (
    <MainShell>
      <BrandPage />
    </MainShell>
  )
}

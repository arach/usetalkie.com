import BrandPage from '../../components/BrandPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Brand — Talkie',
  description:
    "Talkie's brand foundations — wordmark, color, type, voice, motion. The receipts for how this brand carries itself.",
}

export default function Page() {
  return (
    <MainShell>
      <BrandPage />
    </MainShell>
  )
}

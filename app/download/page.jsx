import DownloadAllPage from '../../components/DownloadAllPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Download Talkie',
  description: 'Download the current free Mac build or get the free iPhone and Apple Watch apps. The paid Mac offer is planned.',
  alternates: { canonical: 'https://usetalkie.com/downloads/' },
}

export default function Page() {
  return (
    <MainShell>
      <DownloadAllPage />
    </MainShell>
  )
}

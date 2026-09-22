import DownloadAllPage from '../../components/DownloadAllPage'
import MainShell from '../../components/MainShell'

// Alias of /downloads — canonical elsewhere; do not index this thin duplicate.
export const metadata = {
  title: 'Download Talkie',
  description:
    'Download the free Talkie Mac build and free iPhone and Watch apps. A 7-day trial and $39 one-time Mac license are planned. Local dictation and workflows.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://usetalkie.com/downloads/' },
}

export default function Page() {
  return (
    <MainShell>
      <DownloadAllPage />
    </MainShell>
  )
}

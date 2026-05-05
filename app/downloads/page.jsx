import DownloadAllPage from '../../components/DownloadAllPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Download Talkie',
  description:
    'Get Talkie for Mac and iPhone. Download the app, install via CLI, or scan the QR code for iOS.',
}

export default function Page() {
  return (
    <MainShell>
      <DownloadAllPage />
    </MainShell>
  )
}

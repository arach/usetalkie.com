import DownloadPage from '../../components/DownloadPage'

export const metadata = {
  title: 'Download Talkie — Voice to action',
  description: 'Download Talkie for Mac. Dictate anywhere and turn speech into tasks, summaries, and actions - local-first and private.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <DownloadPage />
}

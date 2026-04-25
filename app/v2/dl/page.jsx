import DownloadPage from '../../../components/v2/DownloadPage'

/**
 * /v2/dl — short link. Same body as /v2/download, but tagged no-index so
 * search engines don't compete with the canonical install URL.
 */
export const metadata = {
  title: 'Download Talkie - Private voice capture for Mac',
  description:
    'Download Talkie for Mac, the action surface for a private voice capture system that starts on iPhone, Watch, or Mac.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <DownloadPage />
}

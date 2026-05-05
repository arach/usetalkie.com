import FeaturesPage from '../../components/FeaturesPage'
import MainShell from '../../components/MainShell'

export const metadata = {
  title: 'Workflows — Talkie',
  description: 'Turn captured speech into drafts, tasks, files, and follow-up actions with private workflows on Mac.',
}

export default function Page() {
  return (
    <MainShell>
      <FeaturesPage />
    </MainShell>
  )
}

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check if user is admin (check private metadata)
  const isAdmin = (user.privateMetadata as any)?.admin === true ||
                  (user.privateMetadata as any)?.admin === 'true'

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800 max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-4">
            You don&apos;t have admin access. Contact the team to get access.
          </p>
          <p className="text-xs text-zinc-500">
            Signed in as: {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>
    )
  }

  // Extract only serializable user data for the client component
  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress || '',
    imageUrl: user.imageUrl,
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar user={userData} />
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  )
}

import { currentUser } from '@clerk/nextjs/server'
import { Settings, User, Shield, Bell } from 'lucide-react'
import { isDevMode, getDevUser } from '@/lib/dev-auth'

export default async function SettingsPage() {
  let userData: { email: string; firstName: string | null; lastName: string | null; id: string }

  if (isDevMode()) {
    const dev = getDevUser()
    userData = { email: dev.email, firstName: dev.firstName, lastName: dev.lastName, id: dev.userId }
  } else {
    const user = await currentUser()
    userData = {
      email: user?.emailAddresses[0]?.emailAddress || '',
      firstName: user?.firstName || null,
      lastName: user?.lastName || null,
      id: user?.id || '',
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <User className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <p className="text-white">{userData.email}</p>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Name</label>
              <p className="text-white">
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">User ID</label>
              <p className="text-xs text-zinc-500 font-mono">{userData.id}</p>
            </div>
          </div>
        </div>

        {/* Admin Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">Admin Status</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-emerald-400">Active Admin</span>
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            You have full access to the marketing dashboard.
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <p className="text-zinc-400">
            Notification settings coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}

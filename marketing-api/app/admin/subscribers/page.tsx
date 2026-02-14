import { Users, ExternalLink } from 'lucide-react'

export default function SubscribersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Subscribers</h1>
        <p className="text-zinc-400">Manage your email list and user data</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
          Subscriber management will be available once we integrate a database.
          Currently, signups are tracked via Formspree and Resend.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://formspree.io/forms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Formspree
          </a>
          <a
            href="https://resend.com/emails"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Resend
          </a>
        </div>
      </div>
    </div>
  )
}

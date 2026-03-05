import Link from 'next/link'
import { Construction, Download } from 'lucide-react'

export default function ComingSoonBanner() {
  return (
    <div className="not-prose mb-10 space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
        <Construction className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            This page is a preview — details may change as development continues.
          </p>
          <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-1">
            Want to be notified when this is ready? Download Talkie and you'll get updates automatically.
          </p>
        </div>
      </div>

      <Link
        href="/download"
        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 dark:hover:bg-emerald-400 hover:scale-105 transition-all shadow-md shadow-emerald-500/15"
      >
        <Download className="w-3.5 h-3.5" />
        Download Talkie
      </Link>
    </div>
  )
}

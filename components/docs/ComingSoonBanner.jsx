import { Construction, Mail } from 'lucide-react'

export default function ComingSoonBanner() {
  return (
    <div className="not-prose mb-10">
      <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
        <Construction className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            This page is a preview — details may change as development continues.
          </p>
          <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-2">
            Have feedback or want early access to this feature?{' '}
            <a
              href="mailto:hello@usetalkie.com"
              className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
            >
              <Mail className="w-3 h-3" />
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

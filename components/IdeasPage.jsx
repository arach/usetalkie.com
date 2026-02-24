import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function IdeasPage({ ideas }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Top navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="h-full px-4 flex items-center justify-between max-w-3xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>TALKIE</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              IDEAS
            </span>
            <ThemeToggle floating={false} />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-14">
        {/* Hero header */}
        <div className="relative border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute inset-0 bg-grid-fade pointer-events-none opacity-30" />
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12">
            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-zinc-900 dark:text-white mb-4 leading-[1.1]">
              Ideas
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl">
              Concepts and thinking on voice, computing, and the tools we build.
            </p>
          </div>
        </div>

        {/* Ideas listing */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {ideas.map((idea) => (
              <Link
                key={idea.slug}
                href={`/ideas/${idea.slug}`}
                className="group block py-8 first:pt-0 last:pb-0 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <time className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-wider">
                        {formatDate(idea.date)}
                      </time>
                      {idea.tags && idea.tags.length > 0 && (
                        <>
                          <span className="text-zinc-200 dark:text-zinc-800">&middot;</span>
                          <div className="flex gap-1.5">
                            {idea.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono uppercase tracking-wider text-emerald-600/70 dark:text-emerald-500/60"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                      {idea.title}
                    </h2>
                    {idea.description && (
                      <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {idea.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 mt-3 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {ideas.length === 0 && (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-12">
              No ideas yet. Check back soon.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/talkie-icon.png" alt="Talkie" className="h-5 w-5 rounded" />
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Talkie</span>
          </div>
          <p className="text-[10px] font-mono uppercase text-zinc-400">&copy; {new Date().getFullYear()} Talkie Systems Inc.</p>
        </div>
      </footer>
    </div>
  )
}

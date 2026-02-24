import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function IdeaLayout({ title, description, date, tags, children }) {
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
            <Link
              href="/ideas"
              className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              IDEAS
            </Link>
            <ThemeToggle floating={false} />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-14">
        {/* Hero header area */}
        <div className="relative border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute inset-0 bg-grid-fade pointer-events-none opacity-30" />
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-zinc-900 dark:text-white mb-5 leading-[1.1]">
              {title}
            </h1>

            {description && (
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}

            {date && (
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-700" />
                <time className="text-xs text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-wider">
                  {formatDate(date)}
                </time>
              </div>
            )}
          </div>
        </div>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-6 py-16">
          <div className="prose prose-zinc dark:prose-invert max-w-none
            prose-headings:scroll-mt-20 prose-headings:font-display
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-16 prose-h2:mb-4 prose-h2:tracking-tight
            prose-h3:text-xl prose-h3:font-medium prose-h3:mt-10 prose-h3:mb-3
            prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-[1.8]
            prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:font-semibold prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200
            prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-zinc-950 dark:prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-sm
            prose-ul:text-zinc-600 dark:prose-ul:text-zinc-400
            prose-li:marker:text-zinc-400 prose-li:leading-relaxed
            prose-ol:text-zinc-600 dark:prose-ol:text-zinc-400
            prose-em:text-zinc-700 dark:prose-em:text-zinc-300
            prose-blockquote:border-emerald-500 prose-blockquote:text-zinc-500 dark:prose-blockquote:text-zinc-400
            prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800
          ">
            {children}
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/ideas" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            All Ideas
          </Link>
          <p className="text-[10px] font-mono uppercase text-zinc-400">&copy; {new Date().getFullYear()} Talkie Systems Inc.</p>
        </div>
      </footer>
    </div>
  )
}

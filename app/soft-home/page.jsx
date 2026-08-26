import Link from 'next/link'
import {
  ArrowRight,
  Camera,
  Check,
  Command,
  LockKeyhole,
  Mic,
  MonitorUp,
  Search,
  Sparkles,
  Type,
} from 'lucide-react'
import { Wordmark } from '../../components/brand/Wordmark'
import styles from './soft-home.module.css'

export const metadata = {
  title: 'Talkie — Catch the thought. Keep the context.',
  description:
    'A softer homepage concept for Talkie, the local-first capture system for thoughts, context, and active work.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Talkie — Catch the thought. Keep the context.',
    description:
      'A softer homepage concept for Talkie, the local-first capture system for thoughts, context, and active work.',
    images: [],
  },
  twitter: {
    title: 'Talkie — Catch the thought. Keep the context.',
    description:
      'A softer homepage concept for Talkie, the local-first capture system for thoughts, context, and active work.',
    images: [],
  },
}

const captureModes = [
  { icon: Mic, label: 'Speak' },
  { icon: Type, label: 'Type' },
  { icon: MonitorUp, label: 'Screen' },
  { icon: Camera, label: 'Camera' },
]

const steps = [
  {
    number: '01',
    title: 'Catch it without stepping away.',
    body: 'Hold a key, tap your phone, type a fragment, or grab the screen in front of you. The thought lands before it changes.',
  },
  {
    number: '02',
    title: 'The moment comes with it.',
    body: 'Talkie keeps the app, window, URL, device, and time beside the capture. No folders or tags required.',
  },
  {
    number: '03',
    title: 'Pick it up when you are ready.',
    body: 'Search the memory, shape a draft, make a task, or hand the thread to an agent after the idea is safely stored.',
  },
]

export default function SoftHomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="Talkie home">
          <Wordmark size={112} state="listening" />
        </Link>
        <nav className={styles.nav} aria-label="Concept navigation">
          <a href="#how">How it works</a>
          <a href="#context">Context</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <Link className={styles.headerCta} href="/downloads/">
          Get Talkie <ArrowRight size={16} aria-hidden />
        </Link>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A personal memory layer for active work</p>
            <h1>
              Catch the thought.
              <span>Keep the context.</span>
            </h1>
            <p className={styles.lede}>
              Talkie gives fleeting thoughts somewhere to land. Speak, type,
              snap, or record—everything stays connected to the moment it came
              from, so you can pick it up later.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/downloads/">
                Download for Mac <ArrowRight size={17} aria-hidden />
              </Link>
              <a className={styles.secondaryCta} href="#how">
                See how it works
              </a>
            </div>
            <div className={styles.reassurance}>
              <span><Check size={15} aria-hidden /> Local-first</span>
              <span><Check size={15} aria-hidden /> No filing required</span>
              <span><Check size={15} aria-hidden /> Your models, your choice</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="A Talkie capture shown with its surrounding context">
            <div className={styles.orb} aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <article className={styles.captureCard}>
              <div className={styles.cardTopline}>
                <span className={styles.liveDot} />
                <span>Captured just now</span>
                <span>0:08</span>
              </div>
              <p className={styles.transcript}>
                “The homepage should feel more like somewhere a thought can
                land, and less like a control panel.”
              </p>
              <div className={styles.contextChips}>
                <span><Command size={13} aria-hidden /> Codex</span>
                <span>Talkie homepage</span>
                <span>10:42 AM</span>
              </div>
            </article>
            <article className={styles.recallCard}>
              <div>
                <Search size={17} aria-hidden />
                <span>Three weeks later</span>
              </div>
              <p>“What did I decide about the homepage?”</p>
              <strong>Found the capture, the page, and the work around it.</strong>
            </article>
          </div>
        </section>

        <section className={styles.modeRail} aria-label="Talkie capture modes">
          <p>Use whatever is easiest in the moment.</p>
          <div>
            {captureModes.map(({ icon: Icon, label }) => (
              <span key={label}><Icon size={17} aria-hidden /> {label}</span>
            ))}
          </div>
        </section>

        <section className={styles.statement}>
          <p className={styles.eyebrow}>Thoughts arrive unfinished</p>
          <h2>You shouldn’t have to organize a thought before you can save it.</h2>
          <p>
            Most tools ask where something belongs before you even know what it
            is. Talkie catches the raw thing first. Structure can wait.
          </p>
        </section>

        <section className={styles.steps} id="how">
          {steps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </section>

        <section className={styles.contextSection} id="context">
          <div className={styles.contextCopy}>
            <p className={styles.eyebrow}>More than the words</p>
            <h2>The thought makes sense because the moment stays attached.</h2>
            <p>
              A fragment like “fix the spacing” is almost useless by itself.
              With the app, window, URL, and time beside it, you know exactly
              where to return.
            </p>
            <Link href="/docs/" className={styles.textLink}>
              See what Talkie remembers <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className={styles.contextExample}>
            <div className={styles.lonelyNote}>
              <span>A note by itself</span>
              <p>Fix the spacing.</p>
              <small>Where? When? Why?</small>
            </div>
            <div className={styles.richNote}>
              <span>With Talkie</span>
              <p>Fix the spacing.</p>
              <ul>
                <li><strong>App</strong> Figma</li>
                <li><strong>Window</strong> Checkout header</li>
                <li><strong>Moment</strong> Tuesday, 3:41 PM</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.actionSection}>
          <div className={styles.actionIcon}><Sparkles size={24} aria-hidden /></div>
          <p className={styles.eyebrow}>When you are ready</p>
          <h2>Turn the memory into work.</h2>
          <p>
            Clean up the transcript. Shape the draft. Pull out the tasks. Ask an
            agent to continue from the exact thread you left behind.
          </p>
          <div className={styles.actionPills}>
            <span>Draft</span><span>Summarize</span><span>Search</span>
            <span>Make a task</span><span>Run a workflow</span>
          </div>
        </section>

        <section className={styles.privacySection} id="privacy">
          <div className={styles.privacyIcon}><LockKeyhole size={24} aria-hidden /></div>
          <div>
            <p className={styles.eyebrow}>Private by architecture</p>
            <h2>Your context is personal. It stays that way.</h2>
          </div>
          <p>
            Captures live on your devices. Sync uses your iCloud. On-device,
            offline, and bring-your-own-key models are all supported.
          </p>
          <Link href="/security/" className={styles.textLink}>
            Read the security story <ArrowRight size={16} aria-hidden />
          </Link>
        </section>

        <section className={styles.finalCta}>
          <Wordmark size={92} state="listening" />
          <h2>A quiet place for thoughts in motion.</h2>
          <p>Catch it now. Pick it up when you are ready.</p>
          <Link className={styles.primaryCta} href="/downloads/">
            Get Talkie <ArrowRight size={17} aria-hidden />
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© 2026 Talkie</span>
        <span>Mac · iPhone · Watch</span>
        <span>Local-first personal infrastructure</span>
      </footer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Laptop, Smartphone, Watch, Play } from 'lucide-react'
import DemoFilmHero from './DemoFilmHero'
import { TALKIE_PHONE_APP } from '../../shared/config/product-links'
import styles from './HomePage.module.css'

const SCENES = [
  { name: 'Home', file: 'home', description: 'Meetings, voice captures, workflows, and connected agents in one place.' },
  { name: 'Library', file: 'library', description: 'Find a capture and recover the context that came with it.' },
  { name: 'Editor', file: 'editor', description: 'Edit notes with a Markdown preview and revision history.' },
  { name: 'Workflows', file: 'workflows', description: 'Chain capture, models, and actions into routines you can read, edit, and run again.' },
  { name: 'Terminals', file: 'terminals', description: 'Run Claude, Codex, and shell sessions inside Talkie, with your captures one step away.' },
  { name: 'Settings', file: 'settings', description: 'Pick models, keys, and providers. Everything stays on your Mac unless you route it elsewhere.' },
]
const CAPABILITIES = [
  ['Dictate into any Mac app.', 'Use a global shortcut to turn speech into text in the app where work is already open.', '/mac'],
  ['Keep the original capture.', 'Return to recordings and transcripts. Search the library when the context matters again.', '/docs/data'],
  ['Turn speech into a workflow.', 'Use a capture to create summaries, tasks, and files. Send the right material to an agent.', '/workflows'],
]

export default function HomePage() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const scene = SCENES[sceneIndex]
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-lead-title">
        <Image className={styles.landscape} src="/backgrounds/talkie-listening-pavilion-night.webp" alt="" fill priority sizes="100vw" />
        <div className={styles.heroShade} />
        <Image className={styles.dayLandscape} src="/backgrounds/talkie-listening-pavilion.webp" alt="" fill sizes="100vw" />
        <div className={styles.dayTrees} aria-hidden="true"><Image className={styles.treeImage} src="/backgrounds/talkie-listening-pavilion.webp" alt="" fill sizes="100vw" /></div>
        <div className={styles.nightDetails} aria-hidden="true">
          <span className={styles.starsNear} />
          <span className={styles.starsFar} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.devices} aria-label="Available on Mac, iPhone, and Apple Watch">
            <span><Laptop size={18} /> Mac</span><span><Smartphone size={17} /> iPhone</span><span><Watch size={17} /> Watch</span>
          </div>
          <h1 id="home-lead-title">Talk to your apps.<br />Work with your agents.</h1>
          <p className={styles.heroDescription}>Dictate into any Mac app. Capture context on iPhone or Watch.<br className={styles.desktopBreak} /> Send it to an agent and follow the result.</p>
          <div className={styles.actions}>
            <Link href="/downloads" className={styles.primary}>Download for Mac <ArrowDown size={17} /></Link>
            <Link href="#product-demo" className={styles.secondary}><Play size={15} /> Watch Talkie work</Link>
          </div>
          <p className={styles.requirements}>macOS 26+ · Apple silicon · Current free build</p>
          <div className={styles.sceneBar}>
            <div className={styles.sceneTabs} role="group" aria-label="Talkie for Mac screens">
              {SCENES.map((item, index) => <button key={item.file} type="button" aria-pressed={index === sceneIndex} onClick={(event) => { setSceneIndex(index); event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' }) }}>{item.name}</button>)}
            </div>
            <p className={styles.sceneNote} aria-live="polite">{scene.description}</p>
          </div>
          <figure className={styles.product}>
            <Image src={`/screenshots/mac/current/talkie-${scene.file}-light.webp`} width={1513} height={1235} alt={`Talkie ${scene.name}. ${scene.description}`} priority={sceneIndex === 0} sizes="(max-width: 768px) 94vw, 1120px" />
          </figure>
        </div>
      </section>

      <div className={styles.productCaption}><span className={styles.productLabel}>Talkie for Mac · macOS 26+</span><Link href="/tour">Explore Talkie <ArrowRight size={15} /></Link></div>

      <section className={styles.intro} id="features">
        <div className={styles.sectionHeading}><h2>Start with your voice.<br />Keep the context.</h2><p>A quick thought, a meeting, or a prompt for an agent. Talkie keeps the capture available for whatever comes next.</p></div>
        <div className={styles.capabilities}>{CAPABILITIES.map(([title, body, href]) => <article key={title}><h3>{title}</h3><p>{body}</p><Link href={href}>Learn more <ArrowRight size={16} /></Link></article>)}</div>
      </section>

      <section className={styles.demoIntro}><h2>One shortcut. The app already open.</h2><p>See real dictation in Cursor, ChatGPT, and Ghostty.</p></section>
      <DemoFilmHero />

      <section className={styles.mobileSection}>
        <div className={styles.mobileInner}>
          <div className={styles.mobileCopy}>
            <p className={styles.mobileEyebrow}>iPhone + Apple Watch</p>
            <h2>Capture it.<br />Even away from<br />{' '}the keyboard.</h2>
            <p>Record a memo on iPhone or Apple Watch. Keep the transcript, add context, and return to it on Mac.</p>
            <div className={styles.mobileActions}>
              <a href={TALKIE_PHONE_APP.appStoreUrl} className={styles.primary}>Get Talkie for iPhone <ArrowRight size={16} /></a>
              <Link href="/mobile" className={styles.mobileMore}>Explore mobile capture <ArrowRight size={15} /></Link>
            </div>
          </div>
          <div className={styles.mobileArtwork}>
            <Image src="/screenshots/talkie-phone-home-2026-08.webp" width={900} height={1840} sizes="(max-width: 767px) 80vw, 400px" alt="Talkie for iPhone showing recent captures on the home screen" />
          </div>
        </div>
      </section>

      <section className={styles.ownership}>
        <h2>Your words.<br />Your library.</h2>
        <div><article><h3>Stored on your devices.</h3><p>Recordings and transcripts stay in a local library. Sync between devices through your iCloud account.</p></article><article><h3>Choose how to process them.</h3><p>Use on-device models or connect a provider with your own API key. The choice stays with you.</p></article><Link href="/security">Read about privacy <ArrowRight size={17} /></Link></div>
      </section>

      <section className={styles.close} id="downloads">
        <Image className={styles.closeScene} src="/backgrounds/talkie-listening-pavilion-night.webp" alt="" fill sizes="100vw" />
        <Image className={styles.closeDayScene} src="/backgrounds/talkie-listening-pavilion.webp" alt="" fill sizes="100vw" />
        <div className={styles.closeShade} />
        <h2>Say it. Let Talkie type it.</h2>
        <p>Download Talkie for Mac and start dictating. The current build is free.</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/downloads">Download Talkie <ArrowDown size={17} /></Link>
          <Link className={styles.secondary} href="/docs">Read the docs <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}

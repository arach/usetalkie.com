'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Laptop, Smartphone, Watch, Play } from 'lucide-react'
import DemoFilmHero from './DemoFilmHero'
import HomeHeaderTone from './HomeHeaderTone'
import { TALKIE_PHONE_APP } from '../../shared/config/product-links'
import styles from './HomePage.module.css'

// Every Mac capture in public/screenshots/mac/current shares this frame.
const SHOT_WIDTH = 1513
const SHOT_HEIGHT = 1235

const SCENES = [
  { name: 'Home', file: 'home', description: 'Meetings, voice captures, workflows, and connected agents in one place.' },
  { name: 'Library', file: 'library', description: 'Find a capture and recover the context that came with it.' },
  { name: 'Editor', file: 'editor', description: 'Edit notes with a Markdown preview and revision history.' },
  { name: 'Workflows', file: 'workflows', description: 'Chain capture, models, and actions into routines you can read, edit, and run again.' },
  { name: 'Terminals', file: 'terminals', description: 'Run Claude, Codex, and shell sessions inside Talkie, with your captures one step away.' },
  { name: 'Settings', file: 'settings', description: 'Pick models, keys, and providers. Everything stays on your Mac unless you route it elsewhere.' },
]

// Each capability carries a real crop of a Mac capture as its evidence.
// `crop` is in source pixels; the CSS turns it into a responsive window.
const CAPABILITIES = [
  {
    title: 'Dictate into any Mac app.',
    body: 'Use a global shortcut to turn speech into text in the app where work is already open.',
    href: '/mac',
    link: 'Talkie for Mac',
    shot: 'home',
    crop: { x: 72, y: 636, w: 500 },
    alt: 'Three dictations in the Talkie Voice panel, each with its waveform and transcript.',
  },
  {
    title: 'Keep the original capture.',
    body: 'Return to recordings and transcripts. Search the library when the context matters again.',
    href: '/docs/data',
    link: 'How the library works',
    shot: 'library',
    crop: { x: 560, y: 346, w: 500 },
    alt: 'Library highlights in Talkie: the longest dictation and the freshest capture for the day.',
  },
  {
    title: 'Turn speech into a workflow.',
    body: 'Use a capture to create summaries, tasks, and files. Send the right material to an agent.',
    href: '/workflows',
    link: 'See workflows',
    shot: 'home',
    crop: { x: 72, y: 906, w: 500 },
    alt: 'The Hey Talkie workflow with its trigger, audio, model, and clean-up steps.',
  },
]

export default function HomePage() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const scene = SCENES[sceneIndex]
  return (
    <div className={styles.page}>
      <HomeHeaderTone />

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
          <h1 id="home-lead-title" className={styles.rise}>Talk to your apps.<br />Work with your <em>agents</em>.</h1>
          <p className={`${styles.heroDescription} ${styles.rise}`}>Dictate into any Mac app. Capture context on iPhone or Watch.<br className={styles.desktopBreak} /> Send it to an agent and follow the result.</p>
          <div className={`${styles.actions} ${styles.rise}`}>
            <Link href="/downloads" className={styles.primary}>Download for Mac <ArrowDown size={17} /></Link>
            <Link href="#product-demo" className={styles.secondary}><Play size={15} /> Watch Talkie work</Link>
          </div>
          <p className={`${styles.meta} ${styles.rise}`}>
            <span className={styles.devices}>
              <span><Laptop size={15} /> Mac</span>
              <span><Smartphone size={14} /> iPhone</span>
              <span><Watch size={14} /> Apple Watch</span>
            </span>
            <span className={styles.requirements}>macOS 26+ · Apple silicon · Current free build</span>
          </p>

          <div className={`${styles.sceneBar} ${styles.rise}`}>
            <div className={styles.sceneTabs} role="group" aria-label="Talkie for Mac screens">
              {SCENES.map((item, index) => (
                <button
                  key={item.file}
                  type="button"
                  aria-pressed={index === sceneIndex}
                  onClick={(event) => {
                    setSceneIndex(index)
                    event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' })
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <p className={styles.sceneNote} aria-live="polite">{scene.description}</p>
          </div>

          <figure className={`${styles.product} ${styles.rise}`}>
            <div key={scene.file} className={styles.productFrame}>
              <Image
                src={`/screenshots/mac/current/talkie-${scene.file}-light.webp`}
                width={SHOT_WIDTH}
                height={SHOT_HEIGHT}
                alt={`Talkie ${scene.name}. ${scene.description}`}
                priority={sceneIndex === 0}
                sizes="(max-width: 768px) 180vw, 1120px"
              />
            </div>
          </figure>
        </div>
      </section>

      <div className={styles.productCaption}>
        <span className={styles.productLabel}>Talkie for Mac · macOS 26+</span>
        <Link href="/tour">Explore Talkie <ArrowRight size={15} /></Link>
      </div>

      <section className={styles.intro} id="features">
        <div className={styles.sectionHeading}>
          <h2>Start with your voice.<br />Keep the <em>context</em>.</h2>
          <p>A quick thought, a meeting, or a prompt for an agent. Talkie keeps the capture available for whatever comes next.</p>
        </div>
        <div className={styles.capabilities}>
          {CAPABILITIES.map(({ title, body, href, link, shot, crop, alt }) => (
            <article key={title}>
              <div className={styles.evidence} style={{ '--cx': crop.x, '--cy': crop.y, '--cw': crop.w }}>
                <Image src={`/screenshots/mac/current/talkie-${shot}-light.webp`} width={SHOT_WIDTH} height={SHOT_HEIGHT} alt={alt} sizes="(max-width: 767px) 100vw, 380px" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link href={href}>{link} <ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.demoIntro}>
        <h2>One shortcut.<br />The app <em>already</em> open.</h2>
        <p>See real dictation in Cursor, ChatGPT, and Ghostty.</p>
      </section>
      <DemoFilmHero />

      <section className={styles.mobileSection}>
        <div className={styles.mobileInner}>
          <div className={styles.mobileCopy}>
            <h2>Capture it.<br />Even away from<br />{' '}the <em>keyboard</em>.</h2>
            <p>Record a memo on iPhone or Apple Watch. Keep the transcript, add context, and return to it on Mac.</p>
            <div className={styles.mobileActions}>
              <a href={TALKIE_PHONE_APP.appStoreUrl} className={styles.primary}>Get Talkie for iPhone <ArrowRight size={16} /></a>
              <Link href="/mobile" className={styles.mobileMore}>Explore mobile capture <ArrowRight size={15} /></Link>
            </div>
            <p className={styles.mobileDevices}>
              <span><Smartphone size={14} /> iPhone</span>
              <span><Watch size={14} /> Apple Watch</span>
            </p>
          </div>
          <div className={styles.mobileArtwork}>
            <div className={styles.phone}>
              <div className={styles.phoneScreen}>
                <Image src="/screenshots/mobile/iphone-home-current.webp" width={1320} height={2868} sizes="(max-width: 767px) 72vw, 330px" alt="Talkie for iPhone: today's activity, the record and compose actions, and recent captures" />
              </div>
              <span className={styles.phoneIsland} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ownership}>
        <h2>Your words.<br />Your <em>library</em>.</h2>
        <div>
          <article><h3>Stored on your devices.</h3><p>Recordings and transcripts stay in a local library. Sync between devices through your iCloud account.</p></article>
          <article><h3>Choose how to process them.</h3><p>Use on-device models or connect a provider with your own API key. The choice stays with you.</p></article>
          <Link href="/security">Read about privacy <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className={styles.close} id="downloads">
        <Image className={styles.closeScene} src="/backgrounds/talkie-listening-pavilion-night.webp" alt="" fill sizes="100vw" />
        <Image className={styles.closeDayScene} src="/backgrounds/talkie-listening-pavilion.webp" alt="" fill sizes="100vw" />
        <div className={styles.closeShade} />
        <h2>Say it. Let Talkie <em>type</em> it.</h2>
        <p>Download Talkie for Mac and start dictating. The current build is free.</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/downloads">Download Talkie <ArrowDown size={17} /></Link>
          <Link className={styles.secondary} href="/docs">Read the docs <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}

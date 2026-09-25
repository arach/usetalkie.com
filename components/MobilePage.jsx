import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import TrackedAnchor from './TrackedAnchor'
import { TALKIE_PHONE_APP } from '../shared/config/product-links'
import styles from './MobilePage.module.css'

function DownloadLink({ source, children = 'Get Talkie for iPhone' }) {
  return <TrackedAnchor href={TALKIE_PHONE_APP.appStoreUrl} event={{ type: 'appStore', source }} target="_blank" rel="noopener noreferrer" className={styles.download}><Download size={17} />{children}<ArrowUpRight size={16} /></TrackedAnchor>
}

function Phone({ screenshot, alt, priority = false }) {
  return <div className={styles.phone}><Image src={`/screenshots/mobile/${screenshot}.webp`} width={1320} height={2868} alt={alt} priority={priority} sizes="(max-width: 600px) 80vw, 390px" /><span className={styles.island} aria-hidden="true" /></div>
}

export default function MobilePage() {
  return <>
    <nav className={styles.surfaceNav} aria-label="Talkie apps"><Link href="/mac/">Mac</Link><Link href="/mobile/" aria-current="page">iPhone &amp; Apple Watch</Link></nav>
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="mobile-title">
        <div className={styles.heroCopy}>
          <h1 id="mobile-title">A thought.<br />A tap.<br /><em>Captured.</em></h1>
          <p>Talkie for iPhone and Apple Watch.<br />Capture a thought as it happens. Keep it ready for your next note, workflow, or agent.</p>
          <div className={styles.actions}><DownloadLink source="mobile_hero" /><a className={styles.scanLink} href="#get-talkie">Scan with iPhone <ArrowRight size={16} /></a></div>
          <div className={styles.availability}><span className={styles.dot} />{TALKIE_PHONE_APP.displayPrice} for iPhone and Apple Watch</div>
        </div>
        <div className={styles.heroStage}>
          <div className={styles.stageCaption}><span>Talkie on iPhone</span><span>Home</span></div>
          <Phone screenshot="iphone-home-current" alt="Talkie home screen with the activity board, capture actions, and recent notes" priority />
        </div>
      </section>

      <section className={styles.capture} aria-labelledby="capture-title">
        <div className={styles.sectionIntro}><h2 id="capture-title">Give a thought<br />somewhere to <em>go.</em></h2><p>A meeting ends. An idea comes up on a walk. A detail needs a follow-up. Record it now. Return to the words when you need them.</p></div>
        <div className={styles.captureGrid}>
          <div className={styles.recordStage}><Phone screenshot="iphone-recording-current" alt="Talkie recording screen on iPhone" /><div className={styles.imageCaption}>Start with your voice.</div></div>
          <div className={styles.captureDetails}>
            <article><h3>Speak while it is fresh.</h3><p>Open Talkie and start a recording. Capture the thought without stopping to type.</p></article>
            <article><h3>Keep the words with the recording.</h3><p>Return to a capture, read its transcript, and find the detail you need.</p></article>
            <article><h3>Make capture a shortcut.</h3><p>Start from a widget, Siri, Shortcuts, or Control Center. Keep Talkie within reach.</p></article>
            <Link href="/ideas/iphone-apple-watch-voice-capture/">Explore mobile capture <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className={styles.watchSection} aria-labelledby="watch-title">
        <div className={styles.watchInner}>
          <div className={styles.watchArt}><div className={styles.watchStrap} /><div className={styles.watchCase}><Image src="/screenshots/mobile/apple-watch-home-current.webp" alt="Talkie on Apple Watch" width={416} height={496} sizes="240px" /></div></div>
          <div><h2 id="watch-title">A little closer.<br />On your <em>wrist.</em></h2><p>Raise your wrist and tap to record. Talkie on Apple Watch captures the thought without taking out your phone.</p><p className={styles.watchNote}>Captures sync through your iPhone.</p><DownloadLink source="mobile_watch">Get the free app</DownloadLink></div>
        </div>
      </section>

      <section className={styles.continueSection} aria-labelledby="continue-title">
        <div className={styles.sectionIntro}><h2 id="continue-title">Back at your desk.<br />Keep <em>going.</em></h2><div><p>Sync captures through iCloud to your Mac library. Search what you said, shape a note, or use the context in a workflow.</p><Link href="/mac/">Explore Talkie for Mac <ArrowRight size={16} /></Link></div></div>
        <div className={styles.macFrame}><Image src="/screenshots/mac/current/talkie-home-light.webp" width={1513} height={1235} alt="Talkie for Mac showing recent meetings, voice captures, content, and workflows" sizes="(max-width: 768px) 150vw, 1100px" /></div>
        <div className={styles.macCaption}><span>One library, across devices.</span><Link href="/ideas/voice-remote-for-agents/">Voice context for agents <ArrowRight size={15} /></Link></div>
      </section>

      <section className={styles.install} id="get-talkie" aria-labelledby="install-title">
        <div><h2 id="install-title">The next thought<br />starts <em>here.</em></h2><p>Talkie for iPhone and Apple Watch is free.</p><DownloadLink source="mobile_install" /></div>
        <a href={TALKIE_PHONE_APP.appStoreUrl} target="_blank" rel="noopener noreferrer" className={styles.qr}><Image src="/qr-app-store.svg" width={152} height={152} alt="Scan to get Talkie on the App Store" /><span>Scan with iPhone <ArrowUpRight size={14} /></span></a>
      </section>
    </div>
  </>
}

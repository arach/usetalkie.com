import './globals.css'
import Script from 'next/script'
import { Space_Grotesk, JetBrains_Mono, Fraunces, Inter, Cormorant_Garamond } from 'next/font/google'
import localFont from 'next/font/local'
import DevConsole from '../components/DevConsole'
import FeedbackWidget from '../shared/components/FeedbackWidget'
import StudioPanel from '../components/StudioPanel'
import JsonLd from '../components/JsonLd'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jetmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })
// Display faces are theme-scoped. Fraunces is the Warm/Linen instrument
// face; Cormorant Garamond is the Modern editorial face (high-contrast
// Garamond revival — dramatic italic, magazine-display energy). Both
// load behind theme-private vars; globals.css resolves the public
// --font-display token per active theme.
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display-warm', display: 'swap' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-modern',
  display: 'swap',
})
// Inter is the body sans for the Modern theme (donor look). Loaded under
// --font-sans-classic; theme-scoped CSS rules in globals.css remap
// --font-sans to point at it when html[data-theme="modern"] is active.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans-classic', display: 'swap' })

// Talkie Medium — the custom wordmark face (JBM-derived, dotless `i`,
// forward-leaning `t` crossbar). Use ONLY for rendering the "talkie"
// wordmark itself; body/headlines stay in Cormorant/Inter/Grotesk.
// File is CFF-flavored OpenType despite the .ttf extension — load via
// next/font/local rather than @font-face in globals.css (Tailwind would
// strip a raw @font-face block).
const talkie = localFont({
  src: '../public/fonts/Talkie-Medium.ttf',
  variable: '--font-talkie',
  weight: '500',
  display: 'swap',
})

// Talkie type system — three-face owned stack (Display / Sans / Mono),
// forked from OFL donors (Newsreader / Inter / JetBrains Mono) via Hero.
// Under data-theme="modern" (default), globals.css resolves the public
// --font-display / --font-sans / --font-mono tokens to these. Warm and
// Linen themes keep their existing Fraunces / Grotesk / JBM stack.
const talkieDisplay = localFont({
  src: '../public/fonts/Talkie-Display.ttf',
  variable: '--font-talkie-display',
  display: 'swap',
})
const talkieSans = localFont({
  src: '../public/fonts/Talkie-Sans.ttf',
  variable: '--font-talkie-sans',
  display: 'swap',
})
const talkieMono = localFont({
  src: '../public/fonts/Talkie-Mono.ttf',
  variable: '--font-talkie-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Talkie - Talk to your Mac',
  description:
    'Talk to your Mac to capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
  applicationName: 'Talkie',
  metadataBase: new URL('https://usetalkie.com'),
  openGraph: {
    title: 'Talkie - Talk to your Mac',
    description:
      'Talk to your Mac to capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
    url: 'https://usetalkie.com',
    siteName: 'Talkie',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkie - Talk to your Mac',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icon-1024.png', sizes: '1024x1024' }
    ],
    shortcut: ['/favicon.svg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talkie - Talk to your Mac',
    description:
      'Talk to your Mac to capture a thought, shape a draft, search what you said, or kick off a workflow. A mic is all you need.',
    images: ['/og-image.png'],
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

const SITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://usetalkie.com/#organization',
      name: 'Talkie',
      url: 'https://usetalkie.com/',
      logo: 'https://usetalkie.com/icon-512.png',
      sameAs: [
        'https://github.com/arach/usetalkie.com',
        'https://x.com/usetalkieapp',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://usetalkie.com/#website',
      name: 'Talkie',
      url: 'https://usetalkie.com/',
      description:
        'Talkie turns voice capture on Mac, iPhone, and Apple Watch into dictation, memos, search, files, workflows, and agent-readable local context.',
      publisher: { '@id': 'https://usetalkie.com/#organization' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://usetalkie.com/#app',
      name: 'Talkie',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'macOS, iOS, watchOS',
      url: 'https://usetalkie.com/',
      downloadUrl: 'https://usetalkie.com/downloads/',
      // "Free" is a strong rich-result hook — price 0 lets Google show it.
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Voice capture for Mac, iPhone, and Apple Watch with local-first storage, dictation, searchable memos, workflow automation, and CLI access for agents.',
      featureList: [
        'Mac hotkey dictation',
        'Voice memos with transcripts and summaries',
        'Local workflow automation',
        'Save-to-file and shell steps',
        'Structured CLI output for agents',
        'Optional external LLM and webhook integrations',
      ],
      publisher: { '@id': 'https://usetalkie.com/#organization' },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="modern" className={`${grotesk.variable} ${jetmono.variable} ${fraunces.variable} ${cormorant.variable} ${inter.variable} ${talkie.variable} ${talkieDisplay.variable} ${talkieSans.variable} ${talkieMono.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd data={SITE_SCHEMA} />
        {/*
         * Theme resolver — must run synchronously in <head> before first paint
         * to avoid the Warm-then-Modern flash on initial load. We use a raw
         * <script dangerouslySetInnerHTML> rather than next/script because
         * `strategy="beforeInteractive"` does not guarantee synchronous
         * pre-paint execution in static-export App Router builds; raw inline
         * scripts are emitted exactly where they sit in the head and execute
         * before the body parses.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              var stored = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var useDark = stored ? stored === 'dark' : prefersDark;
              var root = document.documentElement;
              if (useDark) root.classList.add('dark'); else root.classList.remove('dark');
              var rotor = localStorage.getItem('chassis-rotor');
              if (rotor === 'on') root.setAttribute('data-chassis-rotor', 'on');

              /* Design-theme resolver chain — applies before first paint.
                 Precedence (highest wins): URL ?theme=... > localStorage
                 'design-theme' > 'modern' (public default). URL param
                 sticks to localStorage so a campaign link visit persists.
                 Returning visitors with explicit warm/linen preference
                 keep theirs; only no-localStorage visitors get the new
                 modern default. */
              var url = new URLSearchParams(location.search);
              var urlTheme = url.get('theme');
              var validThemes = ['warm', 'linen', 'modern'];
              var theme = 'modern';
              if (urlTheme && validThemes.indexOf(urlTheme) !== -1) {
                theme = urlTheme;
                localStorage.setItem('design-theme', theme);
              } else {
                var savedTheme = localStorage.getItem('design-theme');
                if (savedTheme && validThemes.indexOf(savedTheme) !== -1) theme = savedTheme;
              }
              if (theme === 'modern' || theme === 'linen') {
                root.setAttribute('data-theme', theme);
              } else {
                root.removeAttribute('data-theme');
              }

              /* Tone resolver — saved value wins. With no saved value,
                 no attribute means the Original chassis treatment. */
              var osci = localStorage.getItem('osci-style');
              if (osci) {
                root.setAttribute('data-osci-style', osci);
              } else {
                root.removeAttribute('data-osci-style');
              }
            } catch (e) {}
          `,
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EP7F8TC801"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-EP7F8TC801');
          `}
        </Script>
      </head>
      <body className={`${grotesk.className} min-h-screen bg-white text-slate-800 antialiased`}>
        {children}
        <StudioPanel />
        <FeedbackWidget />
        {process.env.NODE_ENV === 'development' && <DevConsole />}
      </body>
    </html>
  )
}

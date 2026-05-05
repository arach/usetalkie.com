import './globals.css'
import Script from 'next/script'
import { Space_Grotesk, JetBrains_Mono, Fraunces, Inter, Cormorant_Garamond } from 'next/font/google'
import DevConsole from '../components/DevConsole'
import FeedbackWidget from '../shared/components/FeedbackWidget'
import StudioPanel from '../components/StudioPanel'

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetmono.variable} ${fraunces.variable} ${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
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
              if (theme === 'modern' || theme === 'linen') root.setAttribute('data-theme', theme);

              /* Tone resolver — saved value wins. If none saved AND theme
                 is Modern, default to "slate" (the Modern-paired tone).
                 On Warm/Linen with no saved tone, no attribute = phosphor
                 (the original chassis identity). */
              var osci = localStorage.getItem('osci-style');
              if (osci) {
                root.setAttribute('data-osci-style', osci);
              } else if (theme === 'modern') {
                root.setAttribute('data-osci-style', 'slate');
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
        <DevConsole />
      </body>
    </html>
  )
}

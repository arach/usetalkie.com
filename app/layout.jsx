import './globals.css'
import Script from 'next/script'
import { Space_Grotesk, JetBrains_Mono, Fraunces, Inter } from 'next/font/google'
import DevConsole from '../components/DevConsole'
import FeedbackWidget from '../shared/components/FeedbackWidget'
import ThemePicker from '../components/ThemePicker'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jetmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
// Inter is the body sans for the Classic theme (donor look). Loaded under
// --font-sans-classic; theme-scoped CSS rules in globals.css remap
// --font-sans to point at it when html[data-theme="classic"] is active.
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
    <html lang="en" className={`${grotesk.variable} ${jetmono.variable} ${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply saved/system theme before paint to prevent FOUC */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const stored = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const useDark = stored ? stored === 'dark' : prefersDark;
              const root = document.documentElement;
              if (useDark) root.classList.add('dark'); else root.classList.remove('dark');
              const osci = localStorage.getItem('osci-style');
              if (osci) root.setAttribute('data-osci-style', osci);
              const rotor = localStorage.getItem('chassis-rotor');
              if (rotor === 'on') root.setAttribute('data-chassis-rotor', 'on');

              /* Design-theme resolver chain — applies before first paint.
                 Precedence (highest wins): URL ?theme=... > localStorage
                 'design-theme' > 'modern' (default). URL param sticks to
                 localStorage so a campaign link visit persists. */
              const url = new URLSearchParams(location.search);
              const urlTheme = url.get('theme');
              const validThemes = ['modern', 'classic'];
              let theme = null;
              if (urlTheme && validThemes.includes(urlTheme)) {
                theme = urlTheme;
                localStorage.setItem('design-theme', theme);
              } else {
                const savedTheme = localStorage.getItem('design-theme');
                if (savedTheme && validThemes.includes(savedTheme)) theme = savedTheme;
              }
              if (theme === 'classic') root.setAttribute('data-theme', 'classic');
            } catch (e) {}
          `}
        </Script>
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
        <ThemePicker />
        <FeedbackWidget />
        <DevConsole />
      </body>
    </html>
  )
}

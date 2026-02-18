import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
// import FeedbackWidget from '@shared/components/FeedbackWidget'
import './globals.css'

export const metadata: Metadata = {
  title: 'Talkie Admin',
  description: 'Admin dashboard for Talkie',
  icons: {
    icon: 'https://usetalkie.com/talkie-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#10b981',
          colorBackground: '#0a0a0a',
          colorInputBackground: '#141414',
          colorInputText: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-600',
          card: 'bg-zinc-900 border border-zinc-800',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
          {children}
          {/* <FeedbackWidget /> */}
        </body>
      </html>
    </ClerkProvider>
  )
}

'use client'

import { ActivityConsoleProvider } from './ActivityConsole'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return <ActivityConsoleProvider>{children}</ActivityConsoleProvider>
}

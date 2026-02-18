'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  Mail,
  Settings,
  ExternalLink,
  Terminal,
  Bug,
} from 'lucide-react'

interface SidebarProps {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
    imageUrl: string
  }
  isDevMode?: boolean
}

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/assets', label: 'Assets', icon: ImageIcon },
      { href: '/emails', label: 'Emails', icon: Mail },
      { href: '/subscribers', label: 'Subscribers', icon: Users },
      { href: '/reports', label: 'Reports', icon: Bug },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ user, isDevMode = false }: SidebarProps) {
  const pathname = usePathname()
  const email = user.email
  const name = user.firstName || email.split('@')[0]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800/60 flex flex-col">
      {/* Header */}
      <div className="px-5 py-5 border-b border-zinc-800/60">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/talkie-icon.png"
            alt="Talkie"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-[15px]">Talkie</span>
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider bg-zinc-800/80 px-1.5 py-0.5 rounded">Admin</span>
          </div>
        </Link>
      </div>

      {/* Dev mode banner */}
      {isDevMode && (
        <div className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <Terminal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] font-medium text-amber-400">Dev Mode — Auth Bypassed</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="px-3 mb-1.5 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* External link */}
      <div className="px-3 pb-2">
        <a
          href="https://usetalkie.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Website
        </a>
      </div>

      {/* User section */}
      <div className="px-3 pb-4 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-3 px-2 py-2">
          {isDevMode ? (
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-amber-400" />
            </div>
          ) : (
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-zinc-200 truncate">{name}</p>
            <p className="text-[11px] text-zinc-500 truncate">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

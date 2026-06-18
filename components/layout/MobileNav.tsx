'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Target, Calendar, Settings } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Log', href: '/log', icon: BookOpen },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'History', href: '/history', icon: Calendar },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 h-16 flex items-center justify-around z-40">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
              isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-0.5">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

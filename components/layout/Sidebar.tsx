import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DOMAINS } from '@/lib/domains'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, BookOpen, Target, Calendar } from 'lucide-react'

async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return {
    email: user.email || '',
    name: profile?.full_name || user.email?.split('@')[0] || 'User',
    id: user.id,
  }
}

async function handleLogout() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth')
}

export async function Sidebar() {
  const profile = await getUserProfile()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Log Today', href: '/log', icon: BookOpen },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'History', href: '/history', icon: Calendar },
  ]

  return (
    <div className="hidden lg:flex flex-col w-64 bg-slate-900/50 border-r border-slate-800 fixed h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
          NeuralLog
        </h1>
        <p className="text-xs text-slate-500 mt-1">AI/ML Learning Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Domain Quick Links */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">Domains</p>
          <div className="space-y-1">
            {DOMAINS.map((domain) => (
              <Link
                key={domain.name}
                href={`/domain/${encodeURIComponent(domain.name)}`}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all text-sm"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `hsl(var(--color-${domain.color}))` }}
                />
                <span>{domain.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-800 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">{profile.name}</p>
            <p className="text-xs text-slate-500 truncate">{profile.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/settings" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Settings
            </Button>
          </Link>
          <form action={handleLogout}>
            <Button type="submit" variant="ghost" size="sm" className="text-xs">
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

const DOMAINS = [
  'ML Fundamentals',
  'Deep Learning',
  'NLP/LLMs',
  'Computer Vision',
  'MLOps/Deployment',
  'Research Papers',
  'Coding/Projects',
]

export default function AuthPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      setSuccess('Signed in successfully!')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (signUpError) throw signUpError
      setSuccess('Account created! Please check your email to confirm.')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Left Sidebar - Domains */}
      <div className="hidden lg:flex lg:w-1/3 flex-col bg-gradient-to-b from-indigo-950 to-slate-950 p-8 border-r border-indigo-900/30">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LearningTracker</h1>
          <p className="text-indigo-300 text-sm">Master AI/ML at Your Pace</p>
        </div>

        <div className="space-y-3 flex-1">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">
            Learning Domains
          </p>
          {DOMAINS.map((domain, idx) => (
            <div
              key={idx}
              className="px-4 py-3 rounded-lg bg-indigo-900/20 border border-indigo-800/30 hover:border-indigo-700/50 transition-colors cursor-pointer group"
            >
              <p className="text-sm text-indigo-200 group-hover:text-indigo-100 transition-colors">
                {domain}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-indigo-900/30">
          <p className="text-xs text-slate-400">
            Track your progress across all AI/ML domains and stay motivated.
          </p>
        </div>
      </div>

      {/* Right Content - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => {
                setTab('signin')
                setError(null)
                setSuccess(null)
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                tab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('signup')
                setError(null)
                setSuccess(null)
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                tab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-slate-400 text-sm">
                    Sign in to continue tracking your learning
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-slate-200">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/50 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-800/50 text-emerald-300 text-sm">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                  <p className="text-slate-400 text-sm">
                    Start your AI/ML learning journey
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-200">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="text-slate-200">
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/50 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-800/50 text-emerald-300 text-sm">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

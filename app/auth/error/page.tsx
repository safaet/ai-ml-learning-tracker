'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
        <p className="text-slate-400 mb-8">
          Something went wrong during the authentication process. Please try again.
        </p>
        <Link href="/auth">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  )
}

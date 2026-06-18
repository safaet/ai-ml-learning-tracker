import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[v0] Auth error:', error)
      return NextResponse.json(
        { error: error.message || 'Authentication failed' },
        { status: 401 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err: unknown) {
    console.error('[v0] Signin route error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

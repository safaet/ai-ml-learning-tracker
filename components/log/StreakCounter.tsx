'use client'

import { useEffect, useState } from 'react'
import { getStreakCount } from '@/app/actions/logs'

export function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStreak() {
      const { streak: count } = await getStreakCount()
      setStreak(count)
      setLoading(false)
    }
    loadStreak()
  }, [])

  if (loading) {
    return (
      <div className="h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse" />
    )
  }

  return (
    <div className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg mb-8 max-w-sm mx-auto">
      <span className="text-3xl">🔥</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-orange-100">Day {streak} Streak</span>
        <span className="text-xs text-orange-200">Keep going!</span>
      </div>
    </div>
  )
}

'use client'

import { DashboardStats } from '@/app/actions/dashboard'
import { Card } from '@/components/ui/card'
import { Flame, Zap, TrendingUp, Calendar } from 'lucide-react'

interface StatsBarProps {
  stats: DashboardStats
}

export function StatsBar({ stats }: StatsBarProps) {
  const statItems = [
    {
      label: 'Total Hours',
      value: stats.totalHoursLogged.toFixed(1),
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak}d`,
      icon: Flame,
      color: 'from-orange-500 to-red-500',
    },
    {
      label: 'Longest Streak',
      value: `${stats.longestStreak}d`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Days Active (Month)',
      value: stats.daysActiveThisMonth,
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon
        return (
          <Card key={idx} className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                <p className="text-3xl font-bold text-slate-100">{item.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

import { Clock, Target, BookOpen, Flame } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatsBarProps {
  totalHours: number
  todayHours: number
  totalLogs: number
  activeGoals: number
  streak: number
}

export function StatsBar({ totalHours, todayHours, totalLogs, activeGoals, streak }: StatsBarProps) {
  const stats = [
    {
      icon: Clock,
      label: 'Total Hours',
      value: totalHours.toFixed(1),
      color: 'text-blue-400',
    },
    {
      icon: Clock,
      label: 'Today',
      value: todayHours.toFixed(1),
      color: 'text-cyan-400',
    },
    {
      icon: BookOpen,
      label: 'Total Logs',
      value: totalLogs.toString(),
      color: 'text-emerald-400',
    },
    {
      icon: Target,
      label: 'Active Goals',
      value: activeGoals.toString(),
      color: 'text-amber-400',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: streak.toString(),
      color: 'text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <Icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

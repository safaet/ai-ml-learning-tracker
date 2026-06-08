'use client'

import { DomainProgress } from '@/app/actions/dashboard'
import { DOMAINS } from '@/lib/domains'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ProgressRing } from '@/components/goals/ProgressRing'

interface DomainProgressCardProps {
  progress: DomainProgress
}

export function DomainProgressCard({ progress }: DomainProgressCardProps) {
  const domain = DOMAINS.find((d) => d.name === progress.domain)
  const Icon = domain?.icon

  const chartData = progress.last14Days.map((hours, idx) => ({
    day: idx + 1,
    hours,
  }))

  const statusColors = {
    ontrack: 'text-emerald-400',
    behind: 'text-amber-400',
    verybehind: 'text-red-400',
  }

  const statusLabels = {
    ontrack: 'On Track',
    behind: 'Slightly Behind',
    verybehind: 'Very Behind',
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-slate-300" />}
          <h3 className="font-semibold text-slate-100">{progress.domain}</h3>
        </div>
        <p className={`text-sm font-medium ${statusColors[progress.status]}`}>
          {statusLabels[progress.status]}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <ProgressRing percentage={progress.progressPercentage} color={progress.color} size="md" />
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-100">
            {progress.hoursLogged.toFixed(1)}h
          </p>
          <p className="text-sm text-slate-400">/ {progress.targetHours}h target</p>
          {progress.daysUntilTarget > 0 && (
            <p className="text-xs text-slate-500 mt-1">{progress.daysUntilTarget}d remaining</p>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="h-16 -mx-6 -mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke={`hsl(var(--color-${progress.color}))`}
                dot={false}
                isAnimationActive={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

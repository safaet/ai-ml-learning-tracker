'use client'

import { Card } from '@/components/ui/card'

interface HeatmapData {
  date: string
  dateFormatted: string
  hours: number
  intensity: number
}

interface ActivityHeatmapProps {
  data: HeatmapData[]
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const weeks: HeatmapData[][] = []
  let currentWeek: HeatmapData[] = []

  // Group data by weeks (Monday to Sunday)
  data.forEach((day) => {
    const date = new Date(day.date)
    const dayOfWeek = date.getDay()

    if (dayOfWeek === 1 && currentWeek.length > 0) {
      weeks.push([...currentWeek])
      currentWeek = []
    }

    currentWeek.push(day)
  })

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-800'
    if (intensity === 1) return 'bg-indigo-900'
    if (intensity === 2) return 'bg-indigo-700'
    if (intensity === 3) return 'bg-indigo-600'
    return 'bg-indigo-500'
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-slate-100 mb-6">Activity Heatmap (Last 90 Days)</h2>

      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-4">
          <div className="flex flex-col gap-2 justify-center">
            {dayLabels.map((label) => (
              <div key={label} className="w-8 h-8 flex items-center justify-center">
                <span className="text-xs text-slate-500 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-2">
              {dayLabels.map((_, dayIdx) => {
                const day = week[dayIdx]
                if (!day) {
                  return (
                    <div
                      key={dayIdx}
                      className="w-8 h-8 bg-slate-700/30 rounded border border-slate-700"
                    />
                  )
                }

                return (
                  <div
                    key={dayIdx}
                    className={`w-8 h-8 rounded border border-slate-600 cursor-pointer transition-all hover:border-slate-400 flex items-center justify-center group ${getIntensityColor(day.intensity)}`}
                    title={`${day.dateFormatted}: ${day.hours.toFixed(1)}h`}
                  >
                    <span className="text-xs text-slate-300 opacity-0 group-hover:opacity-100">
                      {day.hours > 0 ? day.hours.toFixed(1) : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6 text-xs">
        <span className="text-slate-400">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded ${
                intensity === 0
                  ? 'bg-slate-800'
                  : intensity === 1
                    ? 'bg-indigo-900'
                    : intensity === 2
                      ? 'bg-indigo-700'
                      : intensity === 3
                        ? 'bg-indigo-600'
                        : 'bg-indigo-500'
              }`}
            />
          ))}
        </div>
        <span className="text-slate-400">More</span>
      </div>
    </Card>
  )
}

import { Card } from '@/components/ui/card'

interface HeatmapCalendarProps {
  heatmapData: Record<string, number>
}

export function HeatmapCalendar({ heatmapData }: HeatmapCalendarProps) {
  // Generate heatmap for last 12 weeks (84 days)
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 83)

  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = []

  // Fill in the first week with nulls for days before start
  const firstDayOfWeek = startDate.getDay()
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null)
  }

  // Generate all dates
  const current = new Date(startDate)
  while (current <= today) {
    currentWeek.push(new Date(current))
    current.setDate(current.getDate() + 1)

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Fill remaining week with nulls
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  const getIntensity = (hours: number) => {
    if (hours === 0) return 'bg-slate-800'
    if (hours < 2) return 'bg-indigo-900/30'
    if (hours < 5) return 'bg-indigo-700/50'
    if (hours < 10) return 'bg-indigo-600/70'
    return 'bg-indigo-500'
  }

  const getTooltip = (date: Date | null) => {
    if (!date) return ''
    const dateStr = date.toISOString().split('T')[0]
    const hours = heatmapData[dateStr] || 0
    return `${date.toLocaleDateString()}: ${hours.toFixed(1)}h`
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">Activity Heatmap</h2>
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex gap-1">
            {week.map((date, dayIdx) => (
              <div key={dayIdx} className="w-3 h-3 sm:w-4 sm:h-4" title={getTooltip(date)}>
                {date ? (
                  <div className={`w-full h-full rounded ${getIntensity(heatmapData[date.toISOString().split('T')[0]] || 0)}`} />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-slate-800 rounded" />
          <div className="w-3 h-3 bg-indigo-900/30 rounded" />
          <div className="w-3 h-3 bg-indigo-700/50 rounded" />
          <div className="w-3 h-3 bg-indigo-600/70 rounded" />
          <div className="w-3 h-3 bg-indigo-500 rounded" />
        </div>
        <span>More</span>
      </div>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { DOMAINS } from '@/lib/domains'

interface Log {
  log_date: string
  domain: string
  activity_description: string
  hours_spent: number
  notes?: string
  date: string
}

interface ActivityFeedProps {
  logs: Log[]
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  const groupedByDate = logs.reduce(
    (acc, log) => {
      if (!acc[log.log_date]) {
        acc[log.log_date] = []
      }
      acc[log.log_date].push(log)
      return acc
    },
    {} as Record<string, Log[]>
  )

  const dates = Object.keys(groupedByDate).sort().reverse()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-100">Recent Activity</h2>

      <div className="space-y-6">
        {dates.slice(0, 7).map((date, dateIdx) => {
          const dateLogs = groupedByDate[date]
          const totalHours = dateLogs.reduce((sum, log) => sum + log.hours_spent, 0)
          const dateObj = new Date(date)
          const dateStr = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })

          return (
            <div key={date} className="relative">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5" />
                  {dateIdx < dates.length - 1 && (
                    <div className="w-0.5 h-20 bg-slate-700 my-2" />
                  )}
                </div>

                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-100">{dateStr}</h3>
                    <span className="text-sm text-slate-400">{totalHours.toFixed(1)}h logged</span>
                  </div>

                  <div className="space-y-2">
                    {dateLogs.map((log, logIdx) => {
                      const domain = DOMAINS.find((d) => d.name === log.domain)
                      return (
                        <Card
                          key={logIdx}
                          className="bg-slate-900/50 border-slate-700 p-4 text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-200">{log.domain}</p>
                              <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                                {log.activity_description}
                              </p>
                              {log.notes && (
                                <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                                  {log.notes}
                                </p>
                              )}
                            </div>
                            <span className="text-indigo-400 font-semibold whitespace-nowrap">
                              {log.hours_spent.toFixed(1)}h
                            </span>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

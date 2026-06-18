import { DOMAINS } from '@/lib/domains'
import { Card } from '@/components/ui/card'

interface Activity {
  id: string
  domain: string
  description: string
  hours: number
  date: string
  resources?: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No activities logged yet. Start logging to see your progress!</p>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">Recent Activities</h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const domainConfig = DOMAINS.find((d) => d.name === activity.domain)
          const DomainIcon = domainConfig?.icon

          return (
            <div key={activity.id} className="flex gap-4 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
              {DomainIcon && (
                <div className="flex-shrink-0 pt-1">
                  <DomainIcon className="w-5 h-5" style={{ color: `hsl(var(--color-${domainConfig?.color}))` }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-200 text-sm truncate">{activity.domain}</h3>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{activity.hours.toFixed(1)}h</span>
                </div>
                <p className="text-slate-400 text-sm truncate">{activity.description}</p>
                {activity.resources && <p className="text-xs text-slate-500 mt-1">{activity.resources}</p>}
                <p className="text-xs text-slate-600 mt-1">
                  {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

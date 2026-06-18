import { DOMAINS } from '@/lib/domains'
import { Card } from '@/components/ui/card'
import { useMemo } from 'react'

interface DomainProgressCardProps {
  domain: string
  hoursLogged: number
  targetHours?: number
}

export function DomainProgressCard({ domain, hoursLogged, targetHours }: DomainProgressCardProps) {
  const domainConfig = useMemo(
    () => DOMAINS.find((d) => d.name === domain),
    [domain]
  )

  // Memoize progress calculation
  const progress = useMemo(() => {
    return targetHours ? Math.min((hoursLogged / targetHours) * 100, 100) : 0
  }, [hoursLogged, targetHours])

  const isComplete = useMemo(() => {
    return targetHours ? hoursLogged >= targetHours : false
  }, [hoursLogged, targetHours])

  if (!domainConfig) return null

  const DomainIcon = domainConfig.icon

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6 overflow-hidden relative group hover:border-slate-600 transition-all">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DomainIcon className="w-6 h-6" style={{ color: `hsl(var(--color-${domainConfig.color}))` }} />
            <h3 className="font-semibold text-slate-100">{domain}</h3>
          </div>
          {isComplete && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Complete</span>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{hoursLogged.toFixed(1)} hours logged</span>
            {targetHours && <span className="text-slate-500">{targetHours} target</span>}
          </div>

          {targetHours && (
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, hsl(var(--color-${domainConfig.color})), hsl(var(--color-${domainConfig.color})) 60%, rgb(16 185 129))`,
                }}
              />
            </div>
          )}

          <div className="text-xs text-slate-400">
            {targetHours ? `${Math.round(progress)}% complete` : 'No target set'}
          </div>
        </div>
      </div>
    </Card>
  )
}

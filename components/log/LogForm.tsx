'use client'

import { useEffect, useRef } from 'react'
import { DOMAINS } from '@/lib/domains'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

interface LogFormProps {
  domain: string
  onUpdate: (domain: string, data: LogFormData) => void
  initialData?: LogFormData
}

export interface LogFormData {
  activityDescription: string
  hoursSpent: number
  resourcesUsed?: string
  notes?: string
}

export function LogForm({ domain, onUpdate, initialData }: LogFormProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const domainConfig = DOMAINS.find((d) => d.name === domain)

  const handleChange = (field: keyof LogFormData, value: any) => {
    const current = initialData || {
      activityDescription: '',
      hoursSpent: 0,
      resourcesUsed: '',
      notes: '',
    }

    onUpdate(domain, {
      ...current,
      [field]: value,
    })
  }

  useEffect(() => {
    // Scroll into view with smooth animation
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }, [])

  if (!domainConfig) return null

  return (
    <Card
      ref={containerRef}
      className="overflow-hidden border-l-4 transition-all duration-500 animate-in slide-in-from-left-2 opacity-0 data-[state=open]:opacity-100"
      style={{
        borderLeftColor: `hsl(var(--color-${domainConfig.color}))`,
        backgroundColor: `hsla(var(--color-${domainConfig.color}), 0.05)`,
      }}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          {domainConfig.icon && <domainConfig.icon className="w-5 h-5" />}
          <h3 className="font-semibold text-slate-200">{domainConfig.label}</h3>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`activity-${domain}`} className="text-sm text-slate-300">
              What did you study/build/read?
            </Label>
            <Textarea
              id={`activity-${domain}`}
              placeholder="e.g., Watched 3-hour deep learning course on CNNs, implemented ResNet from scratch"
              className="mt-2 bg-slate-900 border-slate-700 text-slate-100 resize-none"
              rows={3}
              value={initialData?.activityDescription || ''}
              onChange={(e) => handleChange('activityDescription', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`hours-${domain}`} className="text-sm text-slate-300">
                Hours spent
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    handleChange('hoursSpent', Math.max(0, (initialData?.hoursSpent || 0) - 0.5))
                  }
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm font-semibold text-slate-200 transition-colors"
                >
                  −
                </button>
                <Input
                  id={`hours-${domain}`}
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  className="flex-1 bg-slate-900 border-slate-700 text-slate-100 text-center"
                  value={initialData?.hoursSpent || 0}
                  onChange={(e) => handleChange('hoursSpent', parseFloat(e.target.value) || 0)}
                />
                <button
                  onClick={() =>
                    handleChange('hoursSpent', Math.min(24, (initialData?.hoursSpent || 0) + 0.5))
                  }
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm font-semibold text-slate-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor={`resources-${domain}`} className="text-sm text-slate-300">
                Resources used (optional)
              </Label>
              <Input
                id={`resources-${domain}`}
                placeholder="e.g., Fast.ai, arXiv, YouTube"
                className="mt-2 bg-slate-900 border-slate-700 text-slate-100"
                value={initialData?.resourcesUsed || ''}
                onChange={(e) => handleChange('resourcesUsed', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`notes-${domain}`} className="text-sm text-slate-300">
              Notes / reflections (optional)
            </Label>
            <Textarea
              id={`notes-${domain}`}
              placeholder="What did you learn? Any breakthroughs or challenges?"
              className="mt-2 bg-slate-900 border-slate-700 text-slate-100 resize-none"
              rows={2}
              value={initialData?.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

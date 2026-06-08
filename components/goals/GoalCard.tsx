'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ProgressRing } from './ProgressRing'
import { domainConfig } from '@/lib/domains'

interface GoalCardProps {
  domain: string
  title: string
  description?: string
  targetHours: number
  targetDate: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onTargetHoursChange: (value: number) => void
  onTargetDateChange: (value: string) => void
}

export function GoalCard({
  domain,
  title,
  description = '',
  targetHours,
  targetDate,
  onTitleChange,
  onDescriptionChange,
  onTargetHoursChange,
  onTargetDateChange,
}: GoalCardProps) {
  const config = domainConfig[domain as keyof typeof domainConfig]
  if (!config) return null

  const { icon: Icon, color, label } = config

  return (
    <div className="group relative rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50">
      {/* Header with icon and progress */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2.5 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">{label}</h3>
            <p className="text-xs text-slate-400">Set your learning goal</p>
          </div>
        </div>
        <div className="text-slate-300">
          <ProgressRing percentage={0} size={50} strokeWidth={3} color={color} />
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* Title / Achievement */}
        <div className="space-y-2">
          <Label htmlFor={`title-${domain}`} className="text-sm text-slate-300">
            What do you want to achieve?
          </Label>
          <Input
            id={`title-${domain}`}
            placeholder={`e.g., Master ${label.split(' ')[0]} basics`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-slate-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label
            htmlFor={`description-${domain}`}
            className="text-sm text-slate-300"
          >
            Description (optional)
          </Label>
          <Textarea
            id={`description-${domain}`}
            placeholder="Add notes about this goal..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
            className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-slate-500"
          />
        </div>

        {/* Target Hours and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor={`hours-${domain}`}
              className="text-sm text-slate-300"
            >
              Target Hours
            </Label>
            <Input
              id={`hours-${domain}`}
              type="number"
              min="1"
              max="1000"
              value={targetHours}
              onChange={(e) => onTargetHoursChange(parseInt(e.target.value) || 0)}
              className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`date-${domain}`} className="text-sm text-slate-300">
              Target Date
            </Label>
            <Input
              id={`date-${domain}`}
              type="date"
              value={targetDate}
              onChange={(e) => onTargetDateChange(e.target.value)}
              className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-slate-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

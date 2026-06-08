'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { saveDailyLogs, checkExistingLogs, type DailyLogEntry } from '@/app/actions/logs'
import { StreakCounter } from '@/components/log/StreakCounter'
import { DomainSelector } from '@/components/log/DomainSelector'
import { LogForm, type LogFormData } from '@/components/log/LogForm'
import { CelebrationAnimation } from '@/components/log/CelebrationAnimation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [formData, setFormData] = useState<Record<string, LogFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState<DailyLogEntry[]>([])

  // Set initial date on mount to avoid hydration mismatch
  useEffect(() => {
    const today = new Date()
    setSelectedDate(today.toISOString().split('T')[0])
    setMounted(true)
  }, [])

  // Check for existing logs when date changes
  useEffect(() => {
    if (!selectedDate) return

    async function checkLogs() {
      const { domainsLogged, totalHours } = await checkExistingLogs(selectedDate)
      if (domainsLogged && domainsLogged.length > 0) {
        const today = new Date().toISOString().split('T')[0]
        if (selectedDate === today) {
          toast.warning(
            `You've already logged ${domainsLogged.length} domain(s) today (${totalHours.toFixed(1)} hours)`,
            { description: 'You can add more or continue editing.' }
          )
        }
      }
    }
    checkLogs()
  }, [selectedDate])

  const handleUpdateForm = (domain: string, data: LogFormData) => {
    setFormData((prev) => ({
      ...prev,
      [domain]: data,
    }))
  }

  const handleSubmit = async () => {
    // Validation
    if (selectedDomains.length === 0) {
      toast.error('Please select at least one domain')
      return
    }

    const logsToSubmit: DailyLogEntry[] = []
    let totalHours = 0

    for (const domain of selectedDomains) {
      const data = formData[domain]

      if (!data || !data.activityDescription.trim()) {
        toast.error(`Please describe what you did in ${domain}`)
        return
      }

      logsToSubmit.push({
        domain,
        activityDescription: data.activityDescription,
        hoursSpent: data.hoursSpent,
        resourcesUsed: data.resourcesUsed,
        notes: data.notes,
        logDate: selectedDate,
      })

      totalHours += data.hoursSpent
    }

    // Warn if over 12 hours
    if (totalHours > 12) {
      toast.warning('Wow! You logged over 12 hours today. Make sure to take care of yourself!')
    }

    setIsLoading(true)

    try {
      const result = await saveDailyLogs(logsToSubmit)

      if (result.success) {
        // Show celebration
        setCelebrationData(logsToSubmit)
        setShowCelebration(true)

        // Reset form after 2 seconds
        setTimeout(() => {
          setSelectedDomains([])
          setFormData({})
          setShowCelebration(false)

          // Reset date to today
          const today = new Date()
          setSelectedDate(today.toISOString().split('T')[0])
        }, 4000)
      } else {
        toast.error(result.error || 'Failed to save logs')
      }
    } catch (error) {
      console.error('[v0] Error submitting logs:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <CelebrationAnimation
            entries={celebrationData}
            totalHours={celebrationData.reduce((sum, log) => sum + log.hoursSpent, 0)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Streak Counter */}
        <StreakCounter />

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">
            Today&apos;s Learning Log
          </h1>
          <p className="text-slate-400">Track what you learned, built, or studied today</p>
        </div>

        {/* Date Picker */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Label htmlFor="log-date" className="text-slate-300 font-semibold">
              Date:
            </Label>
            <Input
              id="log-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 bg-slate-900 border-slate-700 text-slate-100"
            />
            <div className="text-sm text-slate-400">
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
            </div>
          </div>
        </Card>

        {/* Domain Selector */}
        <DomainSelector selectedDomains={selectedDomains} onSelectionChange={setSelectedDomains} />

        {/* Selected Domain Forms */}
        {selectedDomains.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Fill in your activity details</h2>
            {selectedDomains.map((domain) => (
              <LogForm
                key={domain}
                domain={domain}
                initialData={formData[domain]}
                onUpdate={handleUpdateForm}
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        {selectedDomains.length > 0 && (
          <div className="flex gap-4 justify-center pt-8">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Today\'s Log'}
            </Button>
          </div>
        )}

        {selectedDomains.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Select a domain above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

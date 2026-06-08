'use client'

import { useState, useEffect } from 'react'
import { fetchGoals, saveGoals, type GoalInput } from '@/app/actions/goals'
import { GoalCard } from '@/components/goals/GoalCard'
import { Button } from '@/components/ui/button'
import { DOMAINS } from '@/lib/domains'
import { toast } from 'sonner'

interface GoalFormData {
  [key: string]: {
    title: string
    description: string
    target_hours: number
    target_date: string
  }
}

export default function GoalsPage() {
  const [goalData, setGoalData] = useState<GoalFormData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Initialize form data with empty values and fetch existing goals
  useEffect(() => {
    const initializeGoals = async () => {
      try {
        setLoading(true)

        // Fetch existing goals from database
        const existingGoals = await fetchGoals()

        // Create initial form data structure
        const initialData: GoalFormData = {}

        DOMAINS.forEach((domain) => {
          const existingGoal = existingGoals.find(
            (g: any) => g.domain === domain
          )

          initialData[domain] = {
            title: existingGoal?.title || '',
            description: existingGoal?.description || '',
            target_hours: existingGoal?.target_hours || 100,
            target_date: existingGoal?.target_date || '',
          }
        })

        setGoalData(initialData)
      } catch (error) {
        console.error('[v0] Error initializing goals:', error)
        toast.error('Failed to load existing goals')

        // Still initialize empty form if fetch fails
        const initialData: GoalFormData = {}
        DOMAINS.forEach((domain) => {
          initialData[domain] = {
            title: '',
            description: '',
            target_hours: 100,
            target_date: '',
          }
        })
        setGoalData(initialData)
      } finally {
        setLoading(false)
      }
    }

    initializeGoals()
  }, [])

  const handleFieldChange = (
    domain: string,
    field: string,
    value: string | number
  ) => {
    setGoalData((prev) => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [field]: value,
      },
    }))
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)

      // Validate that at least title and target_hours are filled for each goal
      const validGoals = Object.entries(goalData)
        .filter(
          ([, data]) =>
            data.title.trim() && data.target_hours > 0 && data.target_date
        )
        .map(([domain, data]) => ({
          domain,
          title: data.title,
          description: data.description,
          target_hours: data.target_hours,
          target_date: data.target_date,
        }))

      if (validGoals.length === 0) {
        toast.error('Please fill in at least one goal with title, hours, and date')
        setSaving(false)
        return
      }

      await saveGoals(validGoals)
      toast.success(`Saved ${validGoals.length} goal(s) successfully!`)
    } catch (error) {
      console.error('[v0] Error saving goals:', error)
      toast.error('Failed to save goals. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-indigo-500"></div>
          <p className="text-slate-300">Loading your goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
            Set Your Learning Goals
          </h1>
          <p className="mt-4 text-lg italic text-slate-400">
            {`"Every hour you log brings you closer."`}
          </p>
          <p className="mt-2 text-slate-500">
            Define what you want to achieve in each AI/ML domain
          </p>
        </div>

        {/* Goals grid */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DOMAINS.map((domain) => (
            <GoalCard
              key={domain}
              domain={domain}
              title={goalData[domain]?.title || ''}
              description={goalData[domain]?.description || ''}
              targetHours={goalData[domain]?.target_hours || 100}
              targetDate={goalData[domain]?.target_date || ''}
              onTitleChange={(value) =>
                handleFieldChange(domain, 'title', value)
              }
              onDescriptionChange={(value) =>
                handleFieldChange(domain, 'description', value)
              }
              onTargetHoursChange={(value) =>
                handleFieldChange(domain, 'target_hours', value)
              }
              onTargetDateChange={(value) =>
                handleFieldChange(domain, 'target_date', value)
              }
            />
          ))}
        </div>

        {/* Save button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            size="lg"
            className="bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving Goals...' : 'Save All Goals'}
          </Button>
        </div>

        {/* Info text */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Fill in at least title, target hours, and target date for each goal you
          want to track.
        </p>
      </div>
    </div>
  )
}

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
            (g: any) => g.domain === domain.name
          )

          initialData[domain.name] = {
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
          initialData[domain.name] = {
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
      const validGoals: GoalInput[] = Object.entries(goalData)
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
        return
      }

      await saveGoals(validGoals)
      toast.success('Goals saved successfully!')
    } catch (error) {
      console.error('[v0] Error saving goals:', error)
      toast.error('Failed to save goals')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Set Your Learning Goals</h1>
          <p className="text-slate-400">Every hour you log brings you closer.</p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOMAINS.map((domain) => (
            <GoalCard
              key={domain.name}
              domain={domain.name}
              title={goalData[domain.name]?.title || ''}
              description={goalData[domain.name]?.description || ''}
              targetHours={goalData[domain.name]?.target_hours || 100}
              targetDate={goalData[domain.name]?.target_date || ''}
              onTitleChange={(value) => handleFieldChange(domain.name, 'title', value)}
              onDescriptionChange={(value) => handleFieldChange(domain.name, 'description', value)}
              onTargetHoursChange={(value) => handleFieldChange(domain.name, 'target_hours', value)}
              onTargetDateChange={(value) => handleFieldChange(domain.name, 'target_date', value)}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-200"
          >
            {saving ? 'Saving...' : 'Save All Goals'}
          </Button>
        </div>
      </div>
    </div>
  )
}

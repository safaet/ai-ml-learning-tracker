'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { saveDailyLogs } from '@/app/actions/logs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DOMAINS } from '@/lib/domains'
import { Plus } from 'lucide-react'

export function QuickLogModal() {
  const [open, setOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('')
  const [hours, setHours] = useState(1)
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedDomain || !description.trim()) {
      toast.error('Please select a domain and enter a description')
      return
    }

    if (hours < 0.5 || hours > 24) {
      toast.error('Hours must be between 0.5 and 24')
      return
    }

    setIsLoading(true)

    try {
      const today = new Date().toISOString().split('T')[0]
      const result = await saveDailyLogs([
        {
          domain: selectedDomain,
          activityDescription: description,
          hoursSpent: hours,
          resourcesUsed: '',
          notes: '',
          logDate: today,
        },
      ])

      if (result.success) {
        toast.success('Quick log saved!')
        setOpen(false)
        setSelectedDomain('')
        setHours(1)
        setDescription('')
      } else {
        toast.error(result.error || 'Failed to save log')
      }
    } catch (error) {
      console.error('[v0] Error in quick log:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl items-center justify-center transition-all duration-200 z-30"
        title="Quick Log"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Quick Log</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Domain Selector */}
            <div>
              <Label className="text-slate-300">Domain</Label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a domain...</option>
                {DOMAINS.map((domain) => (
                  <option key={domain.name} value={domain.name}>
                    {domain.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hours */}
            <div>
              <Label className="text-slate-300">Hours</Label>
              <Input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
                className="mt-1 bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-slate-300">What did you do?</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Completed lesson 3 of..."
                className="mt-1 bg-slate-800 border-slate-700 text-slate-100 resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save Log'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

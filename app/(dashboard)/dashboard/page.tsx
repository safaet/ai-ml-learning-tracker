'use client'

import { Suspense, useEffect, useState } from 'react'
import { getDashboardData, DashboardData } from '@/app/actions/dashboard'
import { toast } from 'sonner'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { DomainProgressCard } from '@/components/dashboard/DomainProgressCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { Card } from '@/components/ui/card'

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)

      const result = await getDashboardData()

      if (result.error) {
        setError(result.error)
        toast.error('Failed to load dashboard')
      } else if (result.data) {
        setData(result.data)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md text-center">
          <p className="text-slate-400">{error || 'Failed to load dashboard data'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <StatsBar stats={data.stats} />

      {/* Domain Progress Cards */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Domain Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.domainProgress.map((progress) => (
            <DomainProgressCard key={progress.domain} progress={progress} />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection chartData30Days={data.chartData30Days} radarData={data.radarData} />

      {/* Activity Heatmap */}
      <ActivityHeatmap data={data.heatmapData} />

      {/* Activity Feed */}
      <ActivityFeed logs={data.recentLogs} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100">Your Learning Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Track your progress across all domains and stay motivated
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  )
}

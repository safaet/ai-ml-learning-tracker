import { Suspense } from 'react'
import { getDashboardStats, getDomainProgress, getActivityFeed, getHeatmapData, getWeeklyProgress, getStreak } from '@/app/actions/dashboard'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { DomainProgressCard } from '@/components/dashboard/DomainProgressCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { HeatmapCalendar } from '@/components/dashboard/HeatmapCalendar'
import { DOMAINS } from '@/lib/domains'
import { Skeleton } from '@/components/ui/skeleton'

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 bg-slate-700" />
      ))}
    </div>
  )
}

function DomainProgressSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(7)].map((_, i) => (
        <Skeleton key={i} className="h-40 bg-slate-700" />
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-80 bg-slate-700" />
}

async function StatsSection() {
  const stats = await getDashboardStats()
  const streak = await getStreak()
  return <StatsBar {...stats} streak={streak} />
}

async function DomainProgressSection() {
  const domainProgress = await getDomainProgress()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {DOMAINS.map((domain) => (
        <DomainProgressCard
          key={domain.name}
          domain={domain.name}
          hoursLogged={domainProgress[domain.name]?.logged || 0}
          targetHours={domainProgress[domain.name]?.goal}
        />
      ))}
    </div>
  )
}

async function ActivityFeedSection() {
  const activities = await getActivityFeed()
  return <ActivityFeed activities={activities} />
}

async function WeeklyChartSection() {
  const weeklyData = await getWeeklyProgress()
  return <WeeklyChart data={weeklyData} />
}

async function HeatmapSection() {
  const heatmapData = await getHeatmapData()
  return <HeatmapCalendar heatmapData={heatmapData} />
}

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Learning Dashboard</h1>
          <p className="text-slate-400">Track your progress across all AI/ML domains</p>
        </div>

        {/* Stats */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsSection />
        </Suspense>

        {/* Domain Progress */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Domain Progress</h2>
          <Suspense fallback={<DomainProgressSkeleton />}>
            <DomainProgressSection />
          </Suspense>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Chart */}
          <Suspense fallback={<ChartSkeleton />}>
            <WeeklyChartSection />
          </Suspense>

          {/* Heatmap */}
          <Suspense fallback={<ChartSkeleton />}>
            <HeatmapSection />
          </Suspense>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Recent Activity</h2>
          <Suspense fallback={<Skeleton className="h-96 bg-slate-700" />}>
            <ActivityFeedSection />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

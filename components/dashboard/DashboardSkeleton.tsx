'use client'

import { Card } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 py-8">
      {/* Stats Bar Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
                <div className="h-8 w-32 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-slate-700 rounded-lg animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      {/* Domain Cards Skeleton */}
      <div>
        <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="space-y-4">
                <div className="h-5 w-40 bg-slate-700 rounded animate-pulse" />
                <div className="h-24 w-24 bg-slate-700 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
                <div className="h-16 w-full bg-slate-700 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700 p-6">
            <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="h-64 w-full bg-slate-700 rounded animate-pulse" />
          </Card>
        ))}
      </div>

      {/* Activity Feed Skeleton */}
      <div>
        <div className="h-6 w-40 bg-slate-700 rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 p-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

'use server'

import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
  totalHoursLogged: number
  currentStreak: number
  longestStreak: number
  daysActiveThisMonth: number
}

export interface DomainProgress {
  domain: string
  color: string
  hoursLogged: number
  targetHours: number
  targetDate: string
  daysUntilTarget: number
  progressPercentage: number
  status: 'ontrack' | 'behind' | 'verybehind'
  last14Days: number[]
}

export interface DashboardData {
  stats: DashboardStats
  domainProgress: DomainProgress[]
  recentLogs: any[]
  heatmapData: any[]
  chartData30Days: any[]
  radarData: any[]
}

export async function getDashboardData(): Promise<{
  data?: DashboardData
  error?: string
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const userId = user.id

    // Get all goals
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')

    // Get all daily logs
    const { data: logs } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })

    if (!logs) {
      return { error: 'Failed to fetch logs' }
    }

    // Calculate stats
    const totalHours = logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate = new Date(logs[0]?.log_date || Date.now())

    const sortedLogs = logs.sort(
      (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
    )

    const uniqueDates = Array.from(new Set(sortedLogs.map((l) => l.log_date)))

    uniqueDates.forEach((dateStr, idx) => {
      const currentDate = new Date(dateStr)
      const prevDate = idx > 0 ? new Date(uniqueDates[idx - 1]) : null

      if (!prevDate) {
        const today = new Date()
        const isToday = currentDate.toDateString() === today.toDateString()
        const isYesterday =
          currentDate.toDateString() ===
          new Date(today.getTime() - 86400000).toDateString()

        if (isToday || isYesterday) {
          tempStreak = 1
        } else {
          tempStreak = 0
        }
      } else {
        const diffDays = Math.round((prevDate.getTime() - currentDate.getTime()) / 86400000)
        if (diffDays === 1) {
          tempStreak++
        } else {
          tempStreak = 1
        }
      }

      if (idx === 0) {
        currentStreak = tempStreak
      }

      longestStreak = Math.max(longestStreak, tempStreak)
    })

    // Days active this month
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const logsThisMonth = logs.filter((log) => new Date(log.log_date) >= monthStart)
    const daysActive = new Set(logsThisMonth.map((l) => l.log_date)).size

    // Domain progress
    const domainColors: Record<string, string> = {
      'ML Fundamentals': 'indigo',
      'Deep Learning': 'blue',
      'NLP/LLMs': 'cyan',
      'Computer Vision': 'violet',
      'MLOps/Deployment': 'emerald',
      'Research Papers': 'amber',
      'Coding/Projects': 'pink',
    }

    const domainProgress: DomainProgress[] = [
      'ML Fundamentals',
      'Deep Learning',
      'NLP/LLMs',
      'Computer Vision',
      'MLOps/Deployment',
      'Research Papers',
      'Coding/Projects',
    ].map((domain) => {
      const goal = goals?.find((g) => g.domain === domain)
      const domainLogs = logs.filter((l) => l.domain === domain)
      const hoursLogged = domainLogs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)

      const targetHours = goal?.target_hours || 0
      const targetDate = goal?.target_date || null
      const progressPercentage = targetHours > 0 ? Math.round((hoursLogged / targetHours) * 100) : 0

      let daysUntilTarget = 0
      if (targetDate) {
        const target = new Date(targetDate)
        const today = new Date()
        daysUntilTarget = Math.ceil((target.getTime() - today.getTime()) / 86400000)
      }

      const status =
        progressPercentage >= 80
          ? 'ontrack'
          : progressPercentage >= 50
            ? 'behind'
            : 'verybehind'

      // Last 14 days of activity
      const last14Days = Array(14)
        .fill(0)
        .map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (13 - i))
          const dateStr = date.toISOString().split('T')[0]
          const dayLogs = domainLogs.filter((l) => l.log_date === dateStr)
          return dayLogs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
        })

      return {
        domain,
        color: domainColors[domain] || 'gray',
        hoursLogged,
        targetHours,
        targetDate: targetDate || '',
        daysUntilTarget,
        progressPercentage,
        status,
        last14Days,
      }
    })

    // Recent logs (last 7 days)
    const recentLogs = sortedLogs
      .slice(0, 20)
      .map((log) => ({
        ...log,
        date: new Date(log.log_date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      }))

    // Heatmap data (last 90 days)
    const heatmapData = Array(90)
      .fill(0)
      .map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (89 - i))
        const dateStr = date.toISOString().split('T')[0]
        const dayLogs = logs.filter((l) => l.log_date === dateStr)
        const hours = dayLogs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
        return {
          date: dateStr,
          dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          hours,
          intensity: hours > 0 ? Math.min(4, Math.ceil(hours / 3)) : 0,
        }
      })

    // 30-day chart data
    const chartData30Days = Array(30)
      .fill(0)
      .map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        const dateStr = date.toISOString().split('T')[0]
        const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        const dayLogs = logs.filter((l) => l.log_date === dateStr)

        const dataPoint: any = { date: dateFormatted, total: 0 }

        Object.keys(domainColors).forEach((domain) => {
          const domainHours = dayLogs
            .filter((l) => l.domain === domain)
            .reduce((sum, log) => sum + (log.hours_spent || 0), 0)
          dataPoint[domain] = domainHours
          dataPoint.total += domainHours
        })

        return dataPoint
      })

    // Radar data
    const radarData = Object.keys(domainColors).map((domain) => {
      const domainProgress_ = domainProgress.find((dp) => dp.domain === domain)
      return {
        domain: domain.substring(0, 10),
        value: domainProgress_?.progressPercentage || 0,
        fullDomain: domain,
      }
    })

    return {
      data: {
        stats: {
          totalHoursLogged: totalHours,
          currentStreak,
          longestStreak,
          daysActiveThisMonth: daysActive,
        },
        domainProgress,
        recentLogs,
        heatmapData,
        chartData30Days,
        radarData,
      },
    }
  } catch (error) {
    console.error('[v0] Dashboard error:', error)
    return { error: 'Failed to fetch dashboard data' }
  }
}

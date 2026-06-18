'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const totalHours = logs?.reduce((sum, log) => sum + (log.hours_spent || 0), 0) || 0
  const today = new Date().toISOString().split('T')[0]
  const todayHours = logs?.filter((log) => log.log_date === today).reduce((sum, log) => sum + (log.hours_spent || 0), 0) || 0

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    todayHours: Math.round(todayHours * 10) / 10,
    totalLogs: logs?.length || 0,
    activeGoals: goals?.length || 0,
  }
}

export async function getDomainProgress() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')

  // Group logs by domain
  const domainStats = {} as Record<string, { logged: number; goal?: number; goalId?: string }>

  logs?.forEach((log) => {
    if (!domainStats[log.domain]) {
      domainStats[log.domain] = { logged: 0 }
    }
    domainStats[log.domain].logged += log.hours_spent || 0
  })

  // Add goal targets
  goals?.forEach((goal) => {
    if (!domainStats[goal.domain]) {
      domainStats[goal.domain] = { logged: 0, goal: goal.target_hours, goalId: goal.id }
    } else {
      domainStats[goal.domain].goal = goal.target_hours
      domainStats[goal.domain].goalId = goal.id
    }
  })

  return domainStats
}

export async function getActivityFeed() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('log_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    logs?.map((log) => ({
      id: log.id,
      domain: log.domain,
      description: log.activity_description,
      hours: log.hours_spent,
      date: log.log_date,
      resources: log.resources_used,
    })) || []
  )
}

export async function getHeatmapData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)

  // Group by date and count activity
  const heatmapData = {} as Record<string, number>

  logs?.forEach((log) => {
    if (!heatmapData[log.log_date]) {
      heatmapData[log.log_date] = 0
    }
    heatmapData[log.log_date] += log.hours_spent || 0
  })

  return heatmapData
}

export async function getWeeklyProgress() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: logs } = await supabase.from('daily_logs').select('*').eq('user_id', user.id)

  // Get last 7 days of data
  const today = new Date()
  const weekData = {} as Record<string, Record<string, number>>

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayName = daysOfWeek[date.getDay()]

    weekData[dayName] = {}

    logs?.forEach((log) => {
      if (log.log_date === dateStr) {
        if (!weekData[dayName][log.domain]) {
          weekData[dayName][log.domain] = 0
        }
        weekData[dayName][log.domain] += log.hours_spent || 0
      }
    })
  }

  return Object.entries(weekData).map(([day, domains]) => ({
    day,
    ...domains,
  }))
}

export async function getStreak() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('log_date')
    .eq('user_id', user.id)
    .order('log_date', { ascending: false })

  if (!logs || logs.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const uniqueDates = new Set(logs.map((log) => log.log_date))

  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    if (uniqueDates.has(dateStr)) {
      streak++
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

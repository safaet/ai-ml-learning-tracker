'use server'

import { createClient } from '@/lib/supabase/server'

export interface DailyLogEntry {
  domain: string
  activityDescription: string
  hoursSpent: number
  resourcesUsed?: string
  notes?: string
  logDate: string
}

export async function saveDailyLogs(logs: DailyLogEntry[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const logsToInsert = logs.map((log) => ({
      user_id: user.id,
      domain: log.domain,
      log_date: log.logDate,
      activity_description: log.activityDescription,
      hours_spent: log.hoursSpent,
      resources_used: log.resourcesUsed || null,
      notes: log.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from('daily_logs').insert(logsToInsert)

    if (error) {
      console.error('[v0] Error saving logs:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return { success: false, error: 'Failed to save logs' }
  }
}

export async function checkExistingLogs(logDate: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { exists: false, error: 'Not authenticated' }
  }

  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('domain, hours_spent')
      .eq('user_id', user.id)
      .eq('log_date', logDate)

    if (error) {
      return { exists: false, error: error.message }
    }

    return {
      exists: (data || []).length > 0,
      domainsLogged: data?.map((log) => log.domain) || [],
      totalHours: data?.reduce((sum, log) => sum + Number(log.hours_spent), 0) || 0,
    }
  } catch (error) {
    console.error('[v0] Error checking logs:', error)
    return { exists: false, error: 'Failed to check logs' }
  }
}

export async function getStreakCount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { streak: 0, error: 'Not authenticated' }
  }

  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('log_date')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })

    if (error || !data || data.length === 0) {
      return { streak: 0 }
    }

    let streak = 1
    const uniqueDates = [...new Set(data.map((log) => log.log_date))]

    if (uniqueDates.length === 0) return { streak: 0 }

    const today = new Date().toISOString().split('T')[0]
    const lastLogDate = uniqueDates[0]

    // If last log wasn't today or yesterday, streak is broken
    const lastDate = new Date(lastLogDate)
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - 1)

    if (lastLogDate !== today && lastLogDate !== checkDate.toISOString().split('T')[0]) {
      return { streak: 0 }
    }

    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i - 1])
      const prevDate = new Date(uniqueDates[i])

      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }

    return { streak }
  } catch (error) {
    console.error('[v0] Error calculating streak:', error)
    return { streak: 0, error: 'Failed to calculate streak' }
  }
}

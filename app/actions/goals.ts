'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

export type GoalInput = {
  domain: string
  title: string
  description?: string
  target_hours: number
  target_date: string
}

export async function fetchGoals() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('domain')

  if (error) {
    console.error('[v0] Fetch goals error:', error)
    throw error
  }

  return data || []
}

export async function saveGoals(goals: GoalInput[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  try {
    // Fetch existing goals to determine which to insert/update/delete
    const { data: existingGoals, error: fetchError } = await supabase
      .from('goals')
      .select('id, domain')
      .eq('user_id', user.id)

    if (fetchError) throw fetchError

    const existingDomains = new Set(existingGoals?.map((g) => g.domain) || [])
    const incomingDomains = new Set(goals.map((g) => g.domain))

    // Delete goals for domains that are no longer in the incoming data
    const domainsToDelete = Array.from(existingDomains).filter(
      (d) => !incomingDomains.has(d)
    )

    if (domainsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('user_id', user.id)
        .in('domain', domainsToDelete)

      if (deleteError) throw deleteError
    }

    // Upsert (insert or update) goals
    const goalsToSave = goals.map((goal) => ({
      user_id: user.id,
      domain: goal.domain,
      title: goal.title,
      description: goal.description || null,
      target_hours: goal.target_hours,
      target_date: goal.target_date,
      status: 'active',
    }))

    const { error: upsertError } = await supabase
      .from('goals')
      .upsert(goalsToSave, {
        onConflict: 'user_id,domain',
      })

    if (upsertError) throw upsertError

    revalidateTag('goals', 'max')
    return { success: true }
  } catch (error) {
    console.error('[v0] Save goals error:', error)
    throw error
  }
}

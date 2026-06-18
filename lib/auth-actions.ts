'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user?.email) {
      throw new Error('Not authenticated')
    }

    // First, verify current password by attempting to re-authenticate
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error updating password:', error)
    return { success: false, error: 'Failed to update password' }
  }
}

export async function updateProfile(fullName: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function deleteAllData() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // Delete all user data
    await supabase.from('daily_logs').delete().eq('user_id', user.id)
    await supabase.from('goals').delete().eq('user_id', user.id)
    await supabase.from('progress_snapshots').delete().eq('user_id', user.id)

    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting data:', error)
    return { success: false, error: 'Failed to delete data' }
  }
}

export async function deleteAccount() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // Delete all user data first
    await supabase.from('daily_logs').delete().eq('user_id', user.id)
    await supabase.from('goals').delete().eq('user_id', user.id)
    await supabase.from('progress_snapshots').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)

    // Delete auth user (requires admin privileges, so we just sign out)
    await supabase.auth.signOut()

    redirect('/auth')
  } catch (error) {
    console.error('[v0] Error deleting account:', error)
    return { success: false, error: 'Failed to delete account' }
  }
}

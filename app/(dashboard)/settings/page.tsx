'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updatePassword, updateProfile, deleteAllData, deleteAccount } from '@/lib/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

function SettingsContent() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || '')
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile?.full_name) {
          setFullName(profile.full_name)
        }
      }
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Please enter a name')
      return
    }

    setLoading(true)
    try {
      const result = await updateProfile(fullName)
      if (result.success) {
        toast.success('Profile updated successfully')
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const result = await updatePassword(currentPassword, newPassword)
      if (result.success) {
        toast.success('Password updated successfully')
        setShowPasswordForm(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(result.error || 'Failed to update password')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAllData = async () => {
    setLoading(true)
    try {
      const result = await deleteAllData()
      if (result.success) {
        toast.success('All data deleted successfully')
        setShowDeleteConfirm(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const result = await deleteAccount()
      if (result.success) {
        toast.success('Account deleted')
        router.push('/auth')
      } else {
        toast.error(result.error || 'Failed to delete account')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Section */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              value={userEmail}
              disabled
              className="mt-1 bg-slate-900 border-slate-700 text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label className="text-slate-300">Full Name</Label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 bg-slate-900 border-slate-700 text-slate-100"
            />
          </div>

          <Button onClick={handleUpdateProfile} disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Security</h2>

        {!showPasswordForm ? (
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(true)}
            className="w-full sm:w-auto"
          >
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <Label className="text-slate-300">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <Label className="text-slate-300">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-950/20 border-red-900/50 p-6">
        <div className="flex gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          {/* Reset Data */}
          <div className="pb-4 border-b border-red-900/50">
            <p className="text-slate-300 mb-3">Delete all your learning logs, goals, and data</p>
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full sm:w-auto"
              >
                Reset All Data
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-400">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAllData}
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete All Data'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Account */}
          <div>
            <p className="text-slate-300 mb-3">Permanently delete your account and all data</p>
            {!showAccountDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowAccountDeleteConfirm(true)}
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-400">This will delete your account permanently. This cannot be undone.</p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete Account'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAccountDeleteConfirm(false)}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Settings</h1>
        <p className="text-slate-400 mb-8">Manage your account and preferences</p>

        <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
          <SettingsContent />
        </Suspense>
      </div>
    </div>
  )
}

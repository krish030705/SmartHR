import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { changePassword } from '../services/authService.js'

export default function SettingsPage({ role }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
    setSuccessMessage('')
  }

  function validate() {
    const errs = {}
    if (!form.currentPassword) errs.currentPassword = 'Current password is required.'
    if (!form.newPassword || form.newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters.'
    }
    if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError('')
    setSuccessMessage('')
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      setSuccessMessage('Password updated successfully.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setSubmitError(err.message || 'Unable to update password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role={role} title="Settings">
      <div className="space-y-6 max-w-lg">
        <div className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
          <h2 className="font-display text-base font-medium text-ink">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-soft">Name</dt>
              <dd className="text-ink">{user?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-soft">Email</dt>
              <dd className="text-ink">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-soft">Role</dt>
              <dd className="capitalize text-ink">{user?.role}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
          <h2 className="font-display text-base font-medium text-ink">Change Password</h2>

          {submitError && (
            <div role="alert" className="mt-4 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
              {submitError}
            </div>
          )}
          {successMessage && (
            <div role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
            <Input
              id="currentPassword" name="currentPassword" type="password" label="Current password"
              value={form.currentPassword} onChange={handleChange} error={errors.currentPassword}
            />
            <Input
              id="newPassword" name="newPassword" type="password" label="New password"
              value={form.newPassword} onChange={handleChange} error={errors.newPassword}
            />
            <Input
              id="confirmPassword" name="confirmPassword" type="password" label="Confirm new password"
              value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
            />
            <Button type="submit" loading={saving} className="w-auto px-6">
              Update password
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { changePassword } from '../../services/authService.js'

export default function SetNewPassword() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!password || password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    if (confirm !== password) {
      nextErrors.confirm = 'Passwords do not match.'
    }
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
     await changePassword({ newPassword: password })
      updateUser({ mustChangePassword: false })
      navigate(`/${user.role}/dashboard`, { replace: true })
    } catch (err) {
      setSubmitError(err.message || 'Unable to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <span className="font-display text-xl font-medium text-ink">SmartHR</span>
        <h1 className="mt-4 font-display text-2xl font-medium text-ink">Set a new password</h1>
        <p className="mt-1 text-sm text-slate-soft">
          For security, choose your own password before continuing.
        </p>

        {submitError && (
          <div role="alert" className="mt-5 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Input id="new-password" type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <Input id="confirm-password" type="password" label="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
          <Button type="submit" loading={loading}>Set password &amp; continue</Button>
        </form>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { validateLogin } from '../../utils/validators.js'
import { login } from '../../services/authService.js'

/**
 * Shared login form logic for all three roles. Each role page (AdminLogin,
 * ManagerLogin, EmployeeLogin) just supplies `role` and `accent` — this is
 * where validation, submit, loading, and error-state actually live, so
 * fixing a bug here fixes it for all three portals at once.
 */
export default function LoginForm({ role, accent, dashboardPath }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    // Clear a field's error the moment the user starts fixing it.
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateLogin(form)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const { token, user } = await login({ ...form, role })
      const storage = form.remember ? localStorage : sessionStorage
      storage.setItem('smarthr_token', token)
      storage.setItem('smarthr_user', JSON.stringify(user))
      navigate(dashboardPath, { replace: true })
    } catch (err) {
      setSubmitError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="font-display text-2xl font-medium text-ink">Sign in</h2>
      <p className="mt-1 text-sm text-slate-soft">
        Enter your credentials to access your {role} dashboard.
      </p>

      {submitError && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-black/20 text-brand-700 focus:ring-brand-500/30"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium" style={{ color: accent }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} accent={accent}>
          Sign in
        </Button>
      </form>
    </>
  )
}

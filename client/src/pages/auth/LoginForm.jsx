import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { validateLogin } from '../../utils/validators.js'
import { login as loginRequest } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginForm({ role, accent, dashboardPath }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    const newValue = type === 'checkbox' ? checked : value

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }

    // Clear server error when user starts editing
    if (submitError) {
      setSubmitError('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    console.log('Login form submitted')
    console.log('Email:', form.email)
    console.log('Password:', form.password)
    console.log('Role:', role)

    // Validate form
    const nextErrors = validateLogin(form)

    console.log('Validation errors:', nextErrors)

    setErrors(nextErrors)
    setSubmitError('')

    // Stop if validation fails
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      console.log('Sending login request...')

      const { token, user } = await loginRequest({
        email: form.email.trim(),
        password: form.password,
        role,
      })

      console.log('Login successful:', user)

      // Save authentication information
      login(token, user, form.remember)

      // A forced password change takes priority over any other redirect —
      // even if ProtectedRoute sent them here from a specific page.
      if (user.mustChangePassword) {
        navigate('/set-password', { replace: true })
        return
      }

      // Redirect user
      const redirectTo =
        location.state?.from?.pathname || dashboardPath

      navigate(redirectTo, {
        replace: true,
      })
    } catch (err) {
      console.error('Login failed:', err)

      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to sign in. Please check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="font-display text-2xl font-medium text-ink">
        Sign in
      </h2>

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

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-4"
      >
        {/* Email */}
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

        {/* Password */}
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

        {/* Remember me + Forgot password */}
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

          <Link
            to="/forgot-password"
            className="font-medium"
            style={{ color: accent }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign in button */}
        <Button
          type="submit"
          loading={loading}
          accent={accent}
        >
          Sign in
        </Button>
      </form>
    </>
  )
}
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'

/**
 * Standalone reset-request page linked from every login form.
 * Wiring to a real "send reset email" endpoint happens alongside the rest
 * of auth in Phase 4 — the UI and validation are complete now.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <span className="font-display text-xl font-medium text-ink">SmartHR</span>

        {sent ? (
          <div className="mt-6 rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm text-ink">
            If an account exists for <strong>{email}</strong>, a reset link is on its way.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <p className="text-sm text-slate-soft">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <Input
              id="reset-email"
              type="email"
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Send reset link</Button>
          </form>
        )}

        <Link to="/" className="mt-6 inline-block text-sm font-medium text-brand-700">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}

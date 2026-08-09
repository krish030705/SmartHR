import { Link } from 'react-router-dom'

const ROLES = [
  { key: 'admin', label: 'Admin / HR', path: '/login/admin', accent: '#1B4B43', bg: '#EAF2EF' },
  { key: 'manager', label: 'Manager', path: '/login/manager', accent: '#5B4B8A', bg: '#EFEDF6' },
  { key: 'employee', label: 'Employee', path: '/login/employee', accent: '#B2562F', bg: '#F7EBE3' },
]

export default function RoleSelect() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <span className="font-display text-2xl font-medium text-ink">SmartHR</span>
      <p className="mt-1 text-sm text-slate-soft">Choose how you'd like to sign in.</p>

      <div className="mt-8 grid w-full max-w-md gap-3">
        {ROLES.map((r) => (
          <Link
            key={r.key}
            to={r.path}
            className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-5 py-4 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <span className="font-medium text-ink">{r.label}</span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: r.bg, color: r.accent }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PlaceholderDashboard({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(`/login/${role}`, { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <span className="font-display text-2xl font-medium text-ink">
        Welcome{user?.name ? `, ${user.name}` : ''}
      </span>
      <p className="mt-2 text-sm capitalize text-slate-soft">{role} dashboard — coming in a later phase.</p>
      <button
        onClick={handleLogout}
        className="mt-6 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:bg-black/5"
      >
        Log out
      </button>
    </div>
  )
}
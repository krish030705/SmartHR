import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import NotificationBell from './NotificationBell.jsx'

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(`/login/${user?.role || 'admin'}`, { replace: true })
  }

  const initials = (user?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ink lg:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="font-display text-lg font-medium text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-700">
            {initials}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-ink">{user?.name}</p>
            <p className="text-xs capitalize leading-tight text-slate-soft">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-sm font-medium text-ink hover:bg-black/5"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}
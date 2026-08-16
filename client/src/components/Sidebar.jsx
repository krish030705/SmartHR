import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, CalendarCheck,
  CalendarClock, Wallet, PartyPopper, Bell, Settings,
} from 'lucide-react'

const ROLE_ACCENT = {
  admin: '#1B4B43',
  manager: '#5B4B8A',
  employee: '#B2562F',
}

// enabled: false items are modules not built yet. Shown greyed-out with a
// "Soon" badge rather than omitted or linked to a dead page.
const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Employees', path: '/admin/employees', icon: Users, enabled: true },
  { label: 'Departments', path: '/admin/departments', icon: Building2, enabled: true },
 { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck, enabled: true },,
  { label: 'Leave', icon: CalendarClock, enabled: false },
  { label: 'Payroll', icon: Wallet, enabled: false },
  { label: 'Holidays', icon: PartyPopper, enabled: false },
  { label: 'Notifications', icon: Bell, enabled: false },
  { label: 'Settings', icon: Settings, enabled: false },
]

const NAV_BY_ROLE = { admin: ADMIN_NAV }

export default function Sidebar({ role }) {
  const items = NAV_BY_ROLE[role] || ADMIN_NAV
  const accent = ROLE_ACCENT[role] ?? ROLE_ACCENT.admin

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="font-display text-xl font-medium text-ink">SmartHR</span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon
          if (!item.enabled) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-soft/70"
                title="Coming in a later phase"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  Soon
                </span>
              </div>
            )
          }
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-paper' : 'text-ink hover:bg-black/5'
                }`
              }
              style={({ isActive }) => (isActive ? { backgroundColor: accent } : undefined)}
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
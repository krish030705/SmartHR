import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import CheckInOutCard from '../../components/CheckInOutCard.jsx'

export default function EmployeeDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout role="employee" title="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-xl font-medium text-ink">
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-1 text-sm text-slate-soft">Here's your attendance for today.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CheckInOutCard />
        </div>
      </div>
    </DashboardLayout>
  )
}
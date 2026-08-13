import { useEffect, useState } from 'react'
import { Users, UserCog, Building2, CalendarCheck } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import DashboardCard from '../../components/DashboardCard.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { fetchAdminStats } from '../../services/dashboardService.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Unable to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="admin" title="Dashboard">
      {loading && (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size={28} className="text-brand-700" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard label="Total Employees" value={stats.totalEmployees} icon={Users} accent="#1B4B43" accentSoft="#EAF2EF" />
            <DashboardCard label="Total Managers" value={stats.totalManagers} icon={UserCog} accent="#5B4B8A" accentSoft="#EFEDF6" />
            <DashboardCard label="Departments" value={stats.totalDepartments} icon={Building2} accent="#B2562F" accentSoft="#F7EBE3" />
            <DashboardCard label="Pending Leave Requests" value={stats.pendingLeaveRequests} icon={CalendarCheck} accent="#C9832A" accentSoft="#FBF1E1" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
              <h2 className="font-display text-base font-medium text-ink">Attendance Overview</h2>
              <div className="mt-4">
                <EmptyState title="No attendance data yet" description="This fills in once the Attendance module is built." />
              </div>
            </div>

            <div className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
              <h2 className="font-display text-base font-medium text-ink">Recent Activities</h2>
              <div className="mt-4">
                {stats.recentActivities.length === 0 ? (
                  <EmptyState title="No activity yet" description="Actions like new hires and leave approvals will show up here." />
                ) : (
                  <ul className="divide-y divide-black/5">
                    {stats.recentActivities.map((activity) => (
                      <li key={activity.id} className="py-2.5 text-sm text-ink">{activity.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
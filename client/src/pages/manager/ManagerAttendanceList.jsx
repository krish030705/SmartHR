import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { fetchTeamAttendance } from '../../services/attendanceService.js'

const STATUS_STYLES = {
  Present: 'bg-emerald-50 text-emerald-700',
  Late: 'bg-amber-50 text-amber-700',
  Absent: 'bg-red-50 text-red-700',
  'Half Day': 'bg-blue-50 text-blue-700',
  Leave: 'bg-slate-100 text-slate-600',
}

function formatTime(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ManagerAttendanceList() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeamAttendance()
      .then(setRecords)
      .catch((err) => setError(err.message || 'Unable to load team attendance.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="manager" title="Attendance">
      <div className="rounded-xl border border-black/5 bg-white shadow-card">
        {loading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size={28} className="text-brand-700" />
          </div>
        )}

        {!loading && error && <div className="p-6 text-sm text-danger">{error}</div>}

        {!loading && !error && records.length === 0 && (
          <div className="p-6">
            <EmptyState title="No team attendance yet" description="Records for your direct reports will show up here once they check in." />
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-slate-soft">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Check In</th>
                <th className="px-5 py-3 font-medium">Check Out</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-ink">{r.employee?.name || '—'}</td>
                  <td className="px-5 py-3 text-ink">{formatDate(r.date)}</td>
                  <td className="px-5 py-3 text-ink">{formatTime(r.checkIn)}</td>
                  <td className="px-5 py-3 text-ink">{formatTime(r.checkOut)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.status] || 'bg-slate-100 text-slate-600'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
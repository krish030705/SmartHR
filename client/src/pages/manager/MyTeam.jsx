import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import apiClient from '../../services/apiClient.js'

const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700',
  Inactive: 'bg-slate-100 text-slate-600',
  'On Leave': 'bg-amber-50 text-amber-700',
  Terminated: 'bg-red-50 text-red-700',
}

export default function MyTeam() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient.get('/team')
      .then(({ data }) => setTeam(data.team))
      .catch((err) => setError(err.message || 'Unable to load your team.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="manager" title="My Team">
      <div className="rounded-xl border border-black/5 bg-white shadow-card">
        {loading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size={28} className="text-brand-700" />
          </div>
        )}

        {!loading && error && <div className="p-6 text-sm text-danger">{error}</div>}

        {!loading && !error && team.length === 0 && (
          <div className="p-6">
            <EmptyState title="No team members yet" description="Employees assigned to you will show up here." />
          </div>
        )}

        {!loading && !error && team.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-slate-soft">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Position</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member._id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-ink">
                    <div>{member.name}</div>
                    <div className="text-xs text-slate-soft">{member.employeeId}</div>
                  </td>
                  <td className="px-5 py-3 text-ink">{member.position}</td>
                  <td className="px-5 py-3 text-ink">{member.department?.name || '—'}</td>
                  <td className="px-5 py-3 text-ink">
                    <div>{member.email}</div>
                    <div className="text-xs text-slate-soft">{member.phone}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[member.employmentStatus] || 'bg-slate-100 text-slate-600'}`}>
                      {member.employmentStatus}
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
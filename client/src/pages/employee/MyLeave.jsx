import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LeaveApplyForm from '../../components/leave/LeaveApplyForm.jsx'
import { fetchMyLeave } from '../../services/leaveService.js'

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-700',
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MyLeave() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  function load() {
    setLoading(true)
    fetchMyLeave()
      .then(setLeaves)
      .catch((err) => setError(err.message || 'Unable to load leave requests.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <DashboardLayout role="employee" title="My Leave">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setFormOpen(true)} className="w-auto px-5">
            Apply for Leave
          </Button>
        </div>

        <div className="rounded-xl border border-black/5 bg-white shadow-card">
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size={28} className="text-brand-700" />
            </div>
          )}

          {!loading && error && <div className="p-6 text-sm text-danger">{error}</div>}

          {!loading && !error && leaves.length === 0 && (
            <div className="p-6">
              <EmptyState title="No leave requests yet" description="Requests you apply for will show up here." />
            </div>
          )}

          {!loading && !error && leaves.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 text-slate-soft">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Dates</th>
                  <th className="px-5 py-3 font-medium">Days</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 text-ink">{l.leaveType}</td>
                    <td className="px-5 py-3 text-ink">{formatDate(l.startDate)} – {formatDate(l.endDate)}</td>
                    <td className="px-5 py-3 text-ink">{l.days}</td>
                    <td className="px-5 py-3 text-ink">{l.reason}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[l.status] || 'bg-slate-100 text-slate-600'}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <LeaveApplyForm open={formOpen} onClose={() => setFormOpen(false)} onApplied={load} />
    </DashboardLayout>
  )
}
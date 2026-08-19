import { useState } from 'react'
import LoadingSpinner from '../LoadingSpinner.jsx'
import EmptyState from '../EmptyState.jsx'
import { approveLeave, rejectLeave } from '../../services/leaveService.js'

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-700',
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function LeaveQueue({ leaves, loading, error, onChanged }) {
  const [actioningId, setActioningId] = useState(null)
  const [actionError, setActionError] = useState('')

  async function handleApprove(id) {
    setActioningId(id)
    setActionError('')
    try {
      await approveLeave(id)
      onChanged()
    } catch (err) {
      setActionError(err.message || 'Unable to approve this request.')
    } finally {
      setActioningId(null)
    }
  }

  async function handleReject(id) {
    setActioningId(id)
    setActionError('')
    try {
      await rejectLeave(id)
      onChanged()
    } catch (err) {
      setActionError(err.message || 'Unable to reject this request.')
    } finally {
      setActioningId(null)
    }
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white shadow-card">
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size={28} className="text-brand-700" />
        </div>
      )}

      {!loading && error && <div className="p-6 text-sm text-danger">{error}</div>}

      {!loading && !error && leaves.length === 0 && (
        <div className="p-6">
          <EmptyState title="No leave requests" description="Requests will show up here once submitted." />
        </div>
      )}

      {!loading && !error && leaves.length > 0 && (
        <>
          {actionError && (
            <div className="border-b border-black/5 px-5 py-3 text-sm text-danger">{actionError}</div>
          )}
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-slate-soft">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Days</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-ink">{l.employee?.name || '—'}</td>
                  <td className="px-5 py-3 text-ink">{l.leaveType}</td>
                  <td className="px-5 py-3 text-ink">{formatDate(l.startDate)} – {formatDate(l.endDate)}</td>
                  <td className="px-5 py-3 text-ink">{l.days}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[l.status] || 'bg-slate-100 text-slate-600'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {l.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(l._id)}
                          disabled={actioningId === l._id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(l._id)}
                          disabled={actioningId === l._id}
                          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/5 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-soft">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
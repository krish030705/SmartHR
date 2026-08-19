import { useEffect, useState } from 'react'
import LoadingSpinner from '../LoadingSpinner.jsx'
import EmptyState from '../EmptyState.jsx'
import { fetchHolidays, deleteHoliday } from '../../services/holidayService.js'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

export default function HolidayList({ canManage = false, onEdit }) {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  function load() {
    setLoading(true)
    fetchHolidays()
      .then(setHolidays)
      .catch((err) => setError(err.message || 'Unable to load holidays.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteHoliday(id)
      load()
    } catch (err) {
      setError(err.message || 'Unable to delete holiday.')
    } finally {
      setDeletingId(null)
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

      {!loading && !error && holidays.length === 0 && (
        <div className="p-6">
          <EmptyState title="No holidays added yet" description="Company holidays will show up here." />
        </div>
      )}

      {!loading && !error && holidays.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-slate-soft">
              <th className="px-5 py-3 font-medium">Holiday</th>
              <th className="px-5 py-3 font-medium">Date</th>
              {canManage && <th className="px-5 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h._id} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3 text-ink">{h.name}</td>
                <td className="px-5 py-3 text-ink">{formatDate(h.date)}</td>
                {canManage && (
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => onEdit(h)} className="text-xs font-medium text-brand-700 hover:underline">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(h._id)}
                        disabled={deletingId === h._id}
                        className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
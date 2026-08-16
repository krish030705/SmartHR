import { useEffect, useState } from 'react'
import { CheckCircle2, LogIn, LogOut } from 'lucide-react'
import { checkIn, checkOut, fetchMyAttendance } from '../services/attendanceService.js'

function formatTime(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function CheckInOutCard() {
  const [today, setToday] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  function loadToday() {
    setLoading(true)
    fetchMyAttendance()
      .then((records) => {
        const todayStr = new Date().toDateString()
        const match = records.find((r) => new Date(r.date).toDateString() === todayStr)
        setToday(match || null)
      })
      .catch((err) => setError(err.message || 'Unable to load attendance.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadToday()
  }, [])

  async function handleCheckIn() {
    setActionLoading(true)
    setError('')
    try {
      const record = await checkIn()
      setToday(record)
    } catch (err) {
      setError(err.message || 'Unable to check in.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCheckOut() {
    setActionLoading(true)
    setError('')
    try {
      const record = await checkOut()
      setToday(record)
    } catch (err) {
      setError(err.message || 'Unable to check out.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
      <h2 className="font-display text-base font-medium text-ink">Today's Attendance</h2>

      {loading && <p className="mt-3 text-sm text-slate-soft">Loading…</p>}

      {!loading && (
        <div className="mt-4 space-y-3">
          {today?.checkIn && (
            <div className="flex items-center gap-2 text-sm text-ink">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Checked in at {formatTime(today.checkIn)}
              {today.status && (
                <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {today.status}
                </span>
              )}
            </div>
          )}

          {today?.checkOut && (
            <div className="flex items-center gap-2 text-sm text-ink">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Checked out at {formatTime(today.checkOut)}
            </div>
          )}

          {!today?.checkIn && (
            <p className="text-sm text-slate-soft">You haven't checked in today.</p>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex gap-3 pt-1">
            {!today?.checkIn && (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700/90 disabled:opacity-50"
              >
                <LogIn size={16} />
                Check In
              </button>
            )}
            {today?.checkIn && !today?.checkOut && (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:bg-black/5 disabled:opacity-50"
              >
                <LogOut size={16} />
                Check Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
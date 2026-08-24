import { useEffect, useState } from 'react'
import LeaveQueue from '../../components/leave/LeaveQueue.jsx'
import { fetchTeamLeave } from '../../services/leaveService.js'

export default function ManagerLeaveSection() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    fetchTeamLeave()
      .then(setLeaves)
      .catch((err) => setError(err.message || 'Unable to load leave requests.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <h2 className="font-display text-base font-medium text-ink mb-3">Team Leave Requests</h2>
      <LeaveQueue leaves={leaves} loading={loading} error={error} onChanged={load} />
    </div>
  )
}
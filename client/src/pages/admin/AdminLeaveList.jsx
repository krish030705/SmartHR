import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import LeaveQueue from '../../components/leave/LeaveQueue.jsx'
import { fetchAllLeave } from '../../services/leaveService.js'

export default function AdminLeaveList() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    fetchAllLeave()
      .then(setLeaves)
      .catch((err) => setError(err.message || 'Unable to load leave requests.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <DashboardLayout role="admin" title="Leave">
      <LeaveQueue leaves={leaves} loading={loading} error={error} onChanged={load} />
    </DashboardLayout>
  )
}
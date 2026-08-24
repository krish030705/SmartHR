import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { fetchMyPayroll } from '../../services/payrollService.js'

const STATUS_STYLES = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Unpaid: 'bg-amber-50 text-amber-700',
}

export default function MySalary() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyPayroll()
      .then(setRecords)
      .catch((err) => setError(err.message || 'Unable to load salary information.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="employee" title="My Salary">
      <div className="rounded-xl border border-black/5 bg-white shadow-card">
        {loading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size={28} className="text-brand-700" />
          </div>
        )}

        {!loading && error && <div className="p-6 text-sm text-danger">{error}</div>}

        {!loading && !error && records.length === 0 && (
          <div className="p-6">
            <EmptyState title="No payslips yet" description="Your monthly payslips will appear here once payroll is generated." />
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-slate-soft">
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Basic</th>
                <th className="px-5 py-3 font-medium">Allowances</th>
                <th className="px-5 py-3 font-medium">Deductions</th>
                <th className="px-5 py-3 font-medium">Net</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-ink">{r.month}</td>
                  <td className="px-5 py-3 text-ink">₹{r.basicSalary.toLocaleString()}</td>
                  <td className="px-5 py-3 text-ink">₹{r.allowances.toLocaleString()}</td>
                  <td className="px-5 py-3 text-ink">₹{r.deductions.toLocaleString()}</td>
                  <td className="px-5 py-3 font-medium text-ink">₹{r.netSalary.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                      {r.paymentStatus}
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
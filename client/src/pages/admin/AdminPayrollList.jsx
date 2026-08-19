import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import PayrollEditModal from '../../components/payroll/PayrollEditModal.jsx'
import { fetchPayroll, generatePayroll } from '../../services/payrollService.js'

const STATUS_STYLES = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Unpaid: 'bg-amber-50 text-amber-700',
}

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function AdminPayrollList() {
  const [month, setMonth] = useState(currentMonth())
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateMessage, setGenerateMessage] = useState('')
  const [editRecord, setEditRecord] = useState(null)

  function load() {
    setLoading(true)
    fetchPayroll({ month })
      .then(setRecords)
      .catch((err) => setError(err.message || 'Unable to load payroll.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [month])

  async function handleGenerate() {
    setGenerating(true)
    setGenerateMessage('')
    try {
      const result = await generatePayroll(month)
      setGenerateMessage(result.message)
      load()
    } catch (err) {
      setGenerateMessage(err.message || 'Unable to generate payroll.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <DashboardLayout role="admin" title="Payroll">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-card">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-700/30"
          />
          <Button onClick={handleGenerate} loading={generating} className="w-auto px-5">
            Generate Payroll
          </Button>
          {generateMessage && <span className="text-sm text-slate-soft">{generateMessage}</span>}
        </div>

        <div className="rounded-xl border border-black/5 bg-white shadow-card">
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size={28} className="text-brand-700" />
            </div>
          )}

          {!loading && error && <div className="p-6 text-sm text-danger">{error}</div>}

          {!loading && !error && records.length === 0 && (
            <div className="p-6">
              <EmptyState title="No payroll records" description="Click 'Generate Payroll' to create records for this month." />
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 text-slate-soft">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Basic</th>
                  <th className="px-5 py-3 font-medium">Allowances</th>
                  <th className="px-5 py-3 font-medium">Deductions</th>
                  <th className="px-5 py-3 font-medium">Net</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 text-ink">{r.employee?.name || '—'}</td>
                    <td className="px-5 py-3 text-ink">₹{r.basicSalary.toLocaleString()}</td>
                    <td className="px-5 py-3 text-ink">₹{r.allowances.toLocaleString()}</td>
                    <td className="px-5 py-3 text-ink">₹{r.deductions.toLocaleString()}</td>
                    <td className="px-5 py-3 font-medium text-ink">₹{r.netSalary.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setEditRecord(r)}
                        className="text-xs font-medium text-brand-700 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <PayrollEditModal
        open={Boolean(editRecord)}
        onClose={() => setEditRecord(null)}
        record={editRecord}
        onSaved={load}
      />
    </DashboardLayout>
  )
}
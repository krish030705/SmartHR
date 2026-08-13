import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import Tabs from '../../../components/Tabs.jsx'
import EmptyState from '../../../components/EmptyState.jsx'
import LoadingSpinner from '../../../components/LoadingSpinner.jsx'
import ConfirmDialog from '../../../components/ConfirmDialog.jsx'
import EmployeeFormModal from './EmployeeFormModal.jsx'
import { getEmployee, deleteEmployee } from '../../../services/employeeService.js'
import { listDepartments } from '../../../services/departmentService.js'

const STATUS_STYLES = {
  Active: 'bg-success/10 text-success',
  'On Leave': 'bg-amber-500/15 text-amber-600',
  Inactive: 'bg-black/5 text-slate-soft',
  Terminated: 'bg-danger/10 text-danger',
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-soft">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value || '—'}</p>
    </div>
  )
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave History' },
  { key: 'salary', label: 'Salary' },
]

export default function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    setError('')
    getEmployee(id)
      .then(setEmployee)
      .catch((err) => setError(err.message || 'Unable to load this employee.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])
  useEffect(() => {
    listDepartments().then(setDepartments).catch(() => {})
  }, [])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteEmployee(id)
      navigate('/admin/employees', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to delete employee.')
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <DashboardLayout role="admin" title="Employee Profile">
      <Link to="/admin/employees" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-soft hover:text-ink">
        <ArrowLeft size={15} />
        Back to Employees
      </Link>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size={28} className="text-brand-700" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {!loading && !error && employee && (
        <>
          <div className="mb-5 flex flex-col gap-4 rounded-xl border border-black/5 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 font-display text-xl text-brand-700">
                {employee.name?.[0]}
              </div>
              <div>
                <h2 className="font-display text-lg font-medium text-ink">{employee.name}</h2>
                <p className="text-sm text-slate-soft">{employee.position} · {employee.department?.name}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[employee.employmentStatus] || ''}`}>
                  {employee.employmentStatus}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-ink hover:bg-black/5">
                <Pencil size={15} />
                Edit
              </button>
              <button onClick={() => setDeleteOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-danger/20 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/5">
                <Trash2 size={15} />
                Remove
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-white shadow-card">
            <div className="px-5 pt-3">
              <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
            </div>

            <div className="p-5">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Employee ID" value={employee.employeeId} />
                  <Field label="Email" value={employee.email} />
                  <Field label="Phone" value={employee.phone} />
                  <Field label="Gender" value={employee.gender} />
                  <Field label="Date of birth" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : ''} />
                  <Field label="Address" value={employee.address} />
                  <Field label="Department" value={employee.department?.name} />
                  <Field label="Position" value={employee.position} />
                  <Field label="Joining date" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : ''} />
                  <Field label="Manager" value={employee.manager?.name} />
                </div>
              )}

              {activeTab === 'attendance' && (
                <EmptyState title="No attendance history yet" description="This fills in once the Attendance module is built (Phase 10)." />
              )}

              {activeTab === 'leave' && (
                <EmptyState title="No leave history yet" description="This fills in once the Leave Management module is built (Phase 11)." />
              )}

              {activeTab === 'salary' && (
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Annual salary" value={employee.salary ? `₹${Number(employee.salary).toLocaleString('en-IN')}` : ''} />
                  <Field label="Monthly (approx.)" value={employee.salary ? `₹${Math.round(Number(employee.salary) / 12).toLocaleString('en-IN')}` : ''} />
                </div>
              )}
            </div>
          </div>

          <EmployeeFormModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            employee={employee}
            departments={departments}
            onSaved={() => { setEditOpen(false); load() }}
          />

          <ConfirmDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={handleDelete}
            loading={deleting}
            title="Remove employee?"
            message={`This will remove ${employee.name} and deactivate their login account. This can't be undone.`}
            confirmLabel="Remove"
          />
        </>
      )}
    </DashboardLayout>
  )
}
import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import DataTable from '../../../components/DataTable.jsx'
import Pagination from '../../../components/Pagination.jsx'
import Select from '../../../components/Select.jsx'
import ConfirmDialog from '../../../components/ConfirmDialog.jsx'
import EmployeeFormModal from './EmployeeFormModal.jsx'
import EmployeeViewModal from './EmployeeViewModal.jsx'
import { listEmployees, deleteEmployee as deleteEmployeeRequest } from '../../../services/employeeService.js'
import { listDepartments } from '../../../services/departmentService.js'

const STATUS_STYLES = {
  Active: 'bg-success/10 text-success',
  'On Leave': 'bg-amber-500/15 text-amber-600',
  Inactive: 'bg-black/5 text-slate-soft',
  Terminated: 'bg-danger/10 text-danger',
}

export default function EmployeesList() {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [viewingEmployee, setViewingEmployee] = useState(null)
  const [deletingEmployee, setDeletingEmployee] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listEmployees({
        search: search || undefined,
        department: department || undefined,
        status: status || undefined,
        page,
        limit: 10,
      })
      setEmployees(data.employees)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message || 'Unable to load employees.')
    } finally {
      setLoading(false)
    }
  }, [search, department, status, page])

  useEffect(() => {
    listDepartments().then(setDepartments).catch(() => {})
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  useEffect(() => {
    setPage(1)
  }, [search, department, status])

  function openAddForm() {
    setEditingEmployee(null)
    setFormOpen(true)
  }

  function openEditForm(employee) {
    setEditingEmployee(employee)
    setFormOpen(true)
  }

  function handleSaved({ keepOpen } = {}) {
    loadEmployees()
    if (!keepOpen) setFormOpen(false)
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteEmployeeRequest(deletingEmployee._id)
      setDeletingEmployee(null)
      loadEmployees()
    } catch (err) {
      setError(err.message || 'Unable to delete employee.')
      setDeletingEmployee(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'employeeId', label: 'ID' },
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium text-ink">{row.name}</p>
          <p className="text-xs text-slate-soft">{row.email}</p>
        </div>
      ),
    },
    { key: 'department', label: 'Department', render: (row) => row.department?.name || '—' },
    { key: 'position', label: 'Position' },
    {
      key: 'employmentStatus',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.employmentStatus] || ''}`}>
          {row.employmentStatus}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => setViewingEmployee(row)} className="rounded-lg p-1.5 text-slate-soft hover:bg-black/5 hover:text-ink" title="View">
            <Eye size={16} />
          </button>
          <button onClick={() => openEditForm(row)} className="rounded-lg p-1.5 text-slate-soft hover:bg-black/5 hover:text-ink" title="Edit">
            <Pencil size={16} />
          </button>
          <button onClick={() => setDeletingEmployee(row)} className="rounded-lg p-1.5 text-slate-soft hover:bg-danger/10 hover:text-danger" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout role="admin" title="Employees">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-soft" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID"
              className="input-base pl-9"
            />
          </div>
          <Select
            id="filter-department" label="" value={department} onChange={(e) => setDepartment(e.target.value)}
            placeholder="All departments"
            options={departments.map((d) => ({ value: d._id, label: d.name }))}
            className="sm:w-48"
          />
          <Select
            id="filter-status" label="" value={status} onChange={(e) => setStatus(e.target.value)}
            placeholder="All statuses"
            options={[
              { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' },
              { value: 'On Leave', label: 'On Leave' }, { value: 'Terminated', label: 'Terminated' },
            ]}
            className="sm:w-40"
          />
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-paper hover:bg-brand-900"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <DataTable
        columns={columns}
        rows={employees}
        loading={loading}
        emptyTitle={search || department || status ? 'No matching employees' : 'No employees yet'}
        emptyDescription={search || department || status ? 'Try adjusting your search or filters.' : 'Add your first employee to get started.'}
      />

      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} />

      <EmployeeFormModal open={formOpen} onClose={() => setFormOpen(false)} employee={editingEmployee} departments={departments} onSaved={handleSaved} />
      <EmployeeViewModal open={Boolean(viewingEmployee)} onClose={() => setViewingEmployee(null)} employee={viewingEmployee} />
      <ConfirmDialog
        open={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove employee?"
        message={`This will remove ${deletingEmployee?.name || 'this employee'} and deactivate their login account. This can't be undone.`}
        confirmLabel="Remove"
      />
    </DashboardLayout>
  )
}
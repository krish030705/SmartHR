import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import DataTable from '../../../components/DataTable.jsx'
import ConfirmDialog from '../../../components/ConfirmDialog.jsx'
import DepartmentFormModal from './DepartmentFormModal.jsx'
import { listDepartments, deleteDepartment as deleteDepartmentRequest } from '../../../services/departmentService.js'

export default function DepartmentsList() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [deletingDept, setDeletingDept] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    listDepartments()
      .then(setDepartments)
      .catch((err) => setError(err.message || 'Unable to load departments.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  function openAddForm() {
    setEditingDept(null)
    setFormOpen(true)
  }

  function openEditForm(dept) {
    setEditingDept(dept)
    setFormOpen(true)
  }

  function handleSaved() {
    setFormOpen(false)
    load()
  }

  function openDeleteConfirm(dept) {
    setDeleteError('')
    setDeletingDept(dept)
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteDepartmentRequest(deletingDept._id)
      setDeletingDept(null)
      load()
    } catch (err) {
      setDeleteError(err.message || 'Unable to delete department.')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Department' },
    {
      key: 'employeeCount',
      label: 'Employees',
      render: (row) => (
        <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-ink">
          {row.employeeCount}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => openEditForm(row)} className="rounded-lg p-1.5 text-slate-soft hover:bg-black/5 hover:text-ink" title="Edit">
            <Pencil size={16} />
          </button>
          <button onClick={() => openDeleteConfirm(row)} className="rounded-lg p-1.5 text-slate-soft hover:bg-danger/10 hover:text-danger" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout role="admin" title="Departments">
      <div className="mb-4 flex justify-end">
        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-paper hover:bg-brand-900"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <DataTable
        columns={columns}
        rows={departments}
        loading={loading}
        emptyTitle="No departments yet"
        emptyDescription="Add your first department to start assigning employees to it."
      />

      <DepartmentFormModal open={formOpen} onClose={() => setFormOpen(false)} department={editingDept} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(deletingDept)}
        onClose={() => setDeletingDept(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove department?"
        message={deleteError || `This will permanently remove "${deletingDept?.name}". This can't be undone.`}
        confirmLabel="Remove"
      />
    </DashboardLayout>
  )
}
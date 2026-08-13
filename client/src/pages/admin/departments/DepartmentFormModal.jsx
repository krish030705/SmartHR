import { useEffect, useState } from 'react'
import Modal from '../../../components/Modal.jsx'
import Input from '../../../components/Input.jsx'
import Button from '../../../components/Button.jsx'
import { createDepartment, updateDepartment } from '../../../services/departmentService.js'

export default function DepartmentFormModal({ open, onClose, department, onSaved }) {
  const isEdit = Boolean(department)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(department?.name || '')
    setError('')
    setSubmitError('')
  }, [open, department])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Department name is required.')
      return
    }
    setError('')
    setSubmitError('')
    setSaving(true)
    try {
      if (isEdit) {
        await updateDepartment(department._id, name)
      } else {
        await createDepartment(name)
      }
      onSaved()
    } catch (err) {
      setSubmitError(err.message || 'Unable to save department. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Department' : 'Add Department'} size="sm">
      {submitError && (
        <div role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="department-name"
          label="Department name"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          error={error}
          placeholder="e.g. Customer Success"
        />
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            Cancel
          </button>
          <Button type="submit" loading={saving} className="w-auto px-6">
            {isEdit ? 'Save changes' : 'Add department'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
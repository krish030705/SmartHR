import { useState } from 'react'
import Modal from '../Modal.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Button from '../Button.jsx'
import { applyLeave } from '../../services/leaveService.js'

const EMPTY_FORM = { leaveType: '', startDate: '', endDate: '', reason: '' }

export default function LeaveApplyForm({ open, onClose, onApplied }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.leaveType) errs.leaveType = 'Leave type is required.'
    if (!form.startDate) errs.startDate = 'Start date is required.'
    if (!form.endDate) errs.endDate = 'End date is required.'
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.endDate = 'End date cannot be before start date.'
    }
    if (!form.reason.trim()) errs.reason = 'Reason is required.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await applyLeave(form)
      setForm(EMPTY_FORM)
      onApplied()
      onClose()
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit leave request.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Apply for Leave" size="md">
      {submitError && (
        <div role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Select
          id="leaveType" name="leaveType" label="Leave type" value={form.leaveType} onChange={handleChange}
          error={errors.leaveType} placeholder="Select leave type"
          options={[
            { value: 'Sick Leave', label: 'Sick Leave' },
            { value: 'Casual Leave', label: 'Casual Leave' },
            { value: 'Earned Leave', label: 'Earned Leave' },
            { value: 'Unpaid Leave', label: 'Unpaid Leave' },
          ]}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="startDate" name="startDate" type="date" label="Start date" value={form.startDate} onChange={handleChange} error={errors.startDate} />
          <Input id="endDate" name="endDate" type="date" label="End date" value={form.endDate} onChange={handleChange} error={errors.endDate} />
        </div>
        <Input id="reason" name="reason" label="Reason" value={form.reason} onChange={handleChange} error={errors.reason} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            Cancel
          </button>
          <Button type="submit" loading={saving} className="w-auto px-6">
            Submit request
          </Button>
        </div>
      </form>
    </Modal>
  )
}
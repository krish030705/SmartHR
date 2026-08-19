import { useEffect, useState } from 'react'
import Modal from '../Modal.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Button from '../Button.jsx'
import { updatePayroll } from '../../services/payrollService.js'

export default function PayrollEditModal({ open, onClose, record, onSaved }) {
  const [form, setForm] = useState({ allowances: 0, deductions: 0, paymentStatus: 'Unpaid' })
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !record) return
    setForm({
      allowances: record.allowances,
      deductions: record.deductions,
      paymentStatus: record.paymentStatus,
    })
    setSubmitError('')
  }, [open, record])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const previewNet = record
    ? record.basicSalary + Number(form.allowances || 0) - Number(form.deductions || 0)
    : 0

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSubmitError('')
    try {
      await updatePayroll(record._id, {
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
        paymentStatus: form.paymentStatus,
      })
      onSaved()
      onClose()
    } catch (err) {
      setSubmitError(err.message || 'Unable to update payroll record.')
    } finally {
      setSaving(false)
    }
  }

  if (!record) return null

  return (
    <Modal open={open} onClose={onClose} title={`Edit Payroll — ${record.employee?.name || ''}`} size="md">
      {submitError && (
        <div role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <p className="text-sm text-slate-soft">Basic salary: ₹{record.basicSalary.toLocaleString()}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="allowances" name="allowances" type="number" label="Allowances (₹)" value={form.allowances} onChange={handleChange} />
          <Input id="deductions" name="deductions" type="number" label="Deductions (₹)" value={form.deductions} onChange={handleChange} />
        </div>
        <Select
          id="paymentStatus" name="paymentStatus" label="Payment status" value={form.paymentStatus} onChange={handleChange}
          options={[{ value: 'Unpaid', label: 'Unpaid' }, { value: 'Paid', label: 'Paid' }]}
        />
        <p className="text-sm font-medium text-ink">Net salary: ₹{previewNet.toLocaleString()}</p>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            Cancel
          </button>
          <Button type="submit" loading={saving} className="w-auto px-6">
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
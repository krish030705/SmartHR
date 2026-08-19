import { useEffect, useState } from 'react'
import Modal from '../Modal.jsx'
import Input from '../Input.jsx'
import Button from '../Button.jsx'
import { createHoliday, updateHoliday } from '../../services/holidayService.js'

const EMPTY_FORM = { name: '', date: '' }

export default function HolidayFormModal({ open, onClose, holiday, onSaved }) {
  const isEdit = Boolean(holiday)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSubmitError('')
    if (holiday) {
      setForm({ name: holiday.name, date: holiday.date.slice(0, 10) })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, holiday])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Holiday name is required.'
    if (!form.date) errs.date = 'Date is required.'
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
      if (isEdit) {
        await updateHoliday(holiday._id, form)
      } else {
        await createHoliday(form)
      }
      onSaved()
      onClose()
    } catch (err) {
      setSubmitError(err.message || 'Unable to save holiday.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Holiday' : 'Add Holiday'} size="sm">
      {submitError && (
        <div role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input id="name" name="name" label="Holiday name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input id="date" name="date" type="date" label="Date" value={form.date} onChange={handleChange} error={errors.date} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            Cancel
          </button>
          <Button type="submit" loading={saving} className="w-auto px-6">
            {isEdit ? 'Save changes' : 'Add holiday'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
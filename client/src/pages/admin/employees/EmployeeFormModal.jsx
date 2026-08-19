import { useEffect, useState } from 'react'
import Modal from '../../../components/Modal.jsx'
import Input from '../../../components/Input.jsx'
import Select from '../../../components/Select.jsx'
import Button from '../../../components/Button.jsx'
import { validateEmployee } from '../../../utils/validators.js'
import { createEmployee, updateEmployee, fetchManagers } from '../../../services/employeeService.js'

const EMPTY_FORM = {
  name: '', email: '', phone: '', gender: '', dateOfBirth: '', address: '',
  department: '', position: '', joiningDate: '', employmentStatus: 'Active', salary: '', role: 'employee', manager: '',
}

export default function EmployeeFormModal({ open, onClose, employee, departments, onSaved }) {
  const isEdit = Boolean(employee)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [managers, setManagers] = useState([])

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSubmitError('')
    setTempPassword('')
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        gender: employee.gender || '',
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : '',
        address: employee.address || '',
        department: employee.department?._id || '',
        position: employee.position || '',
        joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : '',
        employmentStatus: employee.employmentStatus || 'Active',
        salary: employee.salary ?? '',
        role: employee.user?.role || 'employee',
        manager: employee.manager?._id || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, employee])

  useEffect(() => {
    if (!open) return
    fetchManagers().then(setManagers).catch(() => setManagers([]))
  }, [open])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateEmployee(form)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (isEdit) {
        await updateEmployee(employee._id, form)
        onSaved()
      } else {
        const { tempPassword: pwd } = await createEmployee(form)
        setTempPassword(pwd)
        onSaved({ keepOpen: true })
      }
    } catch (err) {
      setSubmitError(err.message || 'Unable to save employee. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (tempPassword) {
    return (
      <Modal open={open} onClose={onClose} title="Employee created" size="sm">
        <p className="text-sm text-ink">
          <strong>{form.name}</strong>'s account was created. Share this temporary password with
          them — it won't be shown again:
        </p>
        <p className="mt-3 rounded-lg bg-black/5 px-3 py-2 font-mono text-sm text-ink">{tempPassword}</p>
        <Button className="mt-5" onClick={onClose}>Done</Button>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Employee' : 'Add Employee'} size="lg">
      {submitError && (
        <div role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="name" name="name" label="Full name" value={form.name} onChange={handleChange} error={errors.name} />
          <Input id="email" name="email" type="email" label="Email" value={form.email} onChange={handleChange} error={errors.email} disabled={isEdit} />
          <Input id="phone" name="phone" label="Phone" value={form.phone} onChange={handleChange} error={errors.phone} />
          <Select
            id="role" name="role" label="Role" value={form.role} onChange={handleChange}
            options={[{ value: 'employee', label: 'Employee' }, { value: 'manager', label: 'Manager' }]}
            disabled={isEdit}
          />
          <Select
            id="manager" name="manager" label="Reports to" value={form.manager} onChange={handleChange}
            placeholder="No manager"
            options={managers.map((m) => ({ value: m._id, label: `${m.name} (${m.employeeId})` }))}
          />
          <Select
            id="gender" name="gender" label="Gender" value={form.gender} onChange={handleChange}
            placeholder="Select gender"
            options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]}
          />
          <Input id="dateOfBirth" name="dateOfBirth" type="date" label="Date of birth" value={form.dateOfBirth} onChange={handleChange} />
          <Select
            id="department" name="department" label="Department" value={form.department} onChange={handleChange}
            error={errors.department} placeholder="Select department"
            options={departments.map((d) => ({ value: d._id, label: d.name }))}
          />
          <Input id="position" name="position" label="Position" value={form.position} onChange={handleChange} error={errors.position} />
          <Input id="joiningDate" name="joiningDate" type="date" label="Joining date" value={form.joiningDate} onChange={handleChange} error={errors.joiningDate} />
          <Select
            id="employmentStatus" name="employmentStatus" label="Status" value={form.employmentStatus} onChange={handleChange}
            options={[
              { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' },
              { value: 'On Leave', label: 'On Leave' }, { value: 'Terminated', label: 'Terminated' },
            ]}
          />
          <Input id="salary" name="salary" type="number" label="Salary (₹/year)" value={form.salary} onChange={handleChange} error={errors.salary} />
        </div>
        <Input id="address" name="address" label="Address" value={form.address} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/5">
            Cancel
          </button>
          <Button type="submit" loading={saving} className="w-auto px-6">
            {isEdit ? 'Save changes' : 'Add employee'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
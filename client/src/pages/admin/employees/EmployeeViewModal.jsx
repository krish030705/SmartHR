import Modal from '../../../components/Modal.jsx'

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-black/5 py-2.5 text-sm last:border-0">
      <span className="text-slate-soft">{label}</span>
      <span className="font-medium text-ink">{value || '—'}</span>
    </div>
  )
}

const STATUS_STYLES = {
  Active: 'bg-success/10 text-success',
  'On Leave': 'bg-amber-500/15 text-amber-600',
  Inactive: 'bg-black/5 text-slate-soft',
  Terminated: 'bg-danger/10 text-danger',
}

export default function EmployeeViewModal({ open, onClose, employee }) {
  if (!employee) return null

  return (
    <Modal open={open} onClose={onClose} title={employee.name} size="md">
      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[employee.employmentStatus] || ''}`}>
        {employee.employmentStatus}
      </span>

      <div className="mt-4">
        <Row label="Employee ID" value={employee.employeeId} />
        <Row label="Email" value={employee.email} />
        <Row label="Phone" value={employee.phone} />
        <Row label="Gender" value={employee.gender} />
        <Row label="Department" value={employee.department?.name} />
        <Row label="Position" value={employee.position} />
        <Row label="Joining date" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : ''} />
        <Row label="Salary" value={employee.salary ? `₹${Number(employee.salary).toLocaleString('en-IN')}/year` : ''} />
        <Row label="Address" value={employee.address} />
      </div>
    </Modal>
  )
}
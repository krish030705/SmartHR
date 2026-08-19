import Payroll from '../models/Payroll.js'
import Employee from '../models/Employee.js'

function computeNet(basicSalary, allowances, deductions) {
  return basicSalary + allowances - deductions
}

/**
 * POST /api/payroll/generate
 * Body: { month: "YYYY-MM" }
 * Creates one payroll record per active employee for the given month,
 * seeded from their stored salary. Skips employees who already have a
 * record for that month (safe to re-run for newly added employees).
 */
export async function generatePayroll(req, res) {
  const { month } = req.body
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ message: 'A valid month (YYYY-MM) is required.' })
  }

  const employees = await Employee.find({ employmentStatus: 'Active' })
  const existing = await Payroll.find({ month }).select('employee')
  const alreadyGenerated = new Set(existing.map((p) => String(p.employee)))

  const toCreate = employees
    .filter((emp) => !alreadyGenerated.has(String(emp._id)))
    .map((emp) => ({
      employee: emp._id,
      month,
      basicSalary: emp.salary,
      allowances: 0,
      deductions: 0,
      netSalary: emp.salary,
      paymentStatus: 'Unpaid',
    }))

  if (toCreate.length > 0) {
    await Payroll.insertMany(toCreate)
  }

  res.status(201).json({
    message: `Generated ${toCreate.length} payroll record(s) for ${month}.`,
    created: toCreate.length,
    skipped: employees.length - toCreate.length,
  })
}

/**
 * GET /api/payroll
 * Admin view — optional ?month=YYYY-MM filter.
 */
export async function listPayroll(req, res) {
  const filter = {}
  if (req.query.month) filter.month = req.query.month

  const records = await Payroll.find(filter)
    .populate('employee', 'name employeeId')
    .sort({ month: -1 })
    .lean()

  res.json({ records })
}

/**
 * GET /api/payroll/me
 * Employee's own payslip history.
 */
export async function myPayroll(req, res) {
  const employee = await Employee.findOne({ user: req.user._id })
  if (!employee) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const records = await Payroll.find({ employee: employee._id }).sort({ month: -1 }).lean()
  res.json({ records })
}

/**
 * PUT /api/payroll/:id
 * Admin edits allowances/deductions/paymentStatus — netSalary recalculates automatically.
 */
export async function updatePayroll(req, res) {
  const payroll = await Payroll.findById(req.params.id)
  if (!payroll) return res.status(404).json({ message: 'Payroll record not found.' })

  const { allowances, deductions, paymentStatus } = req.body

  if (allowances !== undefined) payroll.allowances = Math.max(0, Number(allowances))
  if (deductions !== undefined) payroll.deductions = Math.max(0, Number(deductions))
  if (paymentStatus !== undefined) {
    if (!['Paid', 'Unpaid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status.' })
    }
    payroll.paymentStatus = paymentStatus
  }

  payroll.netSalary = computeNet(payroll.basicSalary, payroll.allowances, payroll.deductions)
  await payroll.save()

  res.json({ payroll })
}
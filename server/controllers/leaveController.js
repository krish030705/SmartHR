import Leave from '../models/Leave.js'
import Employee from '../models/Employee.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'

function daysBetween(start, end) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const diff = Math.round((new Date(end) - new Date(start)) / MS_PER_DAY)
  return diff + 1 // inclusive of both start and end date
}

/**
 * POST /api/leave
 * Employee applies for leave.
 */
export async function applyLeave(req, res) {
  const { leaveType, startDate, endDate, reason } = req.body

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Leave type, dates, and reason are required.' })
  }
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: 'End date cannot be before start date.' })
  }

  const employee = await Employee.findOne({ user: req.user._id })
  if (!employee) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const days = daysBetween(startDate, endDate)

  const leave = await Leave.create({
    employee: employee._id,
    leaveType,
    startDate,
    endDate,
    days,
    reason,
  })

   // Notify the employee's manager, if they have one assigned.
  if (employee.manager) {
    const manager = await Employee.findById(employee.manager)
    if (manager) {
      await Notification.create({
        user: manager.user,
        message: `${employee.name} applied for ${leaveType} (${days} day${days === 1 ? '' : 's'}).`,
        type: 'leave',
      })
    }
  }

  // Also notify all admins/HR.
  const admins = await User.find({ role: 'admin', isActive: true }).select('_id')
  await Promise.all(
    admins.map((admin) =>
      Notification.create({
        user: admin._id,
        message: `${employee.name} applied for ${leaveType} (${days} day${days === 1 ? '' : 's'}).`,
        type: 'leave',
      }),
    ),
  )

  res.status(201).json({ leave })}

/**
 * GET /api/leave/me
 * Employee's own leave history.
 */
export async function myLeave(req, res) {
  const employee = await Employee.findOne({ user: req.user._id })
  if (!employee) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const leaves = await Leave.find({ employee: employee._id }).sort({ createdAt: -1 }).lean()
  res.json({ leaves })
}

/**
 * GET /api/leave
 * Admin view — all requests, optional ?status= filter.
 */
export async function listLeave(req, res) {
  const filter = {}
  if (req.query.status) filter.status = req.query.status

  const leaves = await Leave.find(filter)
    .populate('employee', 'name employeeId photoUrl')
    .sort({ createdAt: -1 })
    .lean()

  res.json({ leaves })
}

/**
 * GET /api/leave/team
 * Manager view — requests from direct reports only.
 */
export async function teamLeave(req, res) {
  const manager = await Employee.findOne({ user: req.user._id })
  if (!manager) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const teamMembers = await Employee.find({ manager: manager._id }).select('_id')
  const teamIds = teamMembers.map((e) => e._id)

  const filter = { employee: { $in: teamIds } }
  if (req.query.status) filter.status = req.query.status

  const leaves = await Leave.find(filter)
    .populate('employee', 'name employeeId photoUrl')
    .sort({ createdAt: -1 })
    .lean()

  res.json({ leaves })
}

/**
 * Shared authorization check for approve/reject:
 * Admins can act on anyone. Managers can only act on their own direct reports.
 */
async function canReview(req, leave) {
  if (req.user.role === 'admin') return true
  if (req.user.role !== 'manager') return false

  const manager = await Employee.findOne({ user: req.user._id })
  if (!manager) return false

  const leaveEmployee = await Employee.findById(leave.employee)
  return leaveEmployee && String(leaveEmployee.manager) === String(manager._id)
}

/**
 * PUT /api/leave/:id/approve
 */
export async function approveLeave(req, res) {
  const leave = await Leave.findById(req.params.id)
  if (!leave) return res.status(404).json({ message: 'Leave request not found.' })
  if (leave.status !== 'Pending') {
    return res.status(409).json({ message: 'This request has already been reviewed.' })
  }

  const allowed = await canReview(req, leave)
  if (!allowed) {
    return res.status(403).json({ message: 'You do not have access to this resource.' })
  }

  leave.status = 'Approved'
  leave.reviewedBy = req.user._id
  await leave.save()

  const notifyEmployee = await Employee.findById(leave.employee)
  if (notifyEmployee) {
    await Notification.create({
      user: notifyEmployee.user,
      message: `Your ${leave.leaveType} request (${leave.days} day${leave.days === 1 ? '' : 's'}) was approved.`,
      type: 'leave',
    })
  }

  res.json({ leave })
}

/**
 * PUT /api/leave/:id/reject
 */
export async function rejectLeave(req, res) {
  const leave = await Leave.findById(req.params.id)
  if (!leave) return res.status(404).json({ message: 'Leave request not found.' })
  if (leave.status !== 'Pending') {
    return res.status(409).json({ message: 'This request has already been reviewed.' })
  }

  const allowed = await canReview(req, leave)
  if (!allowed) {
    return res.status(403).json({ message: 'You do not have access to this resource.' })
  }

  leave.status = 'Rejected'
  leave.reviewedBy = req.user._id
  await leave.save()

  const notifyEmployee = await Employee.findById(leave.employee)
  if (notifyEmployee) {
    await Notification.create({
      user: notifyEmployee.user,
      message: `Your ${leave.leaveType} request (${leave.days} day${leave.days === 1 ? '' : 's'}) was rejected.`,
      type: 'leave',
    })
  }

  res.json({ leave })
}
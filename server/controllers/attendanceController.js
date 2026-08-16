import Attendance from '../models/Attendance.js'
import Employee from '../models/Employee.js'

const LATE_CUTOFF_HOUR = 10 // check-in after 10:00 AM counts as "Late"

function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * POST /api/attendance/check-in
 * Employee self check-in. One record per employee per calendar day.
 */
export async function checkIn(req, res) {
  const employee = await Employee.findOne({ user: req.user._id })
  if (!employee) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const today = startOfDay()
  const existing = await Attendance.findOne({ employee: employee._id, date: today })
  if (existing) {
    return res.status(409).json({ message: 'You have already checked in today.' })
  }

  const now = new Date()
  const status = now.getHours() >= LATE_CUTOFF_HOUR ? 'Late' : 'Present'

  const attendance = await Attendance.create({
    employee: employee._id,
    date: today,
    checkIn: now,
    status,
  })

  res.status(201).json({ attendance })
}

/**
 * POST /api/attendance/check-out
 * Employee self check-out. Must have checked in today first.
 */
export async function checkOut(req, res) {
  const employee = await Employee.findOne({ user: req.user._id })
  if (!employee) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const today = startOfDay()
  const attendance = await Attendance.findOne({ employee: employee._id, date: today })
  if (!attendance) {
    return res.status(400).json({ message: 'You have not checked in today.' })
  }
  if (attendance.checkOut) {
    return res.status(409).json({ message: 'You have already checked out today.' })
  }

  attendance.checkOut = new Date()
  await attendance.save()
  res.json({ attendance })
}

/**
 * GET /api/attendance/me
 * Employee's own attendance history. Optional ?month=YYYY-MM filter.
 */
export async function myAttendance(req, res) {
  const employee = await Employee.findOne({ user: req.user._id })
  if (!employee) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const filter = { employee: employee._id }
  if (req.query.month) {
    const [year, month] = req.query.month.split('-').map(Number)
    filter.date = {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1),
    }
  }

  const records = await Attendance.find(filter).sort({ date: -1 }).lean()
  res.json({ records })
}

/**
 * GET /api/attendance
 * Admin view — all employees, filterable by date and status.
 */
export async function listAttendance(req, res) {
  const filter = {}
  if (req.query.date) {
    filter.date = startOfDay(new Date(req.query.date))
  }
  if (req.query.status) {
    filter.status = req.query.status
  }

  const records = await Attendance.find(filter)
    .populate('employee', 'name employeeId photoUrl')
    .sort({ date: -1 })
    .lean()

  res.json({ records })
}

/**
 * GET /api/attendance/team
 * Manager view — attendance for employees who report to this manager.
 */
export async function teamAttendance(req, res) {
  const manager = await Employee.findOne({ user: req.user._id })
  if (!manager) {
    return res.status(404).json({ message: 'No employee profile linked to this account.' })
  }

  const teamMembers = await Employee.find({ manager: manager._id }).select('_id')
  const teamIds = teamMembers.map((e) => e._id)

  const filter = { employee: { $in: teamIds } }
  if (req.query.date) {
    filter.date = startOfDay(new Date(req.query.date))
  }

  const records = await Attendance.find(filter)
    .populate('employee', 'name employeeId photoUrl')
    .sort({ date: -1 })
    .lean()

  res.json({ records })
}
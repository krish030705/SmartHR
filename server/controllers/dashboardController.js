import User from '../models/User.js'
import Department from '../models/Department.js'
import Leave from '../models/Leave.js'
export async function getAdminStats(_req, res) {
  const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true })
  const totalManagers = await User.countDocuments({ role: 'manager', isActive: true })
  const totalDepartments = await Department.countDocuments()
  const pendingLeaveRequests = await Leave.countDocuments({ status: 'Pending' })

  res.json({
    totalEmployees,
    totalManagers,
    totalDepartments,
    presentToday: 0, // wired up in a later phase (Attendance dashboard summary)
    absentToday: 0,
    onLeaveToday: 0,
    pendingLeaveRequests,
    recentActivities: [],
  })
}
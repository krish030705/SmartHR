import User from '../models/User.js'
import Department from '../models/Department.js'

export async function getAdminStats(_req, res) {
  const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true })
  const totalManagers = await User.countDocuments({ role: 'manager', isActive: true })
  const totalDepartments = await Department.countDocuments()

  res.json({
    totalEmployees,
    totalManagers,
    totalDepartments,
    presentToday: 0, // wired up in Phase 10 (Attendance)
    absentToday: 0,
    onLeaveToday: 0,
    pendingLeaveRequests: 0, // wired up in Phase 11 (Leave Management)
    recentActivities: [],
  })
}
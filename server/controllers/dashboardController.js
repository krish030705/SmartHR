import User from '../models/User.js'

// Employee/Department/Attendance/Leave models don't exist yet (Phases
// 7-11), so this does NOT fabricate numbers for them. It reports what's
// real today (accounts by role) and zeroes for the rest — each zero gets
// replaced with a real query as its module is built.
export async function getAdminStats(_req, res) {
  const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true })
  const totalManagers = await User.countDocuments({ role: 'manager', isActive: true })

  res.json({
    totalEmployees,
    totalManagers,
    totalDepartments: 0, // wired up in Phase 9 (Departments)
    presentToday: 0, // wired up in Phase 10 (Attendance)
    absentToday: 0,
    onLeaveToday: 0,
    pendingLeaveRequests: 0, // wired up in Phase 11 (Leave Management)
    recentActivities: [],
  })
}
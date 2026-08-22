import { Routes, Route } from 'react-router-dom'
import RoleSelect from '../pages/RoleSelect.jsx'
import AdminLogin from '../pages/auth/AdminLogin.jsx'
import ManagerLogin from '../pages/auth/ManagerLogin.jsx'
import EmployeeLogin from '../pages/auth/EmployeeLogin.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import EmployeesList from '../pages/admin/employees/EmployeesList.jsx'
import PlaceholderDashboard from '../pages/PlaceholderDashboard.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import SetNewPassword from '../pages/auth/SetNewPassword.jsx'
import EmployeeProfile from '../pages/admin/employees/EmployeeProfile.jsx'
import DepartmentsList from '../pages/admin/departments/DepartmentsList.jsx'
import AttendanceList from '../pages/admin/AttendanceList.jsx'
import EmployeeDashboard from '../pages/employee/EmployeeDashboard.jsx'
import ManagerDashboard from '../pages/manager/ManagerDashboard.jsx'
import AdminLeaveList from '../pages/admin/AdminLeaveList.jsx'
import MyLeave from '../pages/employee/MyLeave.jsx'
import AdminPayrollList from '../pages/admin/AdminPayrollList.jsx'
import MySalary from '../pages/employee/MySalary.jsx'
import AdminHolidaysList from '../pages/admin/AdminHolidaysList.jsx'
import EmployeeHolidays from '../pages/employee/EmployeeHolidays.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login/employee" element={<EmployeeLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-password" element={<ProtectedRoute><SetNewPassword /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['admin']}><EmployeesList /></ProtectedRoute>} />
      <Route path="/admin/employees/:id" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeProfile /></ProtectedRoute>} />
      <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><DepartmentsList /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['admin']}><AttendanceList /></ProtectedRoute>} />
     <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/admin/leave" element={<ProtectedRoute allowedRoles={['admin']}><AdminLeaveList /></ProtectedRoute>} />
<Route path="/employee/leave" element={<ProtectedRoute allowedRoles={['employee']}><MyLeave /></ProtectedRoute>} />
<Route path="/admin/payroll" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayrollList /></ProtectedRoute>} />
<Route path="/employee/salary" element={<ProtectedRoute allowedRoles={['employee']}><MySalary /></ProtectedRoute>} />
<Route path="/admin/holidays" element={<ProtectedRoute allowedRoles={['admin']}><AdminHolidaysList /></ProtectedRoute>} />
<Route path="/employee/holidays" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeHolidays /></ProtectedRoute>} />
<Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsPage role="admin" /></ProtectedRoute>} />
<Route path="/manager/settings" element={<ProtectedRoute allowedRoles={['manager']}><SettingsPage role="manager" /></ProtectedRoute>} />
<Route path="/employee/settings" element={<ProtectedRoute allowedRoles={['employee']}><SettingsPage role="employee" /></ProtectedRoute>} />
    </Routes>
  )
}
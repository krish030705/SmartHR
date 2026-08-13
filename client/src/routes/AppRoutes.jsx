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
      <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><PlaceholderDashboard role="manager" /></ProtectedRoute>} />
      <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['employee']}><PlaceholderDashboard role="employee" /></ProtectedRoute>} />

      <Route path="*" element={<RoleSelect />} />
    </Routes>
  )
}
import { Routes, Route } from 'react-router-dom'
import RoleSelect from '../pages/RoleSelect.jsx'
import AdminLogin from '../pages/auth/AdminLogin.jsx'
import ManagerLogin from '../pages/auth/ManagerLogin.jsx'
import EmployeeLogin from '../pages/auth/EmployeeLogin.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'
import PlaceholderDashboard from '../pages/PlaceholderDashboard.jsx'

// NOTE: ProtectedRoute + real role-based guarding lands in Phase 5.
// Dashboard routes are open placeholders for now so Phase 1 can be tested
// end to end (login → redirect → landing screen).
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login/employee" element={<EmployeeLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/admin/dashboard" element={<PlaceholderDashboard role="admin" />} />
      <Route path="/manager/dashboard" element={<PlaceholderDashboard role="manager" />} />
      <Route path="/employee/dashboard" element={<PlaceholderDashboard role="employee" />} />

      <Route path="*" element={<RoleSelect />} />
    </Routes>
  )
}

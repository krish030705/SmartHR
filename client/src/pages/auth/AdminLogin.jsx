import AuthLayout from '../../layouts/AuthLayout.jsx'
import LoginForm from './LoginForm.jsx'

export default function AdminLogin() {
  return (
    <AuthLayout roleKey="admin">
      <LoginForm role="admin" accent="#1B4B43" dashboardPath="/admin/dashboard" />
    </AuthLayout>
  )
}

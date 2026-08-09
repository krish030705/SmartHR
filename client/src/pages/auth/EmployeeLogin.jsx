import AuthLayout from '../../layouts/AuthLayout.jsx'
import LoginForm from './LoginForm.jsx'

export default function EmployeeLogin() {
  return (
    <AuthLayout roleKey="employee">
      <LoginForm role="employee" accent="#B2562F" dashboardPath="/employee/dashboard" />
    </AuthLayout>
  )
}

import AuthLayout from '../../layouts/AuthLayout.jsx'
import LoginForm from './LoginForm.jsx'

export default function ManagerLogin() {
  return (
    <AuthLayout roleKey="manager">
      <LoginForm role="manager" accent="#5B4B8A" dashboardPath="/manager/dashboard" />
    </AuthLayout>
  )
}

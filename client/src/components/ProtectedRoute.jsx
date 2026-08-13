import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

const LOGIN_PATH_BY_ROLE = {
  admin: '/login/admin',
  manager: '/login/manager',
  employee: '/login/employee',
}

// Wrap any route element that requires auth. Not logged in -> redirect to
// that role's login. Logged in but wrong role -> redirect to their OWN
// dashboard, not a dead end.
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <LoadingSpinner size={28} className="text-brand-700" />
      </div>
    )
  }

  if (!user) {
    const fallbackRole = allowedRoles?.[0] || 'admin'
    return (
      <Navigate to={LOGIN_PATH_BY_ROLE[fallbackRole]} replace state={{ from: location }} />
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  // A forced password change blocks every other protected page.
  if (user.mustChangePassword && location.pathname !== '/set-password') {
    return <Navigate to="/set-password" replace />
  }

return children }
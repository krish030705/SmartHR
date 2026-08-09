/**
 * Temporary landing screen after login. Confirms auth + routing work
 * end-to-end before the real dashboards (Admin: Phase 6, Manager: Phase 12,
 * Employee: Phase 13) are built.
 */
export default function PlaceholderDashboard({ role }) {
  const user = JSON.parse(
    localStorage.getItem('smarthr_user') || sessionStorage.getItem('smarthr_user') || 'null',
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <span className="font-display text-2xl font-medium text-ink">
        Welcome{user?.email ? `, ${user.email}` : ''}
      </span>
      <p className="mt-2 text-sm capitalize text-slate-soft">{role} dashboard — coming in a later phase.</p>
    </div>
  )
}

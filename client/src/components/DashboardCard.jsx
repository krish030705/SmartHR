export default function DashboardCard({ label, value, icon: Icon, accent = '#1B4B43', accentSoft = '#EAF2EF' }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-soft">{label}</p>
        {Icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: accentSoft, color: accent }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-medium text-ink">{value}</p>
    </div>
  )
}
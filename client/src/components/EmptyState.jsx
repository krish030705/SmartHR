/**
 * Shown wherever a list/table has no data yet (e.g. no employees, no leave
 * requests). Treats emptiness as direction, not a dead end — always pairs
 * the message with the action that would fix it.
 */
export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/10 bg-white/60 px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h10M4 17h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-soft">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

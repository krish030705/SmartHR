import LoadingSpinner from './LoadingSpinner.jsx'
import EmptyState from './EmptyState.jsx'

export default function DataTable({ columns, rows, keyField = '_id', loading, emptyTitle, emptyDescription }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size={24} className="text-brand-700" />
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle || 'No results'} description={emptyDescription} />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-black/5 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-soft">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-ink">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
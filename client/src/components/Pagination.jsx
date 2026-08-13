import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-1 pt-3 text-sm text-slate-soft">
      <span>Page {page} of {totalPages} · {total} total</span>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-black/5"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-black/5"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
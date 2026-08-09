import LoadingSpinner from './LoadingSpinner.jsx'

/**
 * Reusable button. `accent` lets a page swap the fill color (e.g. per role)
 * without every page reimplementing button styles from scratch.
 */
export default function Button({
  children,
  loading = false,
  disabled = false,
  accent = '#1B4B43', // defaults to brand-700
  type = 'submit',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      style={{ backgroundColor: accent }}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm
        font-semibold text-paper transition-opacity hover:opacity-90 focus-visible:outline-offset-2
        disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {loading && <LoadingSpinner size={16} />}
      {loading ? 'Signing in…' : children}
    </button>
  )
}

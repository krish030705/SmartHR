import { useState } from 'react'

/**
 * Reusable form input.
 * - Shows a label, optional error message, and (for type="password")
 *   a show/hide toggle so we don't duplicate that logic on every login page.
 */
export default function Input({
  id,
  label,
  type = 'text',
  error,
  className = '',
  ...rest
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`input-base ${isPassword ? 'pr-11' : ''} ${
            error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-slate-soft hover:text-ink"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

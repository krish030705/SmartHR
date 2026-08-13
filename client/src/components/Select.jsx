export default function Select({ id, label, error, options, placeholder, className = '', ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`input-base ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
}
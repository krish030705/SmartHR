export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-black/5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.key ? 'text-brand-700' : 'text-slate-soft hover:text-ink'
          }`}
        >
          {tab.label}
          {active === tab.key && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-700" />
          )}
        </button>
      ))}
    </div>
  )
}
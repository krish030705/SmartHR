/**
 * Shared shell for all three login pages. Keeps the brand panel, layout,
 * and footer identical across roles — only the accent color, role label,
 * and form content change per page.
 *
 * roleKey drives the accent color so a person always has a visual cue for
 * which portal they're in (teal = Admin, violet = Manager, clay = Employee) —
 * the same accent then carries into that role's nav/dashboard later.
 */
const ROLE_COPY = {
  admin: {
    accent: '#1B4B43',
    accentSoft: '#EAF2EF',
    eyebrow: 'Admin / HR Portal',
    heading: 'Run the whole organization from one place.',
    sub: 'Employees, departments, payroll, and policy — all in view.',
  },
  manager: {
    accent: '#5B4B8A',
    accentSoft: '#EFEDF6',
    eyebrow: 'Manager Portal',
    heading: 'Keep your team moving, without the noise.',
    sub: 'Attendance, leave approvals, and team profiles at a glance.',
  },
  employee: {
    accent: '#B2562F',
    accentSoft: '#F7EBE3',
    eyebrow: 'Employee Portal',
    heading: 'Your work day, in one tab.',
    sub: 'Attendance, leave, payslips, and holidays — self-serve.',
  },
}

function OrgNetwork({ color }) {
  // Signature visual: a small constellation of connected nodes — the one
  // motif that recurs across SmartHR's brand surfaces, standing in for
  // "people, connected" without resorting to literal avatar icons.
  const nodes = [
    [40, 40], [140, 20], [230, 70], [70, 130],
    [180, 150], [110, 210], [250, 200],
  ]
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [3, 5], [4, 5], [4, 6],
  ]
  return (
    <svg viewBox="0 0 280 240" className="h-full w-full" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={color} strokeOpacity="0.35" strokeWidth="1.5"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i} cx={x} cy={y}
          r={i === 0 ? 7 : 5}
          fill={color}
          fillOpacity={i === 0 ? 1 : 0.75}
        />
      ))}
    </svg>
  )
}

export default function AuthLayout({ roleKey, children }) {
  const copy = ROLE_COPY[roleKey] ?? ROLE_COPY.admin

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Brand panel — hidden on small screens to keep the form the focus on mobile */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden px-12 py-10 lg:flex"
        style={{ backgroundColor: copy.accent }}
      >
        <div className="relative z-10">
          <span className="font-display text-2xl font-medium tracking-tight text-paper">
            SmartHR
          </span>
          <p className="mt-1 text-sm text-paper/70">{copy.eyebrow}</p>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="font-display text-3xl font-medium leading-tight text-paper">
            {copy.heading}
          </h1>
          <p className="mt-3 text-sm text-paper/75">{copy.sub}</p>
        </div>

        <div className="absolute -bottom-10 -right-10 h-72 w-72 opacity-90">
          <OrgNetwork color="#F6F4EF" />
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <span className="font-display text-xl font-medium text-ink">SmartHR</span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: copy.accentSoft, color: copy.accent }}
            >
              {copy.eyebrow}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { Employee } from '../../types'
import { fmt$, teamLabel } from '../../utils/formatters'

interface Props { employees: Employee[] }

function quartileBg(q: number) {
  if (q === 0) return 'bg-apple-green/20 border-apple-green/30 hover:border-apple-green/60'
  if (q === 1) return 'bg-apple-green/8 border-apple-green/15 hover:border-apple-green/35'
  if (q === 2) return 'bg-apple-yellow/8 border-apple-yellow/15 hover:border-apple-yellow/35'
  return 'bg-apple-red/10 border-apple-red/20 hover:border-apple-red/45'
}

function quartileText(q: number) {
  if (q === 0) return 'text-apple-green'
  if (q === 1) return 'text-apple-green/70'
  if (q === 2) return 'text-apple-yellow'
  return 'text-apple-red'
}

export function OrgHeatmap({ employees }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const sorted = [...employees].sort((a, b) => b.netContribution - a.netContribution)
  const q = Math.ceil(sorted.length / 4)
  const withQ = sorted.map((e, i) => ({ ...e, quartile: Math.min(3, Math.floor(i / q)) }))

  const legend = [
    { label: 'Top 25%', color: 'bg-apple-green/40' },
    { label: 'Q2',      color: 'bg-apple-green/15' },
    { label: 'Q3',      color: 'bg-apple-yellow/15' },
    { label: 'Bottom',  color: 'bg-apple-red/20' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        {legend.map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-label-secondary">
            <div className={`w-3 h-3 rounded-sm ${l.color} border border-black/10`} />
            {l.label}
          </div>
        ))}
      </div>

      {(['alpha', 'beta', 'gamma'] as const).map(team => {
        const teamEmps = withQ.filter(e => e.team === team)
        return (
          <div key={team}>
            <p className="text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-2">{teamLabel[team]}</p>
            <div className="grid grid-cols-5 gap-2">
              {teamEmps.map(emp => (
                <div
                  key={emp.id}
                  className={`relative border rounded-apple p-2.5 transition-all duration-150 cursor-default ${quartileBg(emp.quartile)}`}
                  onMouseEnter={() => setHovered(emp.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <p className="text-xs font-medium text-label-primary truncate leading-tight">{emp.name.split(' ')[0]}</p>
                  <p className={`text-xs font-bold tabular-nums mt-0.5 ${quartileText(emp.quartile)}`}>
                    {fmt$(emp.netContribution)}
                  </p>

                  {hovered === emp.id && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 glass rounded-apple p-3 z-10 shadow-apple-lg text-xs">
                      <p className="font-semibold text-label-primary mb-1.5">{emp.name}</p>
                      <div className="space-y-1 text-label-secondary">
                        <p>Net: <span className={quartileText(emp.quartile)}>{fmt$(emp.netContribution)}</span></p>
                        <p>Retention risk: <span className={emp.retentionRisk >= 75 ? 'text-apple-red' : emp.retentionRisk >= 50 ? 'text-apple-yellow' : 'text-apple-green'}>{emp.retentionRisk}%</span></p>
                        <p>Score: {emp.accountabilityScore}/100</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

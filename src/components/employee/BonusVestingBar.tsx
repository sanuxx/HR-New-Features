import type { Employee } from '../../types'
import { employees } from '../../data/employees'
import { Card } from '../ui/Card'
import { fmt$ } from '../../utils/formatters'
import { IconCheck, IconX, IconTarget } from '../ui/Icons'

interface Props { employee: Employee }

export function BonusVestingBar({ employee }: Props) {
  const pct = employee.bonusVestingPercent
  const vested = Math.round((pct / 100) * employee.bonusTarget)
  const qualityOk = employee.qualityScore >= 80
  const teamMembers = employees.filter(e => e.team === employee.team)
  const teamNetContribution = teamMembers.reduce((sum, e) => sum + e.netContribution, 0)
  const teamOk = teamNetContribution > 0

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="label-secondary flex items-center gap-1.5">
          <IconTarget size={13} /> Bonus Vesting
        </p>
        <span className="text-[11px] text-label-tertiary">Q2 2026</span>
      </div>

      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[28px] font-bold text-label-primary tracking-tight">{fmt$(vested)}</span>
        <span className="text-sm text-label-tertiary">of {fmt$(employee.bonusTarget)}</span>
      </div>

      <div className="relative w-full bg-bg-elevated rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #0071e3, #30d158)',
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { ok: qualityOk, label: `Quality ≥80% (${employee.qualityScore})` },
          { ok: teamOk,    label: `Team net ${teamOk ? '+' : ''}${(teamNetContribution/1000).toFixed(0)}k/mo` },
        ].map(({ ok, label }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${ok ? 'bg-apple-green/10 text-apple-green' : 'bg-apple-red/10 text-apple-red'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${ok ? 'bg-apple-green/20' : 'bg-apple-red/20'}`}>
              {ok ? <IconCheck size={9} strokeWidth={2.5} /> : <IconX size={9} strokeWidth={2.5} />}
            </div>
            {label}
          </div>
        ))}
      </div>
    </Card>
  )
}

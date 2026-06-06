import { useState } from 'react'
import type { Employee } from '../../types'
import { Card } from '../ui/Card'
import { PnLTimelineChart } from '../charts/PnLTimelineChart'
import { fmt$ } from '../../utils/formatters'
import { employees } from '../../data/employees'
import { IconTrendingUp, IconUsers, IconActivity } from '../ui/Icons'

interface Props { employee: Employee }

export function MyPnLView({ employee }: Props) {
  const [qualityImprove, setQualityImprove] = useState(0)
  const projectedGain = Math.round(employee.netContribution * (qualityImprove / 100) * 0.8)
  const teamTotal = employees.filter(e => e.managerId === employee.managerId).reduce((s, e) => s + e.netContribution, 0)
  const companyTotal = employees.reduce((s, e) => s + e.netContribution, 0)

  const stats = [
    { label: 'My Net Contribution', value: fmt$(Math.round(employee.netContribution / 10) * 10), sub: 'per month', positive: employee.netContribution >= 0, Icon: IconTrendingUp },
    { label: 'Team Total', value: fmt$(teamTotal), sub: 'my team this month', positive: teamTotal >= 0, Icon: IconUsers },
    { label: 'Company Total', value: fmt$(companyTotal), sub: 'org-wide this month', positive: companyTotal >= 0, Icon: IconActivity },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, positive, Icon }) => (
          <Card key={label}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-bg-elevated rounded-xl flex items-center justify-center text-label-tertiary">
                <Icon size={15} />
              </div>
              <span className="label-secondary">{label}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${positive ? 'text-apple-green' : 'text-apple-red'}`}>{value}</p>
            <p className="text-xs text-label-tertiary mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-sm font-semibold text-label-primary tracking-tight mb-0.5">What-If Simulator</p>
        <p className="label-secondary mb-4">Drag the slider to project your contribution increase if quality improves</p>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range" min={0} max={30} value={qualityImprove}
            onChange={e => setQualityImprove(+e.target.value)}
            className="flex-1"
          />
          <span className="text-sm font-semibold text-apple-blue w-14 text-right tabular-nums">+{qualityImprove}%</span>
        </div>
        {qualityImprove > 0 ? (
          <div className="p-3 bg-apple-green/8 border border-apple-green/20 rounded-xl text-sm text-apple-green flex items-center gap-2">
            <IconTrendingUp size={14} />
            Projected additional contribution: <strong className="font-semibold">{fmt$(projectedGain)}/month</strong>
          </div>
        ) : (
          <div className="p-3 bg-bg-elevated rounded-xl text-sm text-label-tertiary">
            Move the slider to see your projected impact
          </div>
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold text-label-primary tracking-tight mb-4">My P&L — Last 30 Days</p>
        <PnLTimelineChart data={employee.pnlHistory} />
      </Card>
    </div>
  )
}

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import type { SimulatorOutputs } from '../../types'
import { BASELINE_OUTPUTS } from '../../utils/simulatorEngine'
import { fmt$ } from '../../utils/formatters'

interface Props {
  current: SimulatorOutputs
  height?: number
}

export function SimulatorOutputChart({ current, height = 260 }: Props) {
  const data = [
    { name: 'Payroll Cost', Baseline: BASELINE_OUTPUTS.totalPayrollCost, Scenario: current.totalPayrollCost },
    { name: 'Revenue',      Baseline: BASELINE_OUTPUTS.projectedRevenue,  Scenario: current.projectedRevenue },
    { name: 'EBITDA',       Baseline: BASELINE_OUTPUTS.ebitda,            Scenario: current.ebitda },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#6e6e73', fontSize: 12, fontFamily: 'system-ui' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#86868b', fontSize: 10, fontFamily: 'system-ui' }} tickFormatter={fmt$} width={80} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          labelStyle={{ color: '#1d1d1f', fontSize: 12, fontWeight: 600 }}
          itemStyle={{ fontSize: 12 }}
          formatter={(v) => fmt$(v as number)}
        />
        <Legend wrapperStyle={{ color: '#6e6e73', fontSize: 12 }} />
        <Bar dataKey="Baseline" fill="#d2d2d7" radius={[4,4,0,0]} />
        <Bar dataKey="Scenario" fill="#0071e3" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

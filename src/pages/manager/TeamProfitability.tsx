import { useRoleStore } from '../../store/useRoleStore'
import { getTeamEmployees } from '../../data/employees'
import { ProfitabilityTable } from '../../components/manager/ProfitabilityTable'
import { Card } from '../../components/ui/Card'
import { fmt$ } from '../../utils/formatters'
import { IconDollarSign } from '../../components/ui/Icons'

export function TeamProfitability() {
  const { activeManagerId } = useRoleStore()
  const team = getTeamEmployees(activeManagerId)
  const totalRevenue = team.reduce((s, e) => s + e.revenueAttributable, 0)
  const totalCost    = team.reduce((s, e) => s + e.fullyLoadedCost, 0)
  const totalNet     = totalRevenue - totalCost
  const revenuePerFTE = Math.round(totalRevenue / team.length)

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-green/10 rounded-2xl flex items-center justify-center">
            <IconDollarSign size={22} className="text-apple-green" />
          </div>
          <div>
            <h1 className="page-title">Team Profitability</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Net contribution breakdown — click any row to drill down into 30-day P&L.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue/mo',  value: fmt$(totalRevenue),   color: 'text-apple-green' },
          { label: 'Total Cost/mo',     value: fmt$(totalCost),      color: 'text-apple-red' },
          { label: 'Net Contribution',  value: fmt$(totalNet),       color: totalNet >= 0 ? 'text-apple-green' : 'text-apple-red' },
          { label: 'Revenue / FTE',     value: fmt$(revenuePerFTE),  color: 'text-label-primary' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <p className="label-secondary mb-2">{label}</p>
            <p className={`text-xl font-bold tracking-tight tabular-nums ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      <ProfitabilityTable employees={team} />
    </div>
  )
}

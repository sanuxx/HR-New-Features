import { employees } from '../../data/employees'
import { OrgHeatmap } from '../../components/cfo/OrgHeatmap'
import { ProfitabilityTable } from '../../components/manager/ProfitabilityTable'
import { Card } from '../../components/ui/Card'
import { fmt$ } from '../../utils/formatters'
import { IconMap } from '../../components/ui/Icons'

export function OrgAnalytics() {
  const positive = employees.filter(e => e.netContribution >= 0)
  const negative = employees.filter(e => e.netContribution < 0)
  const top = employees.reduce((b, e) => e.netContribution > b.netContribution ? e : b)

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
            <IconMap size={22} className="text-apple-blue" />
          </div>
          <div>
            <h1 className="page-title">Org Analytics</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Strategic workforce heatmap and profitability breakdown.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Employees',  value: employees.length.toString(), color: 'text-label-primary' },
          { label: 'Net Positive',     value: positive.length.toString(),  color: 'text-apple-green' },
          { label: 'Net Negative',     value: negative.length.toString(),  color: 'text-apple-red' },
          { label: 'Top Contributor',  value: top.name.split(' ')[0],      color: 'text-apple-blue', sub: fmt$(top.netContribution) + '/mo' },
        ].map(({ label, value, color, sub }) => (
          <Card key={label}>
            <p className="label-secondary mb-2">{label}</p>
            <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
            {sub && <p className="text-xs text-apple-green mt-0.5 font-medium">{sub}</p>}
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-sm font-semibold text-label-primary mb-5">Strategic Workforce Heatmap</p>
        <OrgHeatmap employees={employees} />
      </Card>

      <div>
        <h2 className="section-title mb-4">Full Profitability Table</h2>
        <ProfitabilityTable employees={employees} />
      </div>
    </div>
  )
}

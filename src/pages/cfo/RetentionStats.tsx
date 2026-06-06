import { employees } from '../../data/employees'
import { retentionAlerts } from '../../data/retention'
import { RetentionRiskPanel } from '../../components/manager/RetentionRiskPanel'
import { RetentionRiskChart } from '../../components/charts/RetentionRiskChart'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { IconBell } from '../../components/ui/Icons'

export function RetentionStats() {
  const avgRisk = Math.round(employees.reduce((s, e) => s + e.retentionRisk, 0) / employees.length)
  const critical = retentionAlerts.filter(a => a.level === 'critical')
  const watch    = retentionAlerts.filter(a => a.level === 'watch')

  const riskBadge = (score: number) => {
    if (score >= 75) return 'bg-red-50 text-apple-red border border-red-200'
    if (score >= 50) return 'bg-amber-50 text-amber-700 border border-amber-200'
    return 'bg-green-50 text-apple-green border border-green-200'
  }

  const kpis = [
    { label: 'Avg Org Risk',    value: `${avgRisk}%`, sub: 'org-wide average', tile: 'kpi-yellow', iconBg: 'bg-amber-100 text-amber-700' },
    { label: 'Critical Alerts', value: `${critical.length}`, sub: 'staff at >75% risk',  tile: 'kpi-red',    iconBg: 'bg-red-100 text-red-700' },
    { label: 'Watch List',      value: `${watch.length}`,    sub: 'risk 50–74%',          tile: 'kpi-yellow', iconBg: 'bg-amber-100 text-amber-700' },
    { label: 'Model Accuracy',  value: '87%',                sub: 'v1.2 rule-based model', tile: 'kpi-green', iconBg: 'bg-green-100 text-green-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-red/10 rounded-2xl flex items-center justify-center">
            <IconBell size={22} className="text-apple-red" />
          </div>
          <div>
            <h1 className="page-title">Retention Intelligence</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Org-wide retention risk — ML model retrained weekly on anonymized exit data.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(({ label, value, sub, tile, iconBg }) => (
          <div key={label} className={`apple-card ${tile} p-5`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
              <IconBell size={14} />
            </div>
            <p className="text-3xl font-bold text-label-primary tracking-tight tabular-nums">{value}</p>
            <p className="text-xs font-semibold text-label-secondary mt-1">{label}</p>
            <p className="text-[11px] text-label-tertiary mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h2 className="section-title mb-4">All Risk Alerts</h2>
          <RetentionRiskPanel alerts={retentionAlerts} />
        </Card>
        <Card>
          <p className="label-secondary mb-4">Risk vs Accountability Scatter</p>
          <RetentionRiskChart height={300} />
          <div className="flex gap-5 mt-4 pt-3 border-t border-separator">
            {[
              { label: 'Critical (>75%)', color: 'bg-apple-red' },
              { label: 'Watch (50–74%)',  color: 'bg-amber-400' },
              { label: 'Stable (<50%)',   color: 'bg-apple-green' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-label-secondary">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="section-title mb-4">All Employees — Risk Summary</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[...employees].sort((a, b) => b.retentionRisk - a.retentionRisk).map(emp => (
            <div key={emp.id} className="flex items-center justify-between bg-bg-elevated rounded-apple px-3 py-2.5 border border-separator">
              <span className="text-sm text-label-primary font-medium">{emp.name}</span>
              <Badge label={`${emp.retentionRisk}%`} className={riskBadge(emp.retentionRisk)} dot />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
